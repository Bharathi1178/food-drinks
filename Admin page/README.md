# Fast Food POS - Business Director / Admin Portal

This folder contains the complete dedicated Admin Dashboard source code for business directors and authorized managers.

## Folder Structure

```
Admin page/
├── api/
│   ├── axiosAdmin.js          # Configured Axios instance with Bearer token & VITE_API_BASE_URL
│   ├── adminApi.js            # Director login, dashboard stats & session verification
│   ├── customerApi.js         # Customer directory & details APIs
│   ├── employeeApi.js         # Employee directory, roles, & details APIs
│   └── reportApi.js           # Turnover & sales reports APIs
├── components/
│   ├── AdminHeader.jsx        # Top executive bar with Director profile & current page title
│   ├── AdminLayout.jsx        # Master layout wrapper with sidebar & header
│   ├── AdminProtectedRoute.jsx# Route guard redirecting unauthenticated users to /admin/login
│   ├── AdminSidebar.jsx       # Dark slate executive navigation (Dashboard, Customers, Staff, Reports)
│   ├── CustomerTable.jsx      # Customer directory table with search & VIP/status filtering
│   ├── EmployeeTable.jsx      # Employee table with role & status filtering
│   ├── ReportFilters.jsx      # Preset date filters (Today, Yesterday, Week, Month, Custom)
│   ├── SalesChart.jsx         # Interactive turnover chart with Daily / Weekly / Monthly views
│   └── StatCard.jsx           # Executive metric cards
├── context/
│   └── AdminAuthContext.jsx   # Director authentication session & state management
└── pages/
    ├── AdminLogin.jsx         # Director portal login (Email, password, One-click demo login)
    ├── Dashboard.jsx          # Turnover cards, today's sales KPI, sales chart, recent orders
    ├── CustomerDetails.jsx    # Customer popup with lifetime spend & order history
    ├── Customers.jsx          # Customer directory page
    ├── EmployeeDetails.jsx    # Staff popup with orders handled, sales, & availability
    ├── Employees.jsx          # Staff management page
    └── Reports.jsx            # Turnover reports (Daily, Weekly, Monthly, Payment breakdown)
```

## Admin Portal URLs

- **Director Login**: [http://127.0.0.1:3000/admin/login](http://127.0.0.1:3000/admin/login)
- **Executive Dashboard**: [http://127.0.0.1:3000/admin/dashboard](http://127.0.0.1:3000/admin/dashboard)
- **Customer Directory**: [http://127.0.0.1:3000/admin/customers](http://127.0.0.1:3000/admin/customers)
- **Employee Management**: [http://127.0.0.1:3000/admin/employees](http://127.0.0.1:3000/admin/employees)
- **Turnover Reports**: [http://127.0.0.1:3000/admin/reports](http://127.0.0.1:3000/admin/reports)

## Director Credentials

- **Director Email**: `kesavamoorthys362@gmail.com` (or `director@bitecraze.com`)
- **Password**: Any password you choose (or click **One-Click Director Demo Access**)
