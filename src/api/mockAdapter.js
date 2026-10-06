import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_CUSTOMERS,
  INITIAL_ORDERS,
  INITIAL_INVENTORY_LOGS,
  INITIAL_SETTINGS
} from './mockData';
import { customerDB } from './customerDatabase';

// Determine backend URL (local Django server if running locally, or custom env, or null for static Vercel)
const BACKEND_BASE = import.meta.env.VITE_API_BASE_URL || (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://127.0.0.1:8000/api' : null);

// Local storage key constants
const KEYS = {
  PRODUCTS: 'bitepos_products',
  CATEGORIES: 'bitepos_categories',
  CUSTOMERS: 'bitepos_customer_database',
  ORDERS: 'bitepos_orders',
  INVENTORY_LOGS: 'bitepos_inventory_logs',
  SETTINGS: 'bitepos_settings',
  HELD_ORDERS: 'bitepos_held_orders',
};

// Seed storage if not present & cleanse any legacy dummy customer data
export const initStorage = () => {
  const DATA_VERSION = 'v6_original_27_dishes';
  const storedVersion = localStorage.getItem('bitepos_menu_version');

  if (storedVersion !== DATA_VERSION || !localStorage.getItem(KEYS.PRODUCTS) || !localStorage.getItem(KEYS.CATEGORIES)) {
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
    localStorage.setItem('bitepos_menu_version', DATA_VERSION);
  }

  // Ensure clean customer database without unwanted dummy names
  customerDB.getAll();

  // Cleanse legacy dummy orders and fake initial orders from localStorage
  try {
    const rawOrders = localStorage.getItem(KEYS.ORDERS);
    if (!rawOrders) {
      localStorage.setItem(KEYS.ORDERS, JSON.stringify([]));
    } else {
      const parsedOrders = JSON.parse(rawOrders);
      // Retain only authentic customer orders (exclude fake seed orders ord-1001, ord-1002, Walk-in Customer)
      const cleanedOrders = parsedOrders.filter((ord) => {
        const isDummyId = ord.id === 'ord-1001' || ord.id === 'ord-1002';
        const isDummyName = ['Priya Patel', 'Anand Kumar', 'Rahul Sharma', 'Sneha Verma', 'Walk-in Customer'].includes(ord.customerName);
        return !isDummyId && !isDummyName;
      });
      localStorage.setItem(KEYS.ORDERS, JSON.stringify(cleanedOrders));
    }
  } catch {
    localStorage.setItem(KEYS.ORDERS, JSON.stringify([]));
  }

  if (!localStorage.getItem(KEYS.INVENTORY_LOGS)) {
    localStorage.setItem(KEYS.INVENTORY_LOGS, JSON.stringify(INITIAL_INVENTORY_LOGS));
  }
  if (!localStorage.getItem(KEYS.SETTINGS)) {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
  }
  if (!localStorage.getItem(KEYS.HELD_ORDERS)) {
    localStorage.setItem(KEYS.HELD_ORDERS, JSON.stringify([]));
  }
};

// Reset storage to defaults (useful in Settings)
export const resetToDefaults = () => {
  localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
  localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
  customerDB.saveAll([]);
  localStorage.setItem(KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
  localStorage.setItem(KEYS.INVENTORY_LOGS, JSON.stringify(INITIAL_INVENTORY_LOGS));
  localStorage.setItem(KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
  localStorage.setItem(KEYS.HELD_ORDERS, JSON.stringify([]));
};

const getStored = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
};

const setStored = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Synchronous / mock handler for Axios interceptor
export const handleMockRequest = async (config) => {
  initStorage();
  const { url, method, data: rawData, params } = config;
  const data = typeof rawData === 'string' ? (rawData ? JSON.parse(rawData) : {}) : rawData;

  // Simulate network latency (50ms - 150ms for realistic POS responsiveness)
  await new Promise((res) => setTimeout(res, 60));

  // --- Auth ---
  if (url === '/auth/login' && method.toLowerCase() === 'post') {
    const { email, password } = data;
    const settings = JSON.parse(localStorage.getItem(KEYS.SETTINGS)) || INITIAL_SETTINGS;
    const user = settings.users.find(u => u.email === email || email.includes(u.role.toLowerCase())) 
      || { id: 'usr-1', name: 'Aarav Patel', role: 'Cashier', email };
    return { data: { token: 'mock-jwt-token-12345', user }, status: 200 };
  }

  // --- Products ---
  if (url === '/products') {
    if (method.toLowerCase() === 'get') {
      let items = getStored(KEYS.PRODUCTS);
      if (params?.category && params.category !== 'all') {
        items = items.filter(p => p.category === params.category);
      }
      if (params?.search) {
        const query = params.search.toLowerCase();
        items = items.filter(p => p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query));
      }
      return { data: items, status: 200 };
    }
    if (method.toLowerCase() === 'post') {
      const items = getStored(KEYS.PRODUCTS);
      const newProduct = {
        ...data,
        id: `prod-${Date.now()}`,
        available: data.available !== false,
      };
      items.unshift(newProduct);
      setStored(KEYS.PRODUCTS, items);
      return { data: newProduct, status: 201 };
    }
  }

  if (url.startsWith('/products/')) {
    const id = url.split('/')[2];
    const items = getStored(KEYS.PRODUCTS);
    const index = items.findIndex(p => p.id === id);

    if (method.toLowerCase() === 'put' || method.toLowerCase() === 'patch') {
      if (index !== -1) {
        items[index] = { ...items[index], ...data };
        setStored(KEYS.PRODUCTS, items);
        return { data: items[index], status: 200 };
      }
      return { data: { message: 'Product not found' }, status: 404 };
    }

    if (method.toLowerCase() === 'delete') {
      const filtered = items.filter(p => p.id !== id);
      setStored(KEYS.PRODUCTS, filtered);
      return { data: { success: true }, status: 200 };
    }
  }

  // --- Categories ---
  if (url === '/categories') {
    if (method.toLowerCase() === 'get') {
      return { data: getStored(KEYS.CATEGORIES), status: 200 };
    }
    if (method.toLowerCase() === 'post') {
      const cats = getStored(KEYS.CATEGORIES);
      const newCat = {
        ...data,
        id: `cat-${Date.now()}`,
        slug: data.slug || data.name.toLowerCase().replace(/\s+/g, '-'),
        active: true,
      };
      cats.push(newCat);
      setStored(KEYS.CATEGORIES, cats);
      return { data: newCat, status: 201 };
    }
  }

  if (url.startsWith('/categories/')) {
    const id = url.split('/')[2];
    const cats = getStored(KEYS.CATEGORIES);
    const index = cats.findIndex(c => c.id === id);

    if (method.toLowerCase() === 'put') {
      if (index !== -1) {
        cats[index] = { ...cats[index], ...data };
        setStored(KEYS.CATEGORIES, cats);
        return { data: cats[index], status: 200 };
      }
      return { data: { message: 'Category not found' }, status: 404 };
    }

    if (method.toLowerCase() === 'delete') {
      const filtered = cats.filter(c => c.id !== id);
      setStored(KEYS.CATEGORIES, filtered);
      return { data: { success: true }, status: 200 };
    }
  }

  // --- Orders ---
  if (url === '/orders') {
    if (method.toLowerCase() === 'get') {
      if (BACKEND_BASE) {
        try {
          const backendRes = await fetch(`${BACKEND_BASE}/orders/`);
          if (backendRes.ok) {
            const backendData = await backendRes.json();
            const list = Array.isArray(backendData) ? backendData : backendData?.results || [];
            // Keep localStorage updated with real orders from database
            const mapped = list.map((o) => ({
              id: o.id,
              tokenNo: o.token_no || o.tokenNo,
              orderType: o.order_type || o.orderType || 'Delivery',
              customerName: o.customer_name || o.customerName,
              customerPhone: o.customer_phone || o.customerPhone,
              items: o.items || [],
              subtotal: Number(o.subtotal || o.grand_total || 0),
              discount: Number(o.discount || 0),
              tax: Number(o.tax || 0),
              grandTotal: Number(o.grand_total || o.grandTotal || 0),
              paymentMethod: o.payment_method || o.paymentMethod || 'Cash on Delivery',
              paymentStatus: o.payment_status || o.paymentStatus || 'Paid',
              status: o.status || 'Preparing',
              deliveryAddress: o.delivery_address || o.deliveryAddress || o.address || '',
              deliveryDistrict: o.delivery_district || o.deliveryDistrict || o.district || '',
              deliveryArea: o.delivery_area || o.deliveryArea || o.area || '',
              deliveryLandmark: o.delivery_landmark || o.deliveryLandmark || o.landmark || '',
              deliveryBuildingDetails: o.delivery_building_details || o.deliveryBuildingDetails || o.buildingDetails || '',
              deliveryInstructions: o.delivery_instructions || o.deliveryInstructions || '',
              location: o.location || ([o.delivery_area || o.deliveryArea, o.delivery_district || o.deliveryDistrict].filter(Boolean).join(', ')),
              date: o.date || (o.created_at ? o.created_at.split('T')[0] : new Date().toISOString().split('T')[0]),
              time: o.time || '',
              created_at: o.created_at,
              createdAt: o.created_at,
            }));
            setStored(KEYS.ORDERS, mapped);
            return { data: mapped, status: 200 };
          }
        } catch (e) {
          // fallback to storage if backend is temporarily unreachable
        }
      }
      return { data: getStored(KEYS.ORDERS), status: 200 };
    }
    if (method.toLowerCase() === 'post') {
      const orders = getStored(KEYS.ORDERS);
      const products = getStored(KEYS.PRODUCTS);
      const inventoryLogs = getStored(KEYS.INVENTORY_LOGS);

      let savedBackendOrder = null;
      if (BACKEND_BASE) {
        try {
          const backendRes = await fetch(`${BACKEND_BASE}/orders/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            order_type: data.orderType || 'Delivery',
            table_no: data.tableNo || '',
            customer_name: data.customerName || 'Customer',
            customer_phone: data.customerPhone || '',
            items: data.items || [],
            subtotal: Number(data.subtotal) || Number(data.grandTotal) || 0,
            tax: Number(data.tax) || 0,
            discount: Number(data.discount) || 0,
            grand_total: Number(data.grandTotal) || 0,
            payment_method: data.paymentMethod || 'Cash on Delivery',
            payment_status: data.paymentStatus || 'Pending (Pay on Delivery)',
            cashier_name: data.cashierName || 'Website Customer',
            amount_received: Number(data.amountReceived) || Number(data.grandTotal) || 0,
            change_due: Number(data.changeDue) || 0,
            transaction_id: data.transactionId || `TXN-${Date.now()}`,
            status: data.status || 'PLACED',
            deliveryAddress: data.deliveryAddress || data.address || '',
            deliveryDistrict: data.deliveryDistrict || '',
            deliveryArea: data.deliveryArea || '',
            deliveryLandmark: data.deliveryLandmark || '',
            deliveryBuildingDetails: data.deliveryBuildingDetails || '',
            deliveryInstructions: data.deliveryInstructions || '',
            location: data.location || (data.deliveryArea && data.deliveryDistrict ? `${data.deliveryArea}, ${data.deliveryDistrict}` : (data.deliveryDistrict || data.deliveryArea || '')),
          }),
        });
        if (backendRes.ok) {
          savedBackendOrder = await backendRes.json();
        } else {
          const errText = await backendRes.text();
          console.warn('Backend order creation returned status', backendRes.status, errText);
        }
      } catch (err) {
        console.warn('Backend order creation notice:', err.message);
      }
    }

      const orderCount = orders.length + 1;
      const newOrder = {
        ...data,
        id: savedBackendOrder?.id || data.id || `ORD-${1000 + orderCount}`,
        tokenNo: savedBackendOrder?.token_no || savedBackendOrder?.tokenNo || data.tokenNo || `T-${String(orderCount % 100 || 1).padStart(2, '0')}`,
        date: data.date || new Date().toISOString().split('T')[0],
        time: data.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: savedBackendOrder?.status || data.status || 'PLACED',
        paymentMethod: data.paymentMethod || 'Cash on Delivery',
        paymentStatus: data.paymentStatus || 'Pending (Pay on Delivery)',
        created_at: savedBackendOrder?.created_at || data.created_at || new Date().toISOString(),
        createdAt: savedBackendOrder?.created_at || data.createdAt || new Date().toISOString(),
      };

      // 1. Deduct stock for each product in items
      if (Array.isArray(newOrder.items)) {
        newOrder.items.forEach(item => {
          const pIndex = products.findIndex(p => p.id === item.id);
          if (pIndex !== -1) {
            const oldStock = products[pIndex].stock;
            const newStock = Math.max(0, oldStock - item.quantity);
            products[pIndex].stock = newStock;
            if (newStock === 0) products[pIndex].available = false;

            inventoryLogs.unshift({
              id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
              productId: item.id,
              productName: item.name,
              type: 'POS Deduction',
              quantity: -item.quantity,
              previousStock: oldStock,
              newStock,
              reason: `Order ${newOrder.id} sale`,
              date: `${newOrder.date} ${newOrder.time}`,
              user: newOrder.cashierName || 'Cashier',
            });
          }
        });
        setStored(KEYS.PRODUCTS, products);
        setStored(KEYS.INVENTORY_LOGS, inventoryLogs);
      }

      // 2. Automatically record / update customer in Customer Database with location and address
      if (newOrder.customerPhone && newOrder.customerPhone !== '9999999999') {
        const orderLoc = newOrder.location || (newOrder.deliveryArea && newOrder.deliveryDistrict ? `${newOrder.deliveryArea}, ${newOrder.deliveryDistrict}` : (newOrder.deliveryDistrict || newOrder.deliveryArea || ''));
        customerDB.recordOrder(
          newOrder.customerName,
          newOrder.customerPhone,
          newOrder.grandTotal,
          `${newOrder.date} ${newOrder.time}`,
          {
            address: newOrder.deliveryAddress || newOrder.address || '',
            location: orderLoc,
          }
        );
      }

      orders.unshift(newOrder);
      setStored(KEYS.ORDERS, orders);

      // 3. Immediately dispatch real-time event
      try {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('bitepos_new_order', { detail: newOrder }));
          localStorage.setItem('bitepos_last_order_timestamp', Date.now().toString());
        }
      } catch (evtErr) {
        console.warn('Order event dispatch note:', evtErr);
      }

      return { data: newOrder, status: 201 };
    }
  }

  if (url.startsWith('/orders/')) {
    const id = url.split('/')[2];
    const orders = getStored(KEYS.ORDERS);
    const index = orders.findIndex(o => o.id === id);

    if (method.toLowerCase() === 'patch' || method.toLowerCase() === 'put') {
      if (BACKEND_BASE) {
        try {
          await fetch(`${BACKEND_BASE}/orders/${id}/`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });
        } catch (e) {
          // Continue even if backend is offline
        }
      }

      if (index !== -1) {
        orders[index] = { ...orders[index], ...data };
        setStored(KEYS.ORDERS, orders);
        try {
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('bitepos_order_status_change', { detail: orders[index] }));
            window.dispatchEvent(new CustomEvent('bitepos_new_order', { detail: orders[index] }));
          }
        } catch (evtErr) {}
        return { data: orders[index], status: 200 };
      }
      return { data: { message: 'Order not found' }, status: 404 };
    }
  }

  // --- Employee Authentication & Endpoints ---
  if (url === '/employee/login' || url === '/employee/login/') {
    if (BACKEND_BASE) {
      try {
        const backendRes = await fetch(`${BACKEND_BASE}/employee/login/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        const resJson = await backendRes.json();
        return { data: resJson, status: backendRes.status };
      } catch (e) {
        // Offline fallback
      }
    }
  }

  // --- Customer Database Endpoints ---
  if (url === '/customers') {
    if (method.toLowerCase() === 'get') {
      return { data: customerDB.getAll(), status: 200 };
    }
    if (method.toLowerCase() === 'post') {
      const created = customerDB.create(data);
      return { data: created, status: 201 };
    }
  }

  if (url.startsWith('/customers/')) {
    const id = url.split('/')[2];

    if (method.toLowerCase() === 'put') {
      const updated = customerDB.update(id, data);
      if (updated) {
        return { data: updated, status: 200 };
      }
      return { data: { message: 'Customer not found' }, status: 404 };
    }
    if (method.toLowerCase() === 'delete') {
      customerDB.delete(id);
      return { data: { success: true }, status: 200 };
    }
  }

  // --- Inventory & Logs ---
  if (url === '/inventory') {
    const products = getStored(KEYS.PRODUCTS);
    const logs = getStored(KEYS.INVENTORY_LOGS);
    return { data: { products, logs }, status: 200 };
  }

  if (url === '/inventory/stock-in' && method.toLowerCase() === 'post') {
    const { productId, quantity, reason, user } = data;
    const products = getStored(KEYS.PRODUCTS);
    const logs = getStored(KEYS.INVENTORY_LOGS);
    const pIndex = products.findIndex(p => p.id === productId);

    if (pIndex !== -1) {
      const oldStock = products[pIndex].stock;
      const newStock = oldStock + Number(quantity);
      products[pIndex].stock = newStock;
      if (newStock > 0) products[pIndex].available = true;

      const log = {
        id: `log-${Date.now()}`,
        productId,
        productName: products[pIndex].name,
        type: 'Stock In',
        quantity: Number(quantity),
        previousStock: oldStock,
        newStock,
        reason: reason || 'Stock replenishment',
        date: new Date().toLocaleString(),
        user: user || 'Admin',
      };

      logs.unshift(log);
      setStored(KEYS.PRODUCTS, products);
      setStored(KEYS.INVENTORY_LOGS, logs);
      return { data: { product: products[pIndex], log }, status: 200 };
    }
    return { data: { message: 'Product not found' }, status: 404 };
  }

  if (url === '/inventory/adjustment' && method.toLowerCase() === 'post') {
    const { productId, newStock, reason, user } = data;
    const products = getStored(KEYS.PRODUCTS);
    const logs = getStored(KEYS.INVENTORY_LOGS);
    const pIndex = products.findIndex(p => p.id === productId);

    if (pIndex !== -1) {
      const oldStock = products[pIndex].stock;
      const targetStock = Math.max(0, Number(newStock));
      const diff = targetStock - oldStock;
      products[pIndex].stock = targetStock;
      if (targetStock === 0) products[pIndex].available = false;

      const log = {
        id: `log-${Date.now()}`,
        productId,
        productName: products[pIndex].name,
        type: 'Adjustment',
        quantity: diff,
        previousStock: oldStock,
        newStock: targetStock,
        reason: reason || 'Inventory physical count adjustment',
        date: new Date().toLocaleString(),
        user: user || 'Admin',
      };

      logs.unshift(log);
      setStored(KEYS.PRODUCTS, products);
      setStored(KEYS.INVENTORY_LOGS, logs);
      return { data: { product: products[pIndex], log }, status: 200 };
    }
    return { data: { message: 'Product not found' }, status: 404 };
  }

  // --- Reports ---
  if (url === '/reports') {
    const orders = getStored(KEYS.ORDERS);
    const products = getStored(KEYS.PRODUCTS);

    const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.grandTotal) || 0), 0);
    const totalOrders = orders.length;

    // Calculate approximate COGS
    let totalCost = 0;
    orders.forEach(o => {
      o.items?.forEach(item => {
        const p = products.find(prod => prod.id === item.id);
        const cost = p?.costPrice || (item.price * 0.4);
        totalCost += cost * item.quantity;
      });
    });

    const grossProfit = totalRevenue - totalCost;
    const totalGst = orders.reduce((sum, o) => sum + (Number(o.tax) || 0), 0);

    // Payment methods breakdown
    const paymentBreakdown = { Cash: 0, UPI: 0, Card: 0, Other: 0 };
    orders.forEach(o => {
      const mode = o.paymentMethod || 'Other';
      paymentBreakdown[mode] = (paymentBreakdown[mode] || 0) + Number(o.grandTotal || 0);
    });

    return {
      data: {
        totalRevenue,
        totalOrders,
        grossProfit,
        totalGst,
        paymentBreakdown,
        orders,
      },
      status: 200
    };
  }

  // --- Settings ---
  if (url === '/settings') {
    if (method.toLowerCase() === 'get') {
      return { data: JSON.parse(localStorage.getItem(KEYS.SETTINGS)) || INITIAL_SETTINGS, status: 200 };
    }
    if (method.toLowerCase() === 'put') {
      localStorage.setItem(KEYS.SETTINGS, JSON.stringify(data));
      return { data, status: 200 };
    }
  }

  // Fallback
  return { data: { message: 'Mock endpoint not handled', url }, status: 200 };
};
