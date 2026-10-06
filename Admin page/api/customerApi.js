import axiosAdmin from './axiosAdmin';

const DUMMY_NAMES = ['rahul sharma', 'priya patel', 'anand kumar', 'sneha verma'];

export const customerApi = {
  getCustomers: async (params = {}) => {
    // 1. Fetch existing customers from Django Backend
    let backendCustomers = [];
    try {
      const res = await axiosAdmin.get('/customers/', { params });
      backendCustomers = Array.isArray(res.data) ? res.data : [];
    } catch (err) {
      console.warn('Backend customers API fallback to local DB:', err.message);
    }

    // 2. Fetch existing orders from Django Backend and localStorage
    let backendOrders = [];
    try {
      const ordRes = await axiosAdmin.get('/orders/');
      backendOrders = Array.isArray(ordRes.data) ? ordRes.data : [];
    } catch (err) {
      // ignore
    }

    let localOrders = [];
    try {
      const rawOrders = localStorage.getItem('bitepos_orders');
      localOrders = rawOrders ? JSON.parse(rawOrders) : [];
    } catch (err) {
      // ignore
    }

    // Merge and deduplicate all orders by ID
    const orderMap = new Map();
    [...localOrders, ...backendOrders].forEach((o) => {
      if (o && o.id) {
        orderMap.set(o.id, { ...(orderMap.get(o.id) || {}), ...o });
      }
    });
    const allOrders = Array.from(orderMap.values());

    // 3. Load local customers from localStorage
    let localCusts = [];
    try {
      const raw = localStorage.getItem('bitepos_customer_database') || localStorage.getItem('bitepos_customers');
      if (raw) {
        localCusts = JSON.parse(raw);
      }
    } catch (err) {
      localCusts = [];
    }

    // 4. Combine backend & local customers, filtering out only dummy demo placeholders
    const dedupMap = new Map();

    const addOrMergeCustomer = (cust) => {
      if (!cust) return;
      const rawName = (cust.name || '').trim();
      const rawPhone = (cust.phone || '').trim();
      const nameLower = rawName.toLowerCase();

      // Skip walk-in placeholders or empty records
      if (!rawName && !rawPhone) return;
      if (nameLower === 'walk-in customer' || rawPhone === '9999999999') return;
      if (DUMMY_NAMES.includes(nameLower) && (!rawPhone || rawPhone === '9812345678')) return;

      const key = rawPhone ? `phone_${rawPhone}` : `name_${nameLower}`;

      if (!dedupMap.has(key)) {
        dedupMap.set(key, { ...cust });
      } else {
        const prev = dedupMap.get(key);
        dedupMap.set(key, {
          ...prev,
          ...cust,
          id: (cust.id && /^AB-\d+$/.test(cust.id)) ? cust.id : prev.id,
          name: cust.name || prev.name,
          phone: cust.phone || prev.phone,
          email: cust.email || prev.email || '',
          address: cust.address || prev.address || '',
          landmark: cust.landmark || prev.landmark || '',
          deliveryAddress: cust.deliveryAddress || prev.deliveryAddress || cust.address || prev.address || '',
          deliveryLandmark: cust.deliveryLandmark || prev.deliveryLandmark || cust.landmark || prev.landmark || '',
          total_orders: Math.max(Number(prev.total_orders || prev.totalOrders || 0), Number(cust.total_orders || cust.totalOrders || 0)),
          total_spent: Math.max(Number(prev.total_spent || prev.totalSpent || 0), Number(cust.total_spent || cust.totalSpent || 0)),
          lastOrder: cust.lastOrder || prev.lastOrder || 'Never',
          last_order: cust.last_order || prev.last_order || 'Never',
          createdAt: cust.createdAt || prev.createdAt || cust.created_at || prev.created_at || '',
          created_at: cust.created_at || prev.created_at || cust.createdAt || prev.createdAt || '',
        });
      }
    };

    backendCustomers.forEach(addOrMergeCustomer);
    localCusts.forEach(addOrMergeCustomer);

    // 5. Synthesize/update customers from ALL placed orders (e.g. Reshma placing an order)
    allOrders.forEach((o) => {
      const cName = (o.customerName || o.customer || '').trim();
      const cPhone = (o.customerPhone || '').trim();
      const nameLower = cName.toLowerCase();

      if (!cName && !cPhone) return;
      if (nameLower === 'walk-in customer' || cPhone === '9999999999') return;
      if (DUMMY_NAMES.includes(nameLower)) return;

      const key = cPhone ? `phone_${cPhone}` : `name_${nameLower}`;
      const orderTotal = Number(o.grandTotal || o.total || o.subtotal || 0);
      const orderDate = o.date || (o.created_at ? o.created_at.split('T')[0] : new Date().toISOString().split('T')[0]);
      const orderAddr = o.deliveryAddress || o.address || '';
      const orderLandmark = o.deliveryLandmark || o.landmark || '';

      if (!dedupMap.has(key)) {
        dedupMap.set(key, {
          name: cName || 'Customer',
          phone: cPhone,
          email: o.customerEmail || o.email || '',
          address: orderAddr,
          landmark: orderLandmark,
          deliveryAddress: orderAddr,
          deliveryLandmark: orderLandmark,
          total_orders: 1,
          totalOrders: 1,
          total_spent: orderTotal,
          totalSpent: orderTotal,
          lastOrder: orderDate,
          last_order: orderDate,
          createdAt: orderDate,
          created_at: orderDate,
        });
      } else {
        const prev = dedupMap.get(key);
        if (orderAddr && !prev.address) prev.address = orderAddr;
        if (orderAddr) prev.deliveryAddress = orderAddr;
        if (orderLandmark) prev.deliveryLandmark = orderLandmark;
      }
    });

    const uniqueCustomers = Array.from(dedupMap.values());

    // 6. Enrich each customer with accurate order count, total spent, delivery address, and last order date
    const enrichedCustomers = uniqueCustomers.map((cust) => {
      const custPhone = (cust.phone || '').trim();
      const custName = (cust.name || '').trim().toLowerCase();

      const custOrders = allOrders.filter((o) => {
        const oPhone = (o.customerPhone || '').trim();
        const oName = (o.customerName || o.customer || '').trim().toLowerCase();
        return (custPhone && oPhone && custPhone === oPhone) || (custName && oName && custName === oName);
      });

      let latestAddress = cust.address || cust.deliveryAddress || '';
      let latestLandmark = cust.landmark || cust.deliveryLandmark || '';
      let lastOrderDate = cust.lastOrder || cust.last_order || '';
      let orderCount = Number(cust.total_orders || cust.totalOrders || 0);
      let totalSpent = Number(cust.total_spent || cust.totalSpent || 0);

      if (custOrders.length > 0) {
        orderCount = Math.max(orderCount, custOrders.length);
        const orderSpendSum = custOrders.reduce((sum, o) => sum + Number(o.grandTotal || o.total || 0), 0);
        totalSpent = Math.max(totalSpent, orderSpendSum);

        const latestOrder = custOrders[0];
        if (latestOrder.deliveryAddress) latestAddress = latestOrder.deliveryAddress;
        if (latestOrder.deliveryLandmark) latestLandmark = latestOrder.deliveryLandmark;
        if (latestOrder.date || latestOrder.created_at) {
          lastOrderDate = latestOrder.date || (latestOrder.created_at ? latestOrder.created_at.split('T')[0] : '');
        }
      }

      const signupDate = cust.created_at
        ? cust.created_at.split('T')[0]
        : (cust.createdAt || (custOrders.length > 0 ? (custOrders[custOrders.length - 1].date || custOrders[custOrders.length - 1].created_at?.split('T')[0]) : new Date().toISOString().split('T')[0]));

      return {
        ...cust,
        address: latestAddress,
        landmark: latestLandmark,
        deliveryAddress: latestAddress,
        deliveryLandmark: latestLandmark,
        total_orders: orderCount,
        totalOrders: orderCount,
        total_spent: totalSpent,
        totalSpent: totalSpent,
        lastOrder: lastOrderDate || 'Never',
        last_order: lastOrderDate || 'Never',
        createdAt: signupDate,
        created_at: signupDate,
      };
    });

    // 7. Stable IDs assignment: Preserve AB-101, AB-102, AB-103, and allocate AB-104+ sequentially
    const knownIds = {
      kunal: 'AB-101',
      bharathi: 'AB-102',
      ashok: 'AB-103',
    };

    let nextIdCounter = 101;
    const usedIds = new Set();

    enrichedCustomers.forEach((c) => {
      const lower = (c.name || '').trim().toLowerCase();
      if (knownIds[lower]) {
        c.id = knownIds[lower];
        usedIds.add(c.id);
      } else if (c.id && /^AB-\d+$/.test(c.id)) {
        usedIds.add(c.id);
      }
    });

    const finalCustomers = enrichedCustomers.map((c) => {
      if (!c.id || !/^AB-\d+$/.test(c.id)) {
        while (usedIds.has(`AB-${nextIdCounter}`)) {
          nextIdCounter++;
        }
        c.id = `AB-${nextIdCounter}`;
        usedIds.add(c.id);
        nextIdCounter++;
      }
      return c;
    });

    // Sort by ID ascending (AB-101, AB-102, AB-103, AB-104...)
    finalCustomers.sort((a, b) => {
      const numA = parseInt((a.id || '').replace(/\D/g, ''), 10) || 999;
      const numB = parseInt((b.id || '').replace(/\D/g, ''), 10) || 999;
      return numA - numB;
    });

    // 8. Update localStorage with comprehensive customer list
    try {
      localStorage.setItem('bitepos_customer_database', JSON.stringify(finalCustomers));
      localStorage.setItem('bitepos_customers', JSON.stringify(finalCustomers));
    } catch (e) {
      // ignore
    }

    // 9. Asynchronously sync any missing customer into Django Backend SQLite
    try {
      const backendPhones = new Set(backendCustomers.map((c) => String(c.phone || '').trim()));
      const backendNames = new Set(backendCustomers.map((c) => String(c.name || '').trim().toLowerCase()));

      finalCustomers.forEach((cust) => {
        const p = String(cust.phone || '').trim();
        const n = String(cust.name || '').trim().toLowerCase();
        if ((p && !backendPhones.has(p)) || (n && !backendNames.has(n))) {
          axiosAdmin.post('/customers/', {
            name: cust.name,
            phone: cust.phone || '',
            email: cust.email || '',
            address: cust.address || cust.deliveryAddress || '',
            total_orders: cust.total_orders || cust.totalOrders || 0,
            total_spent: cust.total_spent || cust.totalSpent || 0,
          }).catch(() => {});
        }
      });
    } catch (e) {
      // ignore
    }

    return finalCustomers;
  },

  getCustomerById: async (id) => {
    try {
      const res = await axiosAdmin.get(`/customers/${id}/`);
      return res.data;
    } catch (err) {
      const all = await customerApi.getCustomers();
      return all.find((c) => c.id === id) || null;
    }
  },

  deleteCustomer: async (id, phone, name) => {
    // 1. Delete from Django backend
    try {
      await axiosAdmin.delete(`/customers/${id}/`);
    } catch (err) {
      console.warn('Backend customer delete fallback:', err.message);
    }

    // 2. Delete from localStorage
    try {
      const matchCriteria = (c) => {
        if (c.id === id) return true;
        if (phone && c.phone === phone) return true;
        if (name && c.name && c.name.toLowerCase() === name.toLowerCase()) return true;
        return false;
      };

      ['bitepos_customer_database', 'bitepos_customers'].forEach((key) => {
        const raw = localStorage.getItem(key);
        if (raw) {
          const list = JSON.parse(raw);
          const filtered = list.filter((c) => !matchCriteria(c));
          localStorage.setItem(key, JSON.stringify(filtered));
        }
      });
    } catch (e) {
      console.warn('Local customer delete note:', e);
    }

    return { success: true, id };
  },

  updateCustomer: async (id, updatedData) => {
    try {
      await axiosAdmin.patch(`/customers/${id}/`, updatedData);
    } catch (err) {
      console.warn('Backend update fallback:', err.message);
    }

    try {
      ['bitepos_customer_database', 'bitepos_customers'].forEach((key) => {
        const raw = localStorage.getItem(key);
        if (raw) {
          const list = JSON.parse(raw);
          const updated = list.map((c) => (c.id === id ? { ...c, ...updatedData } : c));
          localStorage.setItem(key, JSON.stringify(updated));
        }
      });
    } catch (e) {
      // ignore
    }

    return { success: true, ...updatedData };
  },
};
