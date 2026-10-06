
// Helper to sync customer record to Django backend SQLite
const syncToBackend = (customer) => {
  try {
    if (!customer?.phone || customer.phone === '9999999999') return;
    fetch('http://127.0.0.1:8000/api/customers/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: customer.name,
        phone: customer.phone,
        email: customer.email || '',
        location: customer.location || customer.district || '',
        address: customer.address || customer.deliveryAddress || '',
        total_orders: customer.totalOrders || customer.total_orders || 0,
        total_spent: customer.totalSpent || customer.total_spent || 0,
      }),
    }).catch(() => {});
  } catch (err) {}
};
// Dedicated Customer Database Engine for Fast Food POS
// Stores real customer input (Name, Phone, Email, Address, Order History, Total Spent)

const CUSTOMER_DB_KEY = 'bitepos_customer_database';
const LEGACY_CUSTOMERS_KEY = 'bitepos_customers';

// Cleanse any old dummy customer names from previous sessions
const DUMMY_NAMES = ['Rahul Sharma', 'Priya Patel', 'Anand Kumar', 'Sneha Verma'];

export const customerDB = {
  // Get all customers from DB
  getAll: () => {
    try {
      let data = JSON.parse(localStorage.getItem(CUSTOMER_DB_KEY));
      if (!data) {
        // Check if legacy key has custom data or dummy data
        const legacy = JSON.parse(localStorage.getItem(LEGACY_CUSTOMERS_KEY));
        if (legacy && Array.isArray(legacy)) {
          // Filter out dummy names
          data = legacy.filter((c) => !DUMMY_NAMES.includes(c.name));
        } else {
          data = [];
        }
        localStorage.setItem(CUSTOMER_DB_KEY, JSON.stringify(data));
      } else {
        // Scrub any dummy names that might have persisted
        const scrubbed = data.filter((c) => !DUMMY_NAMES.includes(c.name));
        if (scrubbed.length !== data.length) {
          data = scrubbed;
          localStorage.setItem(CUSTOMER_DB_KEY, JSON.stringify(data));
        }
      }

      // Cleanse any legacy "Vadamadurai" locations from stored records
      if (Array.isArray(data)) {
        let changed = false;
        data = data.map((c) => {
          if (c && c.location && c.location.toLowerCase().includes('vadamadurai')) {
            changed = true;
            const addr = (c.address || c.deliveryAddress || '').toLowerCase();
            let realLoc = '';
            if (addr.includes('chennai')) {
              realLoc = addr.includes('perungudi') ? 'Perungudi, Chennai' : 'Chennai';
            } else if (c.district || c.area) {
              realLoc = [c.area, c.district].filter((x) => x && !x.toLowerCase().includes('vadamadurai')).join(', ');
            }
            return { ...c, location: realLoc };
          }
          return c;
        });
        if (changed) {
          localStorage.setItem(CUSTOMER_DB_KEY, JSON.stringify(data));
          localStorage.setItem(LEGACY_CUSTOMERS_KEY, JSON.stringify(data));
        }
      }

      return data;
    } catch {
      return [];
    }
  },

  // Save full customer list
  saveAll: (customers) => {
    localStorage.setItem(CUSTOMER_DB_KEY, JSON.stringify(customers));
    localStorage.setItem(LEGACY_CUSTOMERS_KEY, JSON.stringify(customers));
  },

  // Lookup customer by phone number
  findByPhone: (phone) => {
    if (!phone || phone === '9999999999') return null;
    const cleanPhone = phone.trim().replace(/\D/g, '');
    const customers = customerDB.getAll();
    return customers.find(
      (c) => c.phone.replace(/\D/g, '') === cleanPhone
    ) || null;
  },

  // Lookup customer by phone or email
  findByEmailOrPhone: (identifier) => {
    if (!identifier) return null;
    const trimmed = identifier.trim().toLowerCase();
    const cleanDigits = trimmed.replace(/\D/g, '');
    const customers = customerDB.getAll();

    return customers.find((c) => {
      const pDigits = (c.phone || '').replace(/\D/g, '');
      const emailLower = (c.email || '').toLowerCase();
      return (cleanDigits && pDigits === cleanDigits) || (emailLower && emailLower === trimmed);
    }) || null;
  },

  // Register customer with signup details & default preferences
  register: (signupData) => {
    const customers = customerDB.getAll();
    const cleanPhone = (signupData.phone || '').trim();
    const cleanEmail = (signupData.email || '').trim().toLowerCase();

    // Check if already registered
    const existing = customerDB.findByEmailOrPhone(cleanPhone || cleanEmail);
    if (existing) {
      // Update with new signup details
      const updated = {
        ...existing,
        name: signupData.name ? signupData.name.trim() : existing.name,
        email: cleanEmail || existing.email,
        phone: cleanPhone || existing.phone,
        address: signupData.address ? signupData.address.trim() : existing.address,
        landmark: signupData.landmark ? signupData.landmark.trim() : existing.landmark,
        password: signupData.password || existing.password || 'Bite@1234',
        foodPreference: signupData.foodPreference || existing.foodPreference || 'all',
        defaultOrderType: signupData.defaultOrderType || existing.defaultOrderType || 'Delivery',
        spicePreference: signupData.spicePreference || existing.spicePreference || 'Medium',
        orderAlerts: signupData.orderAlerts !== undefined ? signupData.orderAlerts : (existing.orderAlerts !== undefined ? existing.orderAlerts : true),
        autoPrintReceipt: signupData.autoPrintReceipt !== undefined ? signupData.autoPrintReceipt : (existing.autoPrintReceipt !== undefined ? existing.autoPrintReceipt : true),
        theme: signupData.theme || existing.theme || 'warm',
      };
      const idx = customers.findIndex((c) => c.id === existing.id);
      if (idx !== -1) customers[idx] = updated;
      customerDB.saveAll(customers);
      return updated;
    }

    const newCustomer = {
      id: `CUST-${Date.now().toString().slice(-6)}`,
      name: (signupData.name || 'Food Lover').trim(),
      phone: cleanPhone,
      email: cleanEmail,
      password: signupData.password || 'Bite@1234',
      address: (signupData.address || '').trim(),
      landmark: (signupData.landmark || '').trim(),
      foodPreference: signupData.foodPreference || 'all', // 'all' | 'veg' | 'non-veg'
      defaultOrderType: signupData.defaultOrderType || 'Delivery',
      spicePreference: signupData.spicePreference || 'Medium', // 'Mild' | 'Medium' | 'Spicy'
      orderAlerts: signupData.orderAlerts !== undefined ? signupData.orderAlerts : true,
      autoPrintReceipt: signupData.autoPrintReceipt !== undefined ? signupData.autoPrintReceipt : true,
      theme: signupData.theme || 'warm',
      totalOrders: 0,
      totalSpent: 0,
      lastOrder: 'Never',
      createdAt: new Date().toISOString().split('T')[0],
    };

    customers.unshift(newCustomer);
    customerDB.saveAll(customers);
    return newCustomer;
  },

  // Authenticate customer by phone/email & password
  authenticate: (identifier, password) => {
    const customer = customerDB.findByEmailOrPhone(identifier);
    if (!customer) {
      return { success: false, notFound: true, message: 'No account found with this mobile or email. Please sign up first.' };
    }
    const expectedPassword = customer.password || 'Bite@1234';
    if (password && expectedPassword !== password) {
      return { success: false, notFound: false, message: 'Incorrect password. Must be at least 8 characters with letters, numbers, and special characters.' };
    }
    return { success: true, customer };
  },

  // Add new customer from input details
  create: (customerData) => {
    return customerDB.register(customerData);
  },

  // Update customer
  update: (id, updateData) => {
    const customers = customerDB.getAll();
    const idx = customers.findIndex((c) => c.id === id);
    if (idx !== -1) {
      customers[idx] = { ...customers[idx], ...updateData };
      customerDB.saveAll(customers);
      syncToBackend(customers[idx]);
      return customers[idx];
    }
    return null;
  },

  // Delete customer
  delete: (id) => {
    const customers = customerDB.getAll();
    const filtered = customers.filter((c) => c.id !== id);
    customerDB.saveAll(filtered);
    return true;
  },

  // Record order against customer (auto-creates if new, or increments count & spend)
  recordOrder: (customerName, customerPhone, orderAmount, dateStr, extra = {}) => {
    if (!customerPhone || customerPhone === '9999999999') {
      // Walk in customer without distinct phone
      return null;
    }

    const customers = customerDB.getAll();
    const cleanPhone = customerPhone.trim();
    const idx = customers.findIndex((c) => c.phone.trim() === cleanPhone);

    if (idx !== -1) {
      customers[idx].totalOrders = (customers[idx].totalOrders || 0) + 1;
      customers[idx].totalSpent =
        (Number(customers[idx].totalSpent) || 0) + Number(orderAmount || 0);
      customers[idx].lastOrder = dateStr || new Date().toISOString().split('T')[0];
      customers[idx].lastOrderTime = extra.time || new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      if (customerName && customerName !== 'Walk-in Customer') {
        customers[idx].name = customerName;
      }
      if (extra.address) {
        customers[idx].address = extra.address;
        customers[idx].deliveryAddress = extra.address;
      }
      if (extra.location) {
        customers[idx].location = extra.location;
      }
      customerDB.saveAll(customers);
      syncToBackend(customers[idx]);
      return customers[idx];
    } else if (customerName && customerName !== 'Walk-in Customer') {
      // Create new customer record in database from customer's input!
      const newCustomer = {
        id: `CUST-${Date.now().toString().slice(-6)}`,
        name: customerName.trim(),
        phone: cleanPhone,
        email: extra.email || '',
        address: extra.address || '',
        deliveryAddress: extra.address || '',
        location: extra.location || '',
        totalOrders: 1,
        totalSpent: Number(orderAmount || 0),
        lastOrder: dateStr || new Date().toISOString().split('T')[0],
        lastOrderTime: extra.time || new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        createdAt: dateStr || new Date().toISOString().split('T')[0],
      };
      customers.unshift(newCustomer);
      customerDB.saveAll(customers);
      syncToBackend(newCustomer);
      return newCustomer;
    }
    return null;
  },

  // Export database to CSV
  exportCSV: () => {
    const customers = customerDB.getAll();
    if (customers.length === 0) return;
    const header = 'ID,Name,Phone,Email,Address,Total Orders,Total Spent (INR),Last Order,Registered Date\n';
    const rows = customers
      .map(
        (c) =>
          `"${c.id}","${c.name}","${c.phone}","${c.email || ''}","${(c.address || '').replace(/"/g, '""')}",${c.totalOrders || 0},${c.totalSpent || 0},"${c.lastOrder || ''}","${c.createdAt || ''}"`
      )
      .join('\n');

    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `customer_database_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  },

  // Export database to JSON
  exportJSON: () => {
    const customers = customerDB.getAll();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(customers, null, 2));
    const link = document.createElement('a');
    link.href = dataStr;
    link.download = `customer_database_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  },

  // Import customers into database
  importJSON: (jsonString) => {
    try {
      const imported = JSON.parse(jsonString);
      if (Array.isArray(imported)) {
        const existing = customerDB.getAll();
        const existingPhones = new Set(existing.map((c) => c.phone));
        const added = [];

        imported.forEach((item) => {
          if (item.name && item.phone && !existingPhones.has(item.phone)) {
            added.push({
              id: item.id || `CUST-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
              name: item.name,
              phone: item.phone,
              email: item.email || '',
              address: item.address || '',
              totalOrders: item.totalOrders || 0,
              totalSpent: item.totalSpent || 0,
              lastOrder: item.lastOrder || 'Imported',
              createdAt: item.createdAt || new Date().toISOString().split('T')[0],
            });
            existingPhones.add(item.phone);
          }
        });

        const combined = [...added, ...existing];
        customerDB.saveAll(combined);
        return { success: true, count: added.length };
      }
      return { success: false, error: 'Invalid file format. Expected an array of customers.' };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },
};
