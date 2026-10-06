from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
FRONTEND_DIR = BASE_DIR.parent
SRC_DIR = FRONTEND_DIR / "src"

# =====================================================================
# 1. Update customerDatabase.js
# =====================================================================
cust_db_path = SRC_DIR / "api" / "customerDatabase.js"
cust_db_content = cust_db_path.read_text(encoding="utf-8")

old_auth = """  // Authenticate customer by phone/email & password
  authenticate: (identifier, password) => {
    const customer = customerDB.findByEmailOrPhone(identifier);
    if (!customer) {
      return { success: false, message: 'No account found with this mobile or email. Please sign up.' };
    }
    if (customer.password && password && customer.password !== password) {
      return { success: false, message: 'Incorrect password. Please try again.' };
    }
    return { success: true, customer };
  },"""

new_auth = """  // Authenticate customer by phone/email & password
  authenticate: (identifier, password) => {
    const customer = customerDB.findByEmailOrPhone(identifier);
    if (!customer) {
      return { success: false, notFound: true, message: 'No account found with this mobile or email. Please sign up first.' };
    }
    if (customer.password && password && customer.password !== password) {
      return { success: false, notFound: false, message: 'Incorrect password. (Default is 1234)' };
    }
    return { success: true, customer };
  },"""

if old_auth in cust_db_content:
    cust_db_content = cust_db_content.replace(old_auth, new_auth)
    cust_db_path.write_text(cust_db_content, encoding="utf-8")
    print("customerDatabase.js updated with notFound flag!")
else:
    print("customerDatabase.js already has notFound or pattern changed.")


# =====================================================================
# 2. Update CustomerAuthContext.jsx
# =====================================================================
auth_ctx_path = SRC_DIR / "context" / "CustomerAuthContext.jsx"
auth_ctx_content = auth_ctx_path.read_text(encoding="utf-8")

old_login_fn = """  // Sign in customer
  const login = async (identifier, password) => {
    const res = customerDB.authenticate(identifier, password);
    if (res.success) {
      saveSession(res.customer);
      setAuthModalOpen(false);
      return { success: true, customer: res.customer };
    }
    return { success: false, message: res.message };
  };"""

new_login_fn = """  // Sign in customer
  const login = async (identifier, password) => {
    const res = customerDB.authenticate(identifier, password);
    if (res.success) {
      saveSession(res.customer);
      setAuthModalOpen(false);
      return { success: true, customer: res.customer };
    }
    return { success: false, notFound: res.notFound, message: res.message };
  };"""

if old_login_fn in auth_ctx_content:
    auth_ctx_content = auth_ctx_content.replace(old_login_fn, new_login_fn)
    auth_ctx_path.write_text(auth_ctx_content, encoding="utf-8")
    print("CustomerAuthContext.jsx updated!")
else:
    print("CustomerAuthContext.jsx already updated or pattern not found.")


# =====================================================================
# 3. Update CustomerAuthModal.jsx
# =====================================================================
modal_path = SRC_DIR / "components" / "auth" / "CustomerAuthModal.jsx"

modal_code = """import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  User,
  Phone,
  Mail,
  Lock,
  MapPin,
  Flame,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  UserPlus,
  LogIn,
} from 'lucide-react';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { usePOS } from '../../context/POSContext';
import { customerDB } from '../../api/customerDatabase';

export default function CustomerAuthModal() {
  const {
    authModalOpen,
    setAuthModalOpen,
    authModalTab,
    setAuthModalTab,
    login,
    signup,
    loginDemoCustomer,
  } = useCustomerAuth();

  const { setPaymentModalOpen, cart } = usePOS();
  const navigate = useNavigate();

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup form state
  const [signupName, setSignupName] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupAddress, setSignupAddress] = useState('');
  const [signupLandmark, setSignupLandmark] = useState('');
  const [signupFoodPref, setSignupFoodPref] = useState('all'); // 'all' | 'veg' | 'non-veg'

  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!authModalOpen) return null;

  // Direct customer to payment area immediately after authentication
  const goToPaymentArea = () => {
    setAuthModalOpen(false);
    navigate('/billing');
    // Open payment modal directly so order can be placed immediately
    setTimeout(() => {
      setPaymentModalOpen(true);
    }, 250);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    const idVal = loginIdentifier.trim();
    if (!idVal) {
      setErrorMsg('Please enter your mobile number or email address');
      return;
    }

    // Check if customer is already signed up in database
    const existing = customerDB.findByEmailOrPhone(idVal);
    if (!existing) {
      // Customer has NOT signed up! Directly take them to the signup page/tab
      const cleanDigits = idVal.replace(/\\D/g, '');
      if (cleanDigits.length >= 10) {
        setSignupPhone(cleanDigits.slice(-10));
      } else if (idVal.includes('@')) {
        setSignupEmail(idVal);
      } else {
        setSignupPhone(idVal);
      }
      setAuthModalTab('signup');
      setErrorMsg('Account not found! You haven\'t signed up yet. Please complete sign up below to place your order.');
      return;
    }

    // Customer already signed up: proceed to authenticate
    setLoading(true);
    try {
      const res = await login(idVal, loginPassword || '1234');
      if (res.success) {
        // Customer already signed up -> directly go to the payment area!
        goToPaymentArea();
      } else {
        if (res.notFound) {
          // If not found in DB, direct straight to signup tab
          setAuthModalTab('signup');
          setErrorMsg('Account not found. Please sign up to place your order.');
        } else {
          setErrorMsg(res.message || 'Incorrect password. (Default is 1234)');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!signupName.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }
    const cleanPhone = signupPhone.trim().replace(/\\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    try {
      const res = await signup({
        name: signupName.trim(),
        phone: cleanPhone,
        email: signupEmail.trim(),
        password: signupPassword || '1234',
        address: signupAddress.trim(),
        landmark: signupLandmark.trim(),
        foodPreference: signupFoodPref,
        defaultOrderType: 'Delivery',
        spicePreference: 'Medium',
      });

      if (res.success) {
        // Customer completed signup! Now directly go to the payment area to place order
        goToPaymentArea();
      } else {
        setErrorMsg(res.message || 'Signup failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = () => {
    loginDemoCustomer();
    // Directly go to payment area
    goToPaymentArea();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden animate-scale"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Sunset Orange Branding */}
        <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 p-6 text-white relative">
          <button
            onClick={() => setAuthModalOpen(false)}
            aria-label="Close modal"
            className="absolute top-4 right-4 p-1.5 rounded-full bg-black/10 hover:bg-black/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shadow-xs">
              <Flame className="w-5 h-5 text-amber-200 animate-bounce" />
            </div>
            <span className="text-xs font-black tracking-widest uppercase text-amber-100">
              BiteCraze Customer Account
            </span>
          </div>

          <h3 className="text-xl font-black tracking-tight">
            {authModalTab === 'login' ? 'Welcome Back!' : 'Create Customer Account'}
          </h3>
          <p className="text-xs text-orange-100 mt-0.5">
            {authModalTab === 'login'
              ? 'Sign in to access your saved details and proceed directly to payment'
              : 'Sign up first to place your food order and enjoy fast checkout'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50/70 p-1">
          <button
            type="button"
            onClick={() => {
              setAuthModalTab('login');
              setErrorMsg('');
            }}
            className={`flex-1 py-2.5 text-xs font-black rounded-2xl transition-all flex items-center justify-center gap-1.5 ${
              authModalTab === 'login'
                ? 'bg-white text-orange-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthModalTab('signup');
              setErrorMsg('');
            }}
            className={`flex-1 py-2.5 text-xs font-black rounded-2xl transition-all flex items-center justify-center gap-1.5 ${
              authModalTab === 'signup'
                ? 'bg-white text-orange-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Sign Up (New Customer)</span>
          </button>
        </div>

        {/* Error / Redirect Alert */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-2 text-amber-800 text-xs font-bold animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Forms Container */}
        <div className="p-6">
          {authModalTab === 'login' ? (
            /* ================= SIGN IN FORM ================= */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">
                  Mobile Number or Email
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="Enter 10-digit mobile or email"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-extrabold text-slate-700">
                    Password
                  </label>
                  <span className="text-[10px] text-slate-400 font-semibold">
                    (Default: 1234)
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white rounded-2xl font-black text-xs shadow-lg shadow-orange-500/25 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span>Sign In & Go to Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Direct Link to Sign Up if customer doesn't have an account */}
              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setAuthModalTab('signup');
                    setErrorMsg('');
                  }}
                  className="text-xs font-bold text-orange-600 hover:text-orange-700 hover:underline flex items-center justify-center gap-1 mx-auto"
                >
                  <span>Don't have an account? Sign Up to Place Order</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* Quick Demo Login Shortcut */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleQuickDemoLogin}
                  className="w-full py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-2xl font-black text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>1-Click Demo Customer Login</span>
                </button>
              </div>
            </form>
          ) : (
            /* ================= SIGN UP FORM ================= */
            <form onSubmit={handleSignupSubmit} className="space-y-3.5 max-h-[60vh] overflow-y-auto pr-1">
              {/* Notice Banner */}
              <div className="p-2.5 rounded-xl bg-orange-50 border border-orange-200 text-[11px] font-bold text-orange-800 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-orange-600 shrink-0" />
                <span>Sign up once to place orders and proceed directly to payment.</span>
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">
                  Full Name <span className="text-orange-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    placeholder="e.g. Raguram"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">
                  Mobile Number <span className="text-orange-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={signupPhone}
                    onChange={(e) => setSignupPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">
                  Email Address <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="customer@example.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">
                  Delivery / Home Address <span className="text-orange-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <textarea
                    rows={2}
                    required
                    value={signupAddress}
                    onChange={(e) => setSignupAddress(e.target.value)}
                    placeholder="Flat / House No, Street name, Area"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all resize-none"
                  />
                </div>
              </div>

              {/* Landmark */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">
                  Nearby Landmark
                </label>
                <input
                  type="text"
                  value={signupLandmark}
                  onChange={(e) => setSignupLandmark(e.target.value)}
                  placeholder="e.g. Near Metro Station / Opp Bank"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                />
              </div>

              {/* Food Preference */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">
                  Food Preference
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSignupFoodPref('all')}
                    className={`py-2 rounded-xl text-xs font-black transition-all border ${
                      signupFoodPref === 'all'
                        ? 'bg-orange-50 text-orange-600 border-orange-400 shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200'
                    }`}
                  >
                    All Foods
                  </button>
                  <button
                    type="button"
                    onClick={() => setSignupFoodPref('veg')}
                    className={`py-2 rounded-xl text-xs font-black transition-all border ${
                      signupFoodPref === 'veg'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-400 shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200'
                    }`}
                  >
                    Pure Veg
                  </button>
                  <button
                    type="button"
                    onClick={() => setSignupFoodPref('non-veg')}
                    className={`py-2 rounded-xl text-xs font-black transition-all border ${
                      signupFoodPref === 'non-veg'
                        ? 'bg-rose-50 text-rose-700 border-rose-400 shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200'
                    }`}
                  >
                    Non-Veg
                  </button>
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">
                  Set Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="Create a password (min 4 characters)"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white rounded-2xl font-black text-xs shadow-lg shadow-orange-500/25 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span>Create Account & Place Order</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>

              {/* Already signed up switch to sign in */}
              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setAuthModalTab('login');
                    setErrorMsg('');
                  }}
                  className="text-xs font-bold text-slate-500 hover:text-orange-600 hover:underline"
                >
                  Already signed up? Sign In to Account &rarr;
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
"""

modal_path.write_text(modal_code, encoding="utf-8")
print("CustomerAuthModal.jsx updated successfully!")


# =====================================================================
# 4. Update BillingPage.jsx to strictly require signup/login before payment
# =====================================================================
billing_path = SRC_DIR / "pages" / "BillingPage.jsx"
billing_code = billing_path.read_text(encoding="utf-8")

old_destructuring = "const { currentCustomer, isLoggedIn, openLoginModal } = useCustomerAuth();"
new_destructuring = "const { currentCustomer, isLoggedIn, openLoginModal, openSignupModal } = useCustomerAuth();"
billing_code = billing_code.replace(old_destructuring, new_destructuring)

# Replace proceed to pay button click
old_pay_click = """            {/* Big Action Button to Pay */}
            <button
              type="button"
              onClick={() => {
                if (!deliveryAddress.trim()) {
                  alert('Please enter your complete delivery address before proceeding.');
                  return;
                }
                setPaymentModalOpen(true);
              }}
              className="w-full py-4 bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white rounded-2xl font-black text-sm shadow-xl shadow-orange-500/25 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-5 h-5 text-amber-200" />
              <span>PROCEED TO PAY • ₹{grandTotal.toFixed(2)}</span>
            </button>"""

new_pay_click = """            {/* Account Required Notice if Customer is NOT signed up/logged in */}
            {!isLoggedIn && (
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1">
                <p className="text-xs font-extrabold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-orange-600" />
                  <span>Customer Sign Up Required</span>
                </p>
                <p className="text-[11px] text-amber-800">
                  Please sign up or sign in below so your details are attached and you can place your order.
                </p>
              </div>
            )}

            {/* Big Action Button to Pay / Sign Up */}
            <button
              type="button"
              onClick={() => {
                if (!isLoggedIn) {
                  // Customer has NOT signed up: direct go to the signup page!
                  openSignupModal();
                  return;
                }
                if (!deliveryAddress.trim()) {
                  alert('Please enter your complete delivery address before proceeding.');
                  return;
                }
                setPaymentModalOpen(true);
              }}
              className="w-full py-4 bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white rounded-2xl font-black text-sm shadow-xl shadow-orange-500/25 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-5 h-5 text-amber-200" />
              <span>
                {isLoggedIn
                  ? `PROCEED TO PAY • ₹${grandTotal.toFixed(2)}`
                  : `SIGN UP TO PLACE ORDER • ₹${grandTotal.toFixed(2)}`}
              </span>
            </button>"""

billing_code = billing_code.replace(old_pay_click, new_pay_click)
billing_path.write_text(billing_code, encoding="utf-8")
print("BillingPage.jsx updated successfully!")


# =====================================================================
# 5. Update MenuPage.jsx
# =====================================================================
menu_path = SRC_DIR / "pages" / "MenuPage.jsx"
menu_code = menu_path.read_text(encoding="utf-8")

old_menu_auth = "const { currentCustomer } = useCustomerAuth();"
new_menu_auth = "const { currentCustomer, isLoggedIn, openSignupModal } = useCustomerAuth();"
menu_code = menu_code.replace(old_menu_auth, new_menu_auth)

old_menu_bill_btn = """              <button
                onClick={() => navigate('/billing')}
                className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-2xl text-xs font-black shadow-lg shadow-orange-500/30 active:scale-95 transition-all shrink-0"
              >
                <span>View Bill & Pay</span>
                <ArrowRight className="w-4 h-4" />
              </button>"""

new_menu_bill_btn = """              <button
                onClick={() => {
                  if (!isLoggedIn) {
                    openSignupModal();
                  } else {
                    navigate('/billing');
                  }
                }}
                className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-2xl text-xs font-black shadow-lg shadow-orange-500/30 active:scale-95 transition-all shrink-0"
              >
                <span>{isLoggedIn ? 'View Bill & Pay' : 'Sign Up & Order'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>"""

menu_code = menu_code.replace(old_menu_bill_btn, new_menu_bill_btn)
menu_path.write_text(menu_code, encoding="utf-8")
print("MenuPage.jsx updated successfully!")


# =====================================================================
# 6. Update Header.jsx
# =====================================================================
header_path = SRC_DIR / "components" / "layout" / "Header.jsx"
header_code = header_path.read_text(encoding="utf-8")

old_header_auth = "const { currentCustomer, isLoggedIn, logout, openLoginModal } = useCustomAuth || {};"
# check actual import
if "openSignupModal" not in header_code:
    header_code = header_code.replace("openLoginModal,", "openLoginModal, openSignupModal,")

# Update Ready to Order CTA in Header
old_ready_order_header = """            {/* PROMINENT "READY TO ORDER" HERO BUTTON */}
            <button
              type="button"
              onClick={() => navigate('/menu')}
              id="header-ready-to-order-cta\""""

new_ready_order_header = """            {/* PROMINENT "READY TO ORDER" HERO BUTTON */}
            <button
              type="button"
              onClick={() => {
                if (cart.length > 0) {
                  if (!isLoggedIn) {
                    openSignupModal();
                  } else {
                    navigate('/billing');
                  }
                } else {
                  navigate('/menu');
                }
              }}
              id="header-ready-to-order-cta\""""

if old_ready_order_header in header_code:
    header_code = header_code.replace(old_ready_order_header, new_ready_order_header)
    header_path.write_text(header_code, encoding="utf-8")
    print("Header.jsx updated successfully!")
else:
    print("Header.jsx ready-to-order pattern check.")

print("All components updated for signup & direct payment flow!")
