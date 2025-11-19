export async function GET() {
  const hasApiKey = Boolean(process.env.RESEND_API_KEY);
  const hasFrom = Boolean(process.env.RESEND_FROM);
  const hasTo = Boolean(process.env.RESEND_TO);

  const body = {
    ok: hasApiKey && hasFrom && hasTo,
    env: {
      RESEND_API_KEY: hasApiKey,
      RESEND_FROM: hasFrom,
      RESEND_TO: hasTo,
    },
    timestamp: new Date().toISOString(),
  };

  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
