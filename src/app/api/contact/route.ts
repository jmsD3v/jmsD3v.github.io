import sanitizeHtml from 'sanitize-html';
import { Resend } from 'resend';

type ContactPayload = {
  name: string;
  email: string;
  phone?: string;
  message: string;
  company?: string; // honeypot
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function tryLogPersistently(
  payload: ContactPayload,
  meta: { success: boolean; error?: string }
) {
  // Optional persistent logging: attempt Supabase insert if env present and supabase client available
  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      // Import supabase at runtime only. Use eval to avoid bundlers statically
      // resolving the module when it's not installed in the environment.
      // @ts-ignore
      const supabaseModule = await eval("import('@supabase/supabase-js')");
      const createClient =
        supabaseModule.createClient || supabaseModule.default?.createClient;
      if (typeof createClient === 'function') {
        const supabase = createClient(
          process.env.SUPABASE_URL,
          process.env.SUPABASE_SERVICE_ROLE_KEY
        );
        await supabase
          .from('contact_messages')
          .insert([
            { ...payload, success: meta.success, error: meta.error || null },
          ]);
        return;
      }
    } catch (err) {
      console.error('Supabase logging failed (or not installed)', err);
    }
  }
  // Fallback to console log
  console.log('Contact attempt', { payload, meta });
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ContactPayload;

    // Honeypot check
    if (body.company && body.company.trim() !== '') {
      await tryLogPersistently(body, {
        success: false,
        error: 'honeypot triggered',
      });
      return new Response(JSON.stringify({ error: 'Spam detected' }), {
        status: 400,
      });
    }

    const name = (body.name || '').trim();
    const email = (body.email || '').trim();
    const phone = (body.phone || '').trim();
    const messageRaw = (body.message || '').trim();

    if (!name || !email || !messageRaw) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400 }
      );
    }

    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ error: 'Invalid email format' }), {
        status: 400,
      });
    }

    const cleanMessage = sanitizeHtml(messageRaw, {
      allowedTags: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li'],
      allowedAttributes: { a: ['href', 'rel', 'target'] },
      allowedSchemes: ['http', 'https', 'mailto'],
    });

    const html = `
      <h2>New contact from portfolio</h2>
      <p><strong>Name:</strong> ${sanitizeHtml(name)}</p>
      <p><strong>Email:</strong> ${sanitizeHtml(email)}</p>
      <p><strong>Phone:</strong> ${sanitizeHtml(phone)}</p>
      <hr />
      <div>${cleanMessage}</div>
    `;

    // Send via Resend if configured
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const RESEND_FROM = process.env.RESEND_FROM; // e.g. 'no-reply@yourdomain.com'
    const RESEND_TO = process.env.RESEND_TO; // your inbox

    if (!RESEND_API_KEY || !RESEND_FROM || !RESEND_TO) {
      await tryLogPersistently(body, {
        success: false,
        error: 'Resend not configured',
      });
      return new Response(
        JSON.stringify({ error: 'Email service not configured' }),
        { status: 500 }
      );
    }

    try {
      // Debugging: log masked env and params to help diagnose delivery issues
      const mask = (s?: string) =>
        s ? `${s.slice(0, 6)}...${s.slice(-4)}` : 'undefined';
      console.log('Resend config', {
        RESEND_API_KEY: mask(RESEND_API_KEY),
        RESEND_FROM: RESEND_FROM,
        RESEND_TO: RESEND_TO,
      });

      const emailParams = {
        from: RESEND_FROM,
        to: RESEND_TO,
        subject: `Portfolio contact from ${name}`,
        html,
      };
      console.log('Sending email with params', {
        ...emailParams,
        htmlLength: html.length,
      });

      // Create Resend client with a small fallback strategy in case the package export shape differs
      let resendClient: any;
      try {
        // Primary: named import/class
        resendClient = new (Resend as any)(RESEND_API_KEY);
      } catch (errPrimary) {
        try {
          // Fallback: maybe default export
          const ResendDefault = (Resend as any).default || Resend;
          resendClient = new ResendDefault(RESEND_API_KEY);
        } catch (errFallback) {
          console.error(
            'Failed to instantiate Resend client',
            errPrimary,
            errFallback
          );
          throw errFallback || errPrimary;
        }
      }

      const sendResult = await resendClient.emails.send(emailParams);
      console.log('Resend send result', sendResult);

      // If Resend returns an error object, treat as failure
      if (sendResult?.error) {
        console.error('Resend returned API error', sendResult.error);
        const errMsg =
          sendResult.error?.message || JSON.stringify(sendResult.error);
        await tryLogPersistently(body, {
          success: false,
          error: String(errMsg),
        });
        return new Response(
          JSON.stringify({
            error: 'Email service rejected request',
            details: errMsg,
          }),
          { status: 500 }
        );
      }

      await tryLogPersistently(body, { success: true });
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    } catch (err: any) {
      console.error('Resend error', err);
      await tryLogPersistently(body, {
        success: false,
        error: String(err?.message || err),
      });
      return new Response(JSON.stringify({ error: 'Failed to send email' }), {
        status: 500,
      });
    }
  } catch (err: any) {
    console.error('Contact route error', err);
    return new Response(JSON.stringify({ error: 'Bad request' }), {
      status: 400,
    });
  }
}
