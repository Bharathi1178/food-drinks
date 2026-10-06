import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSettings } from './SettingsContext';
import { useCustomerAuth } from './CustomerAuthContext';

const POSContext = createContext();

export const POSProvider = ({ children }) => {
  const { settings } = useSettings();
  const { currentCustomer } = useCustomerAuth();

  // Cart Items
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('bitepos_active_cart')) || [];
    } catch {
      return [];
    }
  });

  // Order Details - Online Food Delivery by default
  const [orderType, setOrderType] = useState('Delivery'); // 'Delivery' | 'Takeaway' | 'Dine In'
  const [tableNo, setTableNo] = useState('Table 1');
  const [selectedCustomer, setSelectedCustomer] = useState(() => {
    return currentCustomer || {
      name: 'Customer',
      phone: '9876543210',
    };
  });

  // Delivery Address & Detailed Location (Online Food Delivery)
  const [deliveryDistrict, setDeliveryDistrict] = useState(
    () => currentCustomer?.district || ''
  );
  const [deliveryArea, setDeliveryArea] = useState(
    () => currentCustomer?.area || ''
  );
  const [deliveryAddress, setDeliveryAddress] = useState(
    () => currentCustomer?.address || ''
  );
  const [deliveryLandmark, setDeliveryLandmark] = useState(
    () => currentCustomer?.landmark || ''
  );
  const [deliveryBuildingDetails, setDeliveryBuildingDetails] = useState(
    () => currentCustomer?.buildingDetails || ''
  );
  const [deliveryInstructions, setDeliveryInstructions] = useState('Leave at door');
  const [deliveryOtherInstructions, setDeliveryOtherInstructions] = useState('');

  // Automatically attach customer details when logged in
  useEffect(() => {
    if (currentCustomer) {
      setSelectedCustomer(currentCustomer);
      if (currentCustomer.district) setDeliveryDistrict(currentCustomer.district);
      if (currentCustomer.area) setDeliveryArea(currentCustomer.area);
      if (currentCustomer.address) setDeliveryAddress(currentCustomer.address);
      if (currentCustomer.landmark) setDeliveryLandmark(currentCustomer.landmark);
      if (currentCustomer.buildingDetails) setDeliveryBuildingDetails(currentCustomer.buildingDetails);
    }
  }, [currentCustomer]);

  // Discount
  const [discountType, setDiscountType] = useState('percentage'); // 'percentage' | 'fixed'
  const [discountValue, setDiscountValue] = useState(0);

  // Held Orders
  const [heldOrders, setHeldOrders] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('bitepos_held_orders')) || [];
    } catch {
      return [];
    }
  });

  // Modals state
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
  const [isHeldOrdersModalOpen, setHeldOrdersModalOpen] = useState(false);
  const [isCustomerModalOpen, setCustomerModalOpen] = useState(false);
  const [activeReceipt, setActiveReceipt] = useState(null); // Receipt data for thermal printer view

  // Persist active cart
  useEffect(() => {
    localStorage.setItem('bitepos_active_cart', JSON.stringify(cart));
  }, [cart]);

  // Persist held orders
  useEffect(() => {
    localStorage.setItem('bitepos_held_orders', JSON.stringify(heldOrders));
  }, [heldOrders]);

  // Cart operations
  const addToCart = (product, customQty = 1, customAddons = []) => {
    if (!product || product.stock <= 0 || product.available === false) {
      return false;
    }

    const qtyToAdd = typeof customQty === 'number' && customQty > 0 ? customQty : 1;
    const addons = Array.isArray(customAddons) ? customAddons : [];
    const addonsCost = addons.reduce((sum, a) => sum + (Number(a.price) || 0), 0);
    const unitPrice = Number(product.price) + addonsCost;
    const addonNames = addons.map((a) => a.name).join(', ');
    const displayName = addonNames ? `${product.name} (+${addonNames})` : product.name;

    setCart((prev) => {
      // If no addons, match on id. If addons, match on exact name/addons
      const existing = prev.find((item) => item.id === product.id && (!addons.length || item.name === displayName));
      if (existing) {
        // Prevent exceeding available stock
        if (existing.quantity + qtyToAdd > product.stock) {
          alert(`Cannot add more than ${product.stock} items (stock limit).`);
          return prev;
        }
        return prev.map((item) =>
          item === existing
            ? { ...item, quantity: item.quantity + qtyToAdd, total: (item.quantity + qtyToAdd) * item.price }
            : item
        );
      } else {
        return [
          ...prev,
          {
            id: product.id,
            name: displayName,
            baseId: product.id,
            price: unitPrice,
            category: product.category,
            image: product.image,
            stock: product.stock,
            quantity: qtyToAdd,
            total: unitPrice * qtyToAdd,
            addons,
          },
        ];
      }
    });
    return true;
  };

  const updateQuantity = (productId, delta) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.id === productId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            if (newQty > item.stock) {
              alert(`Cannot exceed available stock (${item.stock})`);
              return item;
            }
            return {
              ...item,
              quantity: newQty,
              total: newQty * item.price,
            };
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setDiscountValue(0);
  };

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + (Number(item.total) || 0), 0);

  const discountAmount =
    discountType === 'percentage'
      ? Math.round(((subtotal * Number(discountValue || 0)) / 100) * 100) / 100
      : Math.min(subtotal, Number(discountValue || 0));

  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxRate = settings?.invoice?.taxRate ?? 5;
  const taxAmount = Math.round(((taxableAmount * taxRate) / 100) * 100) / 100;
  const grandTotal = Math.round((taxableAmount + taxAmount) * 100) / 100;

  // Hold Order
  const holdCurrentOrder = (note = '') => {
    if (cart.length === 0) return false;

    const newHeld = {
      id: `HOLD-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      cart: [...cart],
      orderType,
      tableNo,
      customer: { ...selectedCustomer },
      subtotal,
      discountAmount,
      grandTotal,
      note,
    };

    setHeldOrders((prev) => [newHeld, ...prev]);
    clearCart();
    return true;
  };

  const resumeOrder = (held) => {
    setCart(held.cart);
    setOrderType(held.orderType || 'Dine In');
    setTableNo(held.tableNo || 'Table 1');
    if (held.customer) setSelectedCustomer(held.customer);
    setHeldOrders((prev) => prev.filter((h) => h.id !== held.id));
    setHeldOrdersModalOpen(false);
  };

  const deleteHeldOrder = (heldId) => {
    setHeldOrders((prev) => prev.filter((h) => h.id !== heldId));
  };

  return (
    <POSContext.Provider
      value={{
        cart,
        setCart,
        orderType,
        setOrderType,
        tableNo,
        setTableNo,
        selectedCustomer,
        setSelectedCustomer,
        discountType,
        setDiscountType,
        discountValue,
        setDiscountValue,
        subtotal,
        discountAmount,
        taxRate,
        taxAmount,
        grandTotal,
        heldOrders,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        holdCurrentOrder,
        resumeOrder,
        deleteHeldOrder,
        isPaymentModalOpen,
        setPaymentModalOpen,
        isHeldOrdersModalOpen,
        setHeldOrdersModalOpen,
        isCustomerModalOpen,
        setCustomerModalOpen,
        deliveryDistrict,
        setDeliveryDistrict,
        deliveryArea,
        setDeliveryArea,
        deliveryAddress,
        setDeliveryAddress,
        deliveryLandmark,
        setDeliveryLandmark,
        deliveryBuildingDetails,
        setDeliveryBuildingDetails,
        deliveryInstructions,
        setDeliveryInstructions,
        deliveryOtherInstructions,
        setDeliveryOtherInstructions,
        activeReceipt,
        setActiveReceipt,
      }}
    >
      {children}
    </POSContext.Provider>
  );
};

export const usePOS = () => useContext(POSContext);
