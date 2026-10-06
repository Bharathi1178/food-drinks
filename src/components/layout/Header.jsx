import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Flame,
  ShoppingBag,
  MapPin,
  ChevronDown,
  User,
  LogOut,
  Tag,
  Clock,
  ArrowLeft,
  Check,
  Search as SearchIcon,
  PlusCircle,
  Menu as MenuIcon,
  X as CloseIcon,
  UtensilsCrossed,
  Receipt,
  ShieldCheck,
  Layers,
  Store,
  Monitor,
} from 'lucide-react';
import { usePOS } from '../../context/POSContext';
import { useCustomerAuth } from '../../context/CustomerAuthContext';

// ALL 38 DISTRICTS OF TAMIL NADU (+ Tech Hub Hubs)
const DISTRICT_AREAS = {
  Ariyalur: [
    'Main Town / Bus Stand',
    'Jayankondam',
    'Sendurai',
    'Andimadam',
    'Udayarpalayam',
    'Collectorate Area',
  ],
  Chengalpattu: [
    'Tambaram Sanatorium',
    'Chromepet',
    'Pallavaram',
    'Guduvanchery',
    'Maraimalai Nagar',
    'Singaperumal Koil',
    'Mahindra World City',
    'Maduranthakam',
    'Chengalpattu Town',
  ],
  Chennai: [
    'T. Nagar',
    'Anna Nagar',
    'Velachery',
    'Adyar',
    'Mylapore',
    'OMR / Thoraipakkam',
    'Tambaram',
    'Nungambakkam',
    'Alwarpet',
    'Guindy',
    'Porur',
    'Vadapalani',
    'Kilpauk',
    'Besant Nagar',
    'Perambur',
    'Kodambakkam',
    'Chromepet',
    'Sholinganallur',
  ],
  Coimbatore: [
    'RS Puram',
    'Gandhipuram',
    'Peelamedu',
    'Saibaba Colony',
    'Saravanampatti',
    'Singanallur',
    'Town Hall',
    'Race Course',
    'Vadavalli',
    'Kovaipudur',
    'Thudiyalur',
  ],
  Cuddalore: [
    'Cuddalore OT / Town',
    'Manjakuppam',
    'Semmandalam',
    'Panruti',
    'Chidambaram',
    'Neyveli Township',
    'Vadalur',
    'Virudhachalam',
  ],
  Dharmapuri: [
    'Dharmapuri Town / Bus Stand',
    'Harur',
    'Palacode',
    'Pennagaram',
    'Pappireddipatti',
    'Morappur',
    'Collectorate Road',
  ],
  Dindigul: [
    'Palani Road',
    'Round Road',
    'Begambur',
    'GTN Salai',
    'Nagal Nagar',
    'Collectorate Area',
    'Batlagundu',
    'Oddanchatram',
    'Kodaikanal Road',
    'Siluvathur Road',
    'Bus Stand Area',
  ],
  Erode: [
    'Perundurai Road',
    'Brough Road',
    'Veerappanchatram',
    'Surampatti',
    'Thindal',
    'Gobichettipalayam',
    'Bhavani',
    'Solar',
  ],
  Kallakurichi: [
    'Kallakurichi Town',
    'Ulundurpet',
    'Sankarapuram',
    'Chinnasalem',
    'Thirukoilur',
    'Kachirayapalayam',
  ],
  Kancheepuram: [
    'Kanchipuram Bus Stand',
    'Ennaikaran',
    'Pillayar Palayam',
    'Walajabad',
    'Sriperumbudur',
    'Uthiramerur',
    'Gandhi Road',
  ],
  Karur: [
    'Karur Town / Bus Stand',
    'Thanthonimalai',
    'Vengamedu',
    'Gandhigramam',
    'Kulithalai',
    'Aravakurichi',
    'Pasupathipalayam',
  ],
  Krishnagiri: [
    'Hosur (Ring Road)',
    'Bagalur Road',
    'SIPCOT Phase 1 & 2',
    'Krishnagiri Town',
    'Rayakottai Road',
    'Bargur',
    'Pochampalli',
  ],
  Madurai: [
    'KK Nagar',
    'Anna Nagar',
    'Simmakkal',
    'Goripalayam',
    'Mattuthavani',
    'Tallakulam',
    'Ellis Nagar',
    'SS Colony',
    'Tirunagar',
    'Teppakulam',
  ],
  Mayiladuthurai: [
    'Mayiladuthurai Town',
    'Sirkazhi',
    'Tharangambadi',
    'Kuthalam',
    'Poompuhar',
    'Koranad',
  ],
  Nagapattinam: [
    'Nagapattinam Town',
    'Velankanni',
    'Nagore',
    'Kilvelur',
    'Vedaranyam',
  ],
  Namakkal: [
    'Namakkal Town / Bus Stand',
    'Tiruchengode',
    'Rasipuram',
    'Paramathi Velur',
    'Mohanur',
    'Sendamangalam',
  ],
  Nilgiris: [
    'Ooty Town / Commercial Rd',
    'Coonoor',
    'Kotagiri',
    'Gudalur',
    'Wellington',
    'Lovedale',
  ],
  Perambalur: [
    'Perambalur Town',
    'Veppanthattai',
    'Kunnam',
    'Alathur',
    'Collectorate Complex',
  ],
  Pudukkottai: [
    'Pudukkottai Town',
    'Aranthangi',
    'Alangudi',
    'Viralimalai',
    'Thirumayam',
    'Gandarvakkottai',
  ],
  Ramanathapuram: [
    'Ramanathapuram Town',
    'Rameswaram',
    'Paramakudi',
    'Kilakarai',
    'Mudukulathur',
    'Mandapam',
  ],
  Ranipet: [
    'Ranipet Town',
    'Walajapet',
    'Arcot',
    'Arakkonam',
    'Sholinghur',
    'BHEL Township',
  ],
  Salem: [
    'Fairlands',
    'Meyyanur',
    'Hasthampatti',
    'Suramangalam',
    'Alagapuram',
    'Ammapet',
    'Shevapet',
    'Kandhampatty',
    'Attur',
  ],
  Sivagangai: [
    'Sivagangai Town',
    'Karaikudi (College Rd)',
    'Devakottai',
    'Manamadurai',
    'Tirupathur',
    'Kalayarkoil',
  ],
  Tenkasi: [
    'Tenkasi Town / Bus Stand',
    'Courtallam',
    'Sankarankovil',
    'Kadayanallur',
    'Sengottai',
    'Alangulam',
    'Surandai',
  ],
  Thanjavur: [
    'Medical College Road',
    'New Bus Stand',
    'Kumbakonam',
    'Pattukkottai',
    'Karanthai',
    'Papanasam',
    'Old Bus Stand Area',
  ],
  Theni: [
    'Theni Town / Main Bazaar',
    'Periyakulam',
    'Bodinayakanur (Bodi)',
    'Cumbum',
    'Chinnamanur',
    'Uthamapalayam',
    'Andipatti',
  ],
  Thoothukudi: [
    'Palayamkottai Road',
    'Bryant Nagar',
    'Kovilpatti',
    'Tiruchendur',
    'Millerpuram',
    'SIPCOT Area',
    'Old Bus Stand',
  ],
  Tiruchirappalli: [
    'Thillai Nagar',
    'Cantonment',
    'Srirangam',
    'KK Nagar',
    'Central Bus Stand',
    'Woraiyur',
    'Ponmalai',
    'NIT Trichy',
  ],
  Tirunelveli: [
    'Palayamkottai',
    'Vannarpettai',
    'Tirunelveli Junction',
    'Tirunelveli Town',
    'Melapalayam',
    'NGO Colony',
    'Ambasamudram',
  ],
  Tirupathur: [
    'Tirupathur Town',
    'Vaniyambadi',
    'Ambur',
    'Natrampalli',
    'Jolarpet',
    'Yelagiri Hills',
  ],
  Tiruppur: [
    'Avinashi Road',
    'Kumar Nagar',
    'Rayapuram',
    'Dharapuram Road',
    'PN Road',
    'Kangeyam',
    'Palladam',
  ],
  Tiruvallur: [
    'Tiruvallur Town',
    'Avadi',
    'Poonamallee',
    'Ambattur',
    'Gummidipoondi',
    'Tiruttani',
    'Redhills',
  ],
  Tiruvannamalai: [
    'Girivalam Road / Temple Area',
    'Polur',
    'Arani',
    'Chengam',
    'Cheyyar',
    'Vettavalam',
  ],
  Tiruvarur: [
    'Tiruvarur Town',
    'Mannargudi',
    'Thiruthuraipoondi',
    'Kudavasal',
    'Nannilam',
    'Needamangalam',
  ],
  Vellore: [
    'Katpadi',
    'Bagayam',
    'Sathuvachari',
    'Gandhi Nagar',
    'Tollgate',
    'Gudiyatham',
    'Fort Area',
  ],
  Viluppuram: [
    'Viluppuram Town',
    'Tindivanam',
    'Gingee',
    'Vikravandi',
    'Marakkanam',
    'Valavanur',
  ],
  Virudhunagar: [
    'Virudhunagar Town',
    'Sivakasi',
    'Rajapalayam',
    'Srivilliputhur',
    'Aruppukkottai',
    'Sattur',
  ],
  Bangalore: [
    'Koramangala',
    'Indiranagar',
    'HSR Layout',
    'Whitefield',
    'Jayanagar',
    'Electronic City',
    'BTM Layout',
    'JP Nagar',
    'Malleshwaram',
    'Marathahalli',
  ],
};

const ALL_DISTRICTS = Object.keys(DISTRICT_AREAS).sort();

export default function Header() {
  const { cart, grandTotal, setDeliveryAddress } = usePOS();
  const { currentCustomer, isLoggedIn, openLoginModal, logout } = useCustomerAuth();

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [portalsDropdownOpen, setPortalsDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Step-by-step location selection: 'district' | 'area'
  const [locationStep, setLocationStep] = useState('district');
  const [selectedDistrict, setSelectedDistrict] = useState('Chennai');
  const [selectedArea, setSelectedArea] = useState('Velachery');
  const [currentLocation, setCurrentLocation] = useState('Velachery, Chennai');

  const [districtSearchTerm, setDistrictSearchTerm] = useState('');
  const [areaSearchTerm, setAreaSearchTerm] = useState('');

  const dropdownRef = useRef(null);
  const locationRef = useRef(null);
  const portalsRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
      if (locationRef.current && !locationRef.current.contains(event.target)) {
        setLocationDropdownOpen(false);
      }
      if (portalsRef.current && !portalsRef.current.contains(event.target)) {
        setPortalsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    setUserDropdownOpen(false);
    logout();
    navigate('/menu');
  };

  const scrollToSection = (id) => {
    if (location.pathname !== '/menu' && location.pathname !== '/') {
      navigate('/menu');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 200);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Active navigation option state: 'home' | 'my-orders' | 'track-order' | 'cart' | 'account'
  const [activeNav, setActiveNav] = useState(() => {
    if (location.pathname === '/orders') {
      return location.search.includes('view=history') ? 'my-orders' : 'track-order';
    }
    if (location.pathname === '/billing') return 'cart';
    if (location.pathname === '/profile') return 'account';
    return 'home';
  });

  // Sync active navigation option with current URL route
  useEffect(() => {
    setMobileMenuOpen(false);
    if (location.pathname === '/orders') {
      if (location.search.includes('view=history')) {
        setActiveNav('my-orders');
      } else {
        setActiveNav('track-order');
      }
    } else if (location.pathname === '/billing') {
      setActiveNav('cart');
    } else if (location.pathname === '/profile') {
      setActiveNav('account');
    } else if (location.pathname === '/menu' || location.pathname === '/') {
      setActiveNav('home');
    }
  }, [location.pathname, location.search]);

  const isHomeActive =
    (location.pathname === '/menu' || location.pathname === '/') && activeNav === 'home';
  const isMyOrdersActive =
    location.pathname === '/orders' &&
    (activeNav === 'my-orders' || location.search.includes('view=history'));
  const isTrackActive =
    location.pathname === '/orders' &&
    (activeNav === 'track-order' || (!location.search.includes('view=history') && activeNav !== 'my-orders'));

  // Open location picker: reset to district step
  const handleToggleLocationDropdown = () => {
    if (!locationDropdownOpen) {
      setLocationStep('district');
      setDistrictSearchTerm('');
      setAreaSearchTerm('');
    }
    setLocationDropdownOpen(!locationDropdownOpen);
  };

  // When customer clicks a district, transition to show areas of that district
  const handleSelectDistrict = (dist) => {
    setSelectedDistrict(dist);
    setLocationStep('area');
    setAreaSearchTerm('');
  };

  // When customer clicks an area or types custom area
  const handleSelectArea = (area) => {
    const cleanArea = area.trim();
    if (!cleanArea) return;
    const formatted = `${cleanArea}, ${selectedDistrict}`;
    setSelectedArea(cleanArea);
    setCurrentLocation(formatted);
    if (setDeliveryAddress) {
      setDeliveryAddress(formatted);
    }
    setLocationDropdownOpen(false);
  };

  // Filtered districts (checks district name)
  const filteredDistricts = ALL_DISTRICTS.filter((d) =>
    d.toLowerCase().includes(districtSearchTerm.toLowerCase().trim())
  );

  // Filtered areas in selected district
  const availableAreas = (DISTRICT_AREAS[selectedDistrict] || []).filter((a) =>
    a.toLowerCase().includes(areaSearchTerm.toLowerCase().trim())
  );

  return (
    <header className="sticky top-0 z-50 bg-[#0B0F19]/90 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/40">
      {/* Subtle Top Ambient Accent Line */}
      <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-orange-500/40 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-18 sm:h-20 flex items-center justify-between gap-4">
          {/* 1. Left: BiteCraze Logo */}
          <Link
            to="/menu"
            className="flex items-center gap-3 group focus:outline-none shrink-0"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform duration-200">
              <Flame className="w-5 h-5 text-slate-950 fill-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-black text-white text-xl sm:text-2xl tracking-tight group-hover:text-amber-400 transition-colors">
                  BiteCraze
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              </div>
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-amber-400/80 block mt-0.5">
                ARTISAN KITCHEN & DINING
              </span>
            </div>
          </Link>

          {/* 2. Center: Clean Text/Icon Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {/* Menu Link */}
            <Link
              to="/menu"
              onClick={() => setActiveNav('home')}
              className={`relative py-2 px-3 text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                isHomeActive
                  ? 'text-orange-400 font-bold'
                  : 'text-slate-300 hover:text-orange-400'
              }`}
            >
              <UtensilsCrossed className="w-3.5 h-3.5" />
              <span>Menu</span>
              {isHomeActive && (
                <span className="absolute -bottom-2.5 left-2 right-2 h-0.5 bg-gradient-to-r from-amber-400 via-orange-500 to-rose-400 rounded-full shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
              )}
            </Link>

            {/* Billing Link */}
            <Link
              to="/billing"
              onClick={() => setActiveNav('cart')}
              className={`relative py-2 px-3 text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                location.pathname === '/billing'
                  ? 'text-orange-400 font-bold'
                  : 'text-slate-300 hover:text-orange-400'
              }`}
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>Billing</span>
              {location.pathname === '/billing' && (
                <span className="absolute -bottom-2.5 left-2 right-2 h-0.5 bg-gradient-to-r from-amber-400 via-orange-500 to-rose-400 rounded-full shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
              )}
            </Link>

            {/* My Orders Link */}
            <Link
              to="/orders?view=history"
              onClick={() => setActiveNav('my-orders')}
              className={`relative py-2 px-3 text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                isMyOrdersActive
                  ? 'text-orange-400 font-bold'
                  : 'text-slate-300 hover:text-orange-400'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Orders</span>
              {isMyOrdersActive && (
                <span className="absolute -bottom-2.5 left-2 right-2 h-0.5 bg-gradient-to-r from-amber-400 via-orange-500 to-rose-400 rounded-full shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
              )}
            </Link>

            {/* Track Order Link */}
            <Link
              to="/orders?view=track"
              onClick={() => setActiveNav('track-order')}
              className={`relative py-2 px-3 text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                isTrackActive
                  ? 'text-orange-400 font-bold'
                  : 'text-slate-300 hover:text-orange-400'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Tracker</span>
              {isTrackActive && (
                <span className="absolute -bottom-2.5 left-2 right-2 h-0.5 bg-gradient-to-r from-amber-400 via-orange-500 to-rose-400 rounded-full shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
              )}
            </Link>

            {/* Portals Switcher Dropdown */}
            <div className="relative ml-1" ref={portalsRef}>
              <button
                type="button"
                onClick={() => setPortalsDropdownOpen(!portalsDropdownOpen)}
                className="py-1.5 px-3 text-xs font-bold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>Portals</span>
                <ChevronDown className={`w-3 h-3 text-amber-400 transition-transform ${portalsDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {portalsDropdownOpen && (
                <div className="absolute left-0 mt-2 w-64 bg-slate-900 border border-slate-700/90 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150 text-slate-100 backdrop-blur-md">
                  <div className="px-3.5 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-800">
                    Switch Portals
                  </div>
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setPortalsDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-bold text-amber-300 hover:text-white hover:bg-amber-500/15 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="leading-tight">Director / Admin Portal</div>
                      <div className="text-[10px] text-slate-400 font-normal">Analytics, Revenue, Staff</div>
                    </div>
                  </Link>

                  <Link
                    to="/employee/dashboard"
                    onClick={() => setPortalsDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-bold text-orange-300 hover:text-white hover:bg-orange-500/15 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
                      <Flame className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="leading-tight">Kitchen KDS Portal</div>
                      <div className="text-[10px] text-slate-400 font-normal">Ticket Prep & Dispatch</div>
                    </div>
                  </Link>

                  <Link
                    to="/pos"
                    onClick={() => setPortalsDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-bold text-emerald-300 hover:text-white hover:bg-emerald-500/15 transition-colors border-t border-slate-800"
                  >
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                      <Monitor className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="leading-tight">Counter POS Billing</div>
                      <div className="text-[10px] text-slate-400 font-normal">Quick In-Store Cashier</div>
                    </div>
                  </Link>

                  <Link
                    to="/profile"
                    onClick={() => setPortalsDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors border-t border-slate-800"
                  >
                    <div className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="leading-tight">Customer Profile</div>
                      <div className="text-[10px] text-slate-400 font-normal">Addresses & Loyalty</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </nav>

        {/* 3. Right: Location, Cart & User Profile */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Location Button (Compact dark translucent control) */}
          <div className="relative hidden md:block" ref={locationRef}>
            <button
              type="button"
              onClick={handleToggleLocationDropdown}
              className="bg-slate-900/60 hover:bg-slate-800/80 text-slate-200 hover:text-white border border-slate-700/60 hover:border-orange-500/50 hover:shadow-[0_0_12px_rgba(249,115,22,0.2)] rounded-xl px-3 py-1.5 sm:py-2 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
              <span className="max-w-[130px] lg:max-w-[160px] truncate">{currentLocation}</span>
              <ChevronDown
                className={`w-3 h-3 shrink-0 text-slate-400 transition-transform ${
                  locationDropdownOpen ? 'rotate-180 text-orange-400' : ''
                }`}
              />
            </button>

            {locationDropdownOpen && (
              <div className="absolute right-0 mt-2 w-[390px] sm:w-[440px] md:w-[480px] bg-white border border-slate-200 rounded-3xl shadow-2xl p-4 sm:p-5 z-50 animate-in fade-in zoom-in-95 duration-150 text-slate-900">
                {/* STEP 1: CHOOSE DISTRICT (ALL 38 DISTRICTS OF TAMIL NADU) */}
                {locationStep === 'district' ? (
                  <div>
                    <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-orange-600" />
                        <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                          Select District
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-md border border-orange-200">
                        38 TN Districts
                      </span>
                    </div>

                    {/* District Search Bar */}
                    <div className="relative mb-3">
                      <SearchIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        autoFocus
                        value={districtSearchTerm}
                        onChange={(e) => setDistrictSearchTerm(e.target.value)}
                        placeholder="Search district (e.g. Dindigul, Madurai, Salem)..."
                        className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 placeholder:text-slate-400"
                      />
                    </div>

                    {/* Districts List */}
                    <div className="flex items-center justify-between px-1 mb-2">
                      <p className="text-[10px] font-black uppercase text-slate-400">
                        Tamil Nadu Districts
                      </p>
                      <span className="text-[10px] text-slate-400 font-semibold">
                        {filteredDistricts.length} districts available
                      </span>
                    </div>

                    <div className="max-h-[420px] sm:max-h-[480px] overflow-y-auto space-y-1.5 pr-1.5 custom-scrollbar">
                      {filteredDistricts.map((dist) => {
                        const isCurrent = selectedDistrict === dist;
                        const areaCount = DISTRICT_AREAS[dist]?.length || 0;

                        return (
                          <button
                            key={dist}
                            type="button"
                            onClick={() => handleSelectDistrict(dist)}
                            className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold text-left flex items-center justify-between transition-all cursor-pointer ${
                              isCurrent
                                ? 'bg-orange-50 text-orange-600 border border-orange-200'
                                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0 pr-2">
                              <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
                              <span className="text-sm font-black truncate">{dist}</span>
                            </div>
                            <span className="text-[11px] font-semibold text-slate-500 shrink-0 whitespace-nowrap bg-slate-100 px-2 py-0.5 rounded-md">
                              {areaCount} areas →
                            </span>
                          </button>
                        );
                      })}

                      {filteredDistricts.length === 0 && (
                        <p className="text-xs text-slate-400 text-center py-8">
                          No district found for "{districtSearchTerm}"
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  /* STEP 2: CHOOSE OR MANUALLY TYPE AREA IN CHOSEN DISTRICT */
                  <div>
                    {/* Header with Back button to choose another district */}
                    <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-100">
                      <button
                        type="button"
                        onClick={() => setLocationStep('district')}
                        className="flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700 hover:bg-orange-50 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Change District</span>
                      </button>

                      <span className="text-xs font-black text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
                        {selectedDistrict}
                      </span>
                    </div>

                    {/* Area Search / Manual Typing Bar */}
                    <div className="relative mb-2">
                      <SearchIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        autoFocus
                        value={areaSearchTerm}
                        onChange={(e) => setAreaSearchTerm(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && areaSearchTerm.trim()) {
                            handleSelectArea(areaSearchTerm.trim());
                          }
                        }}
                        placeholder={`Type your area in ${selectedDistrict} (Press Enter)...`}
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 placeholder:text-slate-400"
                      />
                    </div>

                    {/* Manual Area Action Button: Shown immediately when customer types their area */}
                    {areaSearchTerm.trim() && (
                      <button
                        type="button"
                        onClick={() => handleSelectArea(areaSearchTerm.trim())}
                        className="w-full mb-3 p-2.5 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-left flex items-center justify-between text-xs font-bold text-orange-950 transition-all cursor-pointer group shadow-xs animate-in fade-in duration-150"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <PlusCircle className="w-4 h-4 text-orange-600 shrink-0" />
                          <span className="truncate">
                            Choose: <strong className="text-orange-600 underline">"{areaSearchTerm.trim()}"</strong>
                          </span>
                        </div>
                        <span className="text-[11px] text-orange-700 font-extrabold shrink-0 bg-white px-2 py-0.5 rounded-md border border-orange-200">
                          Set Location ✓
                        </span>
                      </button>
                    )}

                    {/* Popular / Suggested Areas in Selected District */}
                    <div className="flex items-center justify-between mb-1.5 px-1">
                      <p className="text-[10px] font-black uppercase text-slate-400">
                        Popular Localities in {selectedDistrict}
                      </p>
                      <span className="text-[10px] text-slate-400 font-semibold">
                        {availableAreas.length} listed
                      </span>
                    </div>

                    <div className="max-h-[380px] sm:max-h-[440px] overflow-y-auto space-y-1.5 pr-1.5 custom-scrollbar">
                      {/* Main Center option */}
                      <button
                        type="button"
                        onClick={() => handleSelectArea(`Main Town / Center`)}
                        className="w-full px-3 py-2 rounded-xl text-xs font-bold text-left flex items-center justify-between text-slate-700 hover:bg-slate-100 hover:text-slate-950 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                          <span>Main Town / Central {selectedDistrict}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium">District Center</span>
                      </button>

                      {availableAreas.map((area, idx) => {
                        const isSelected =
                          selectedArea === area &&
                          currentLocation === `${area}, ${selectedDistrict}`;

                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleSelectArea(area)}
                            className={`w-full px-3 py-2 rounded-xl text-xs font-bold text-left flex items-center justify-between transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-orange-50 text-orange-600 font-black'
                                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                              <span>{area}</span>
                            </div>
                            {isSelected && (
                              <Check className="w-3.5 h-3.5 text-orange-600 stroke-[3]" />
                            )}
                          </button>
                        );
                      })}

                      {availableAreas.length === 0 && !areaSearchTerm.trim() && (
                        <p className="text-xs text-slate-400 text-center py-4">
                          Type your area or street name above and press Enter
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Cart Button (Dark glass background with warm orange accent & badge) */}
          <Link
            to="/billing"
            onClick={() => setActiveNav('cart')}
            className={`bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700/70 hover:border-orange-500/60 hover:shadow-[0_0_12px_rgba(249,115,22,0.25)] rounded-xl px-3 sm:px-3.5 py-1.5 sm:py-2 text-xs font-bold transition-all flex items-center gap-1.5 relative cursor-pointer ${
              location.pathname === '/billing' ? 'ring-2 ring-orange-500/40 border-orange-500/60' : ''
            }`}
            title="View Cart"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-orange-400" />
            <span className="hidden sm:inline">Cart</span>
            {totalCartCount > 0 ? (
              <span className="bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-black text-[10px] px-1.5 py-0.2 rounded-full shadow-sm ml-0.5">
                {totalCartCount}
              </span>
            ) : (
              <span className="text-slate-400 text-xs font-semibold">(0)</span>
            )}
          </Link>

          {/* User Profile / Sign In (Compact dark translucent control) */}
          {isLoggedIn ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="bg-slate-900/60 hover:bg-slate-800/80 text-slate-200 hover:text-white border border-slate-700/60 hover:border-orange-500/40 rounded-xl px-2.5 py-1.5 sm:py-2 text-xs font-semibold transition-all cursor-pointer flex items-center gap-2"
              >
                <div className="w-5 h-5 rounded-md bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 flex items-center justify-center font-black text-[10px] shadow-sm">
                  {currentCustomer?.name ? currentCustomer.name[0].toUpperCase() : 'U'}
                </div>
                <span className="hidden sm:inline max-w-[90px] truncate font-bold text-slate-100">
                  {currentCustomer?.name?.split(' ')[0] || 'Account'}
                </span>
                <ChevronDown
                  className={`w-3 h-3 text-slate-400 transition-transform ${
                    userDropdownOpen ? 'rotate-180 text-orange-400' : ''
                  }`}
                />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150 text-slate-100 backdrop-blur-md">
                  <div className="px-4 py-2 border-b border-slate-800">
                    <p className="text-xs font-bold text-white truncate">
                      {currentCustomer?.name}
                    </p>
                    <p className="text-[10px] text-orange-400 font-mono font-semibold">
                      {currentCustomer?.phone}
                    </p>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => {
                      setActiveNav('account');
                      setUserDropdownOpen(false);
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800/80"
                  >
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>My Profile</span>
                  </Link>
                  <Link
                    to="/orders"
                    onClick={() => {
                      setActiveNav('my-orders');
                      setUserDropdownOpen(false);
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800/80"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-slate-400" />
                    <span>Order History</span>
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs font-bold text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-400" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={openLoginModal}
              className="bg-slate-900/60 hover:bg-slate-800/80 text-slate-200 hover:text-white border border-slate-700/60 hover:border-orange-500/40 rounded-xl px-3 py-1.5 sm:py-2 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5 text-orange-400" />
              <span>Sign In</span>
            </button>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-slate-900/80 text-slate-300 hover:text-white border border-slate-700/60 hover:border-orange-500/40 transition-colors cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? (
              <CloseIcon className="w-5 h-5 text-orange-400" />
            ) : (
              <MenuIcon className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-3 pb-4 border-t border-white/10 space-y-2 animate-in fade-in slide-in-from-top-2 duration-150 bg-[#0B0F19]">
          <Link
            to="/menu"
            onClick={() => {
              setActiveNav('home');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              location.pathname === '/menu' || location.pathname === '/'
                ? 'bg-orange-500/15 text-orange-400 border border-orange-500/30'
                : 'text-slate-300 hover:bg-slate-800/60'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4 text-orange-400" />
            <span>Food Menu</span>
          </Link>

          <Link
            to="/billing"
            onClick={() => {
              setActiveNav('cart');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              location.pathname === '/billing'
                ? 'bg-orange-500/15 text-orange-400 border border-orange-500/30'
                : 'text-slate-300 hover:bg-slate-800/60'
            }`}
          >
            <Receipt className="w-4 h-4 text-orange-400" />
            <span>Billing & Cart</span>
          </Link>

          <Link
            to="/orders?view=history"
            onClick={() => {
              setActiveNav('my-orders');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              isMyOrdersActive
                ? 'bg-orange-500/15 text-orange-400 border border-orange-500/30'
                : 'text-slate-300 hover:bg-slate-800/60'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-orange-400" />
            <span>My Orders</span>
          </Link>

          <Link
            to="/orders?view=track"
            onClick={() => {
              setActiveNav('track-order');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              isTrackActive
                ? 'bg-orange-500/15 text-orange-400 border border-orange-500/30'
                : 'text-slate-300 hover:bg-slate-800/60'
            }`}
          >
            <Clock className="w-4 h-4 text-orange-400" />
            <span>Track Order</span>
          </Link>

          <div className="pt-2 border-t border-slate-800/80 space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 px-3.5 block">
              Business & Kitchen Portals
            </span>
            <Link
              to="/admin/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 text-amber-400 hover:bg-amber-500/10 transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Director / Admin Portal</span>
            </Link>
            <Link
              to="/employee/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 text-orange-400 hover:bg-orange-500/10 transition-colors"
            >
              <Flame className="w-4 h-4 text-orange-400" />
              <span>Kitchen Display (KDS)</span>
            </Link>
            <Link
              to="/pos"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 text-emerald-400 hover:bg-emerald-500/10 transition-colors"
            >
              <Monitor className="w-4 h-4 text-emerald-400" />
              <span>Counter POS Terminal</span>
            </Link>
          </div>

          {/* Mobile Location Action */}
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              handleToggleLocationDropdown();
            }}
            className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800/60 flex items-center gap-2 border border-slate-800"
          >
            <MapPin className="w-4 h-4 text-orange-400 shrink-0" />
            <span className="truncate">Location: {currentLocation}</span>
          </button>
        </div>
      )}
    </header>
  );
}
