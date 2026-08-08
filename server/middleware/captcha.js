/**
 * Middleware to verify Cloudflare Turnstile CAPTCHA token
 */
const verifyCaptcha = async (req, res, next) => {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  
  // If no secret key is set, log a warning and bypass verification to avoid locking out the system
  if (!secretKey) {
    console.warn('[Captcha Middleware] TURNSTILE_SECRET_KEY is not defined. Bypassing CAPTCHA verification.');
    return next();
  }

  const { captchaToken } = req.body;

  if (!captchaToken) {
    return res.status(400).json({ error: 'Verification challenge is incomplete. Please complete the CAPTCHA.' });
  }

  try {
    console.log('[Captcha Middleware] Verifying Turnstile token...');
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        secret: secretKey,
        response: captchaToken,
        remoteip: req.ip
      })
    });

    const data = await response.json();

    if (data.success) {
      console.log('[Captcha Middleware] Token verified successfully!');
      return next();
    } else {
      console.warn('[Captcha Middleware] Verification rejected:', data['error-codes']);
      return res.status(400).json({ error: 'Security verification failed. Please check the CAPTCHA and try again.' });
    }
  } catch (error) {
    console.error('[Captcha Middleware Error]:', error.message);
    // If the Cloudflare server itself is down or unreachable, fall back to warning and allow requests to process
    console.warn('[Captcha Middleware] Cloudflare verification unreachable. Allowing request fallback.');
    return next();
  }
};

module.exports = { verifyCaptcha };
