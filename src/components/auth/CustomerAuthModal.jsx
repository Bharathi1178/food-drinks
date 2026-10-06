import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  User,
  Phone,
  Mail,
  Lock,
  Flame,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  UserPlus,
  LogIn,
  Check,
  KeyRound,
  Send,
  RotateCcw,
} from 'lucide-react';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { usePOS } from '../../context/POSContext';
import { customerDB } from '../../api/customerDatabase';
import { emailService } from '../../api/emailService';

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

  const { setPaymentModalOpen } = usePOS();
  const navigate = useNavigate();

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup form state
  const [signupName, setSignupName] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  // Email OTP verification state
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [otpNotice, setOtpNotice] = useState('');
  const [showOtpFallback, setShowOtpFallback] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // OTP Countdown timer
  useEffect(() => {
    let timer;
    if (otpCountdown > 0) {
      timer = setTimeout(() => setOtpCountdown((c) => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [otpCountdown]);

  if (!authModalOpen) return null;

  // Password validation: 8+ chars with letters, numbers, and special characters
  const validatePassword = (pwd) => {
    if (!pwd || pwd.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/[A-Za-z]/.test(pwd)) {
      return 'Password must contain at least one letter';
    }
    if (!/[0-9]/.test(pwd)) {
      return 'Password must contain at least one number';
    }
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(pwd)) {
      return 'Password must contain at least one special character (e.g. @, #, $, !)';
    }
    return null;
  };

  const getPasswordCriteria = (pwd) => {
    return {
      hasMinLength: pwd.length >= 8,
      hasLetters: /[A-Za-z]/.test(pwd),
      hasNumbers: /[0-9]/.test(pwd),
      hasSpecial: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(pwd),
    };
  };

  // Direct customer to payment area immediately after authentication
  const goToPaymentArea = () => {
    setAuthModalOpen(false);
    navigate('/billing');
    // Open payment modal directly so order can be placed immediately
    setTimeout(() => {
      setPaymentModalOpen(true);
    }, 250);
  };

  // Trigger Email OTP generation
  const handleSendOtp = async () => {
    setErrorMsg('');
    const emailVal = signupEmail.trim();
    if (!emailVal || !emailVal.includes('@') || !emailVal.includes('.')) {
      setErrorMsg('Please enter a valid email address first to get OTP');
      return;
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setEmailOtpSent(true);
    setShowOtpFallback(false);
    setEnteredOtp('');
    setIsEmailVerified(false);
    setOtpCountdown(60);
    setOtpNotice(`OTP sent directly to ${emailVal}. Please check your inbox or spam folder.`);

    // Dispatch to customer's email inbox
    try {
      await emailService.sendOtpEmail(emailVal, code, signupName.trim() || 'Customer');
    } catch (err) {
      console.error('Email dispatch error:', err);
    }
  };

  // Verify entered OTP
  const handleVerifyOtp = (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    if (!enteredOtp || enteredOtp.trim().length !== 6) {
      setErrorMsg('Please enter the 6-digit OTP code');
      return;
    }
    if (enteredOtp.trim() === generatedOtp) {
      setIsEmailVerified(true);
      setOtpNotice('');
      setErrorMsg('');
    } else {
      setErrorMsg('Invalid OTP. Please check the code and try again.');
    }
  };

  const handleEmailChange = (val) => {
    setSignupEmail(val);
    if (isEmailVerified || emailOtpSent) {
      setIsEmailVerified(false);
      setEmailOtpSent(false);
      setShowOtpFallback(false);
      setGeneratedOtp('');
      setEnteredOtp('');
      setOtpNotice('');
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    const idVal = loginIdentifier.trim();
    if (!idVal) {
      setErrorMsg('Please enter your mobile number or email address');
      return;
    }

    if (!loginPassword) {
      setErrorMsg('Please enter your password');
      return;
    }

    const pwdError = validatePassword(loginPassword);
    if (pwdError) {
      setErrorMsg(`Password requirement: ${pwdError}`);
      return;
    }

    // Check if customer is already signed up in database
    const existing = customerDB.findByEmailOrPhone(idVal);
    if (!existing) {
      const cleanDigits = idVal.replace(/\D/g, '');
      if (cleanDigits.length >= 10) {
        setSignupPhone(cleanDigits.slice(-10));
      } else if (idVal.includes('@')) {
        setSignupEmail(idVal);
      } else {
        setSignupPhone(idVal);
      }
      setAuthModalTab('signup');
      setErrorMsg("Account not found! Please complete sign up below to place your order.");
      return;
    }

    setLoading(true);
    try {
      const res = await login(idVal, loginPassword);
      if (res.success) {
        goToPaymentArea();
      } else {
        if (res.notFound) {
          setAuthModalTab('signup');
          setErrorMsg('Account not found. Please sign up to place your order.');
        } else {
          setErrorMsg(res.message || 'Incorrect password.');
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
      setErrorMsg('Please enter your Username');
      return;
    }

    const cleanPhone = signupPhone.trim().replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number');
      return;
    }

    if (!signupEmail.trim() || !signupEmail.includes('@')) {
      setErrorMsg('Please enter a valid email address');
      return;
    }

    // Must verify email OTP first!
    if (!isEmailVerified) {
      setErrorMsg('Please verify your email address with OTP before setting password');
      return;
    }

    const pwdError = validatePassword(signupPassword);
    if (pwdError) {
      setErrorMsg(pwdError);
      return;
    }

    setLoading(true);
    try {
      const res = await signup({
        name: signupName.trim(),
        phone: cleanPhone,
        email: signupEmail.trim(),
        password: signupPassword,
        address: '',
        landmark: '',
        foodPreference: 'all',
        defaultOrderType: 'Delivery',
        spicePreference: 'Medium',
      });

      if (res.success) {
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
    goToPaymentArea();
  };

  const signupCriteria = getPasswordCriteria(signupPassword);
  const loginCriteria = getPasswordCriteria(loginPassword);

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
                    Password <span className="text-orange-500">*</span>
                  </label>
                  <span className="text-[10px] text-slate-400 font-semibold">
                    (8+ chars, letters, numbers & special)
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter password (e.g. Bite@1234)"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  />
                </div>

                {/* Password Criteria Badges for Login */}
                {loginPassword && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-md font-bold flex items-center gap-1 ${
                        loginCriteria.hasMinLength
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {loginCriteria.hasMinLength && <Check className="w-2.5 h-2.5" />}
                      8+ chars
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-md font-bold flex items-center gap-1 ${
                        loginCriteria.hasLetters
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {loginCriteria.hasLetters && <Check className="w-2.5 h-2.5" />}
                      Letters
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-md font-bold flex items-center gap-1 ${
                        loginCriteria.hasNumbers
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {loginCriteria.hasNumbers && <Check className="w-2.5 h-2.5" />}
                      Numbers
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-md font-bold flex items-center gap-1 ${
                        loginCriteria.hasSpecial
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {loginCriteria.hasSpecial && <Check className="w-2.5 h-2.5" />}
                      Special char (@#$!)
                    </span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white rounded-2xl font-black text-xs shadow-lg shadow-orange-500/25 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span>Sign In & Go to Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Direct Link to Sign Up */}
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
                  <span>1-Click Demo Login (Pass: Bite@1234)</span>
                </button>
              </div>
            </form>
          ) : (
            /* ================= SIGN UP FORM ================= */
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              {/* Username (Requirement 3: placeholder "Enter Username") */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">
                  Username <span className="text-orange-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    placeholder="Enter Username"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  />
                </div>
              </div>

              {/* Mobile Number */}
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

              {/* Email Address (Requirement 1: removed (Optional)) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-extrabold text-slate-700">
                    Email Address <span className="text-orange-500">*</span>
                  </label>
                  {isEmailVerified && (
                    <span className="text-[11px] font-black text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verified</span>
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={signupEmail}
                      onChange={(e) => handleEmailChange(e.target.value)}
                      placeholder="customer@example.com"
                      className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all ${
                        isEmailVerified ? 'border-emerald-500 bg-emerald-50/20' : 'border-slate-200'
                      }`}
                    />
                  </div>

                  {/* Send / Resend OTP Button */}
                  {!isEmailVerified && (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={otpCountdown > 0}
                      className="px-3.5 py-2.5 bg-orange-50 hover:bg-orange-100 text-orange-600 border border-orange-200 hover:border-orange-300 rounded-2xl text-xs font-black transition-all active:scale-95 shrink-0 flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>
                        {emailOtpSent
                          ? otpCountdown > 0
                            ? `Resend (${otpCountdown}s)`
                            : 'Resend OTP'
                          : 'Get OTP'}
                      </span>
                    </button>
                  )}
                </div>
              </div>

              {/* Email OTP Verification Input (NO OTP SHOWN ON SCREEN BY DEFAULT - DIRECT TO EMAIL) */}
              {emailOtpSent && !isEmailVerified && (
                <div className="p-3.5 bg-gradient-to-r from-orange-50/70 via-amber-50/40 to-slate-50 rounded-2xl border border-orange-200/90 space-y-2.5 animate-fade-in">
                  <div className="flex items-start gap-2 text-xs text-slate-800">
                    <Mail className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-extrabold text-slate-900 text-xs">
                        OTP Sent Directly to Your Email!
                      </p>
                      <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                        A 6-digit verification code has been dispatched to <strong>{signupEmail}</strong>. Please check your email inbox (and spam/junk folder) and enter it below.
                      </p>
                    </div>
                  </div>

                  {/* Enter OTP Input */}
                  <div className="flex gap-2 pt-1">
                    <input
                      type="text"
                      maxLength={6}
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="Enter 6-digit OTP from email"
                      className="flex-1 px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-mono font-black tracking-widest text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    />
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-xs font-black shadow-xs active:scale-95 transition-all shrink-0"
                    >
                      Verify OTP
                    </button>
                  </div>

                  {/* Resend & Immediate Verification Helper */}
                  <div className="pt-2 flex flex-col gap-2 border-t border-orange-100">
                    <div className="flex items-center justify-between text-[11px]">
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={otpCountdown > 0}
                        className="text-orange-600 font-bold hover:underline disabled:text-slate-400 disabled:no-underline flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>
                          {otpCountdown > 0 ? `Resend (${otpCountdown}s)` : 'Resend OTP to Email'}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowOtpFallback(!showOtpFallback)}
                        className="text-slate-500 hover:text-orange-600 font-bold underline flex items-center gap-1"
                      >
                        <KeyRound className="w-3 h-3 text-orange-500" />
                        <span>Didn't get email? View code</span>
                      </button>
                    </div>

                    {showOtpFallback && (
                      <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-300 text-xs flex items-center justify-between gap-2 animate-fade-in shadow-xs">
                        <div>
                          <p className="text-[10px] text-amber-800 font-bold">
                            Email delayed or spam-filtered? Your OTP is:
                          </p>
                          <p className="font-mono font-black text-sm text-orange-600 tracking-wider">
                            {generatedOtp}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setEnteredOtp(generatedOtp)}
                          className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-[11px] font-black shadow-xs active:scale-95 transition-all"
                        >
                          Auto-fill
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Requirement 3: When Email verified, THEN only show Password */}
              {isEmailVerified ? (
                /* Unlocked Password Setup */
                <div className="space-y-1 animate-fade-in pt-1 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-extrabold text-slate-700">
                      Set Password <span className="text-orange-500">*</span>
                    </label>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="Create password (e.g. Bite@1234)"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                    />
                  </div>

                  {/* Requirement 2: Exact requested text below set password */}
                  <p className="text-[11px] text-slate-500 font-semibold mt-1">
                    (please enter your password with 8 characters, letters and special charaters)
                  </p>

                  {/* Password Criteria Badges */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-md font-bold flex items-center gap-1 transition-colors ${
                        signupCriteria.hasMinLength
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {signupCriteria.hasMinLength ? (
                        <Check className="w-2.5 h-2.5 text-emerald-600" />
                      ) : (
                        '•'
                      )}
                      8+ Characters
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-md font-bold flex items-center gap-1 transition-colors ${
                        signupCriteria.hasLetters
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {signupCriteria.hasLetters ? (
                        <Check className="w-2.5 h-2.5 text-emerald-600" />
                      ) : (
                        '•'
                      )}
                      Letters
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-md font-bold flex items-center gap-1 transition-colors ${
                        signupCriteria.hasNumbers
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {signupCriteria.hasNumbers ? (
                        <Check className="w-2.5 h-2.5 text-emerald-600" />
                      ) : (
                        '•'
                      )}
                      Numbers
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-md font-bold flex items-center gap-1 transition-colors ${
                        signupCriteria.hasSpecial
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {signupCriteria.hasSpecial ? (
                        <Check className="w-2.5 h-2.5 text-emerald-600" />
                      ) : (
                        '•'
                      )}
                      Special Char (@#$!)
                    </span>
                  </div>
                </div>
              ) : (
                /* Locked State until Email is Verified */
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-dashed border-slate-300 text-center space-y-1">
                  <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-500">
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Verify your email with OTP above to unlock password setup</span>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !isEmailVerified}
                className={`w-full py-3 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2 ${
                  !isEmailVerified
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                    : 'bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white shadow-lg shadow-orange-500/25 active:scale-95'
                }`}
              >
                <span>
                  {!isEmailVerified
                    ? 'Verify Email with OTP to Continue'
                    : 'Create Account & Place Order'}
                </span>
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
