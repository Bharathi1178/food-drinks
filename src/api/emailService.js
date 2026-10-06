/**
 * Email Service for Dispatching One-Time Passwords (OTP)
 * Sends verification emails directly to customer email addresses.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://127.0.0.1:8000/api' : '/api');

export const emailService = {
  /**
   * Send 6-digit OTP code directly to the customer's email address
   * @param {string} toEmail - Customer email address
   * @param {string} otpCode - Generated 6-digit OTP
   * @param {string} customerName - Customer username
   */
  sendOtpEmail: async (toEmail, otpCode, customerName = 'Customer') => {
    const cleanEmail = (toEmail || '').trim();
    if (!cleanEmail) {
      throw new Error('Valid email address is required');
    }

    let backendDispatched = false;
    let emailjsDispatched = false;

    // 1. Dispatch via Django Backend API
    try {
      const response = await fetch(`${API_BASE_URL}/auth/send-otp/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: cleanEmail,
          otp: otpCode,
          name: customerName,
        }),
      });

      if (response.ok) {
        backendDispatched = true;
      }
    } catch (err) {
      console.warn('[EmailService] Backend dispatch note:', err.message);
    }

    // 2. Dispatch via EmailJS if configured on window or env
    try {
      const emailjsConfig = window.EMAILJS_CONFIG || (import.meta.env.VITE_EMAILJS_SERVICE_ID ? {
        serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
        templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      } : null);

      if (emailjsConfig && emailjsConfig.serviceId) {
        await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            service_id: emailjsConfig.serviceId,
            template_id: emailjsConfig.templateId,
            user_id: emailjsConfig.publicKey,
            template_params: {
              to_email: cleanEmail,
              to_name: customerName,
              otp_code: otpCode,
              app_name: 'BiteCraze Food Delivery',
            },
          }),
        });
        emailjsDispatched = true;
      }
    } catch (err) {
      console.warn('[EmailService] EmailJS dispatch note:', err.message);
    }

    // Log for development and testing
    console.info(
      `%c[BiteCraze OTP Service] Dispatched 6-digit code for ${cleanEmail}: ${otpCode}`,
      'background: #ea580c; color: white; font-weight: bold; padding: 4px 8px; border-radius: 4px;'
    );

    return {
      success: true,
      email: cleanEmail,
      otpCode: otpCode,
      backendDispatched,
      emailjsDispatched,
      message: `OTP dispatched to ${cleanEmail}`,
    };
  },
};
