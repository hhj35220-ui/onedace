const base = 'http://127.0.0.1:3100/api/v1';
const email = `verify-whatsapp-${Date.now()}@example.com`;
const password = 'Password123!';

async function api(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  const text = await response.text();
  let payload;
  try {
    payload = JSON.parse(text);
  } catch {
    payload = text;
  }

  return { response, payload };
}

(async () => {
  const register = await api(`${base}/auth/register`, {
    method: 'POST',
    body: JSON.stringify({
      firstName: 'Verify',
      lastName: 'User',
      email,
      password,
      confirmPassword: password,
    }),
  });

  console.log('REGISTER', JSON.stringify(register.payload, null, 2));

  const login = await api(`${base}/auth/login`, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  console.log('LOGIN', JSON.stringify(login.payload, null, 2));

  const loginPayload = login.payload;
  const accessToken = loginPayload?.data?.accessToken;
  if (!accessToken) {
    console.error('Login did not return accessToken');
    process.exit(1);
  }

  const authHeaders = { Authorization: `Bearer ${accessToken}` };

  const orgCreate = await api(`${base}/organizations`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({ name: 'WhatsApp Verify Org', description: 'Runtime verification org' }),
  });

  console.log('ORG_CREATE', JSON.stringify(orgCreate.payload, null, 2));
  const organizationId = orgCreate.payload?.data?.id;
  if (!organizationId) {
    console.error('Organization create missing id');
    process.exit(1);
  }

  const sessionKey = `verify-session-${Date.now()}`;
  const connect = await api(`${base}/platforms/whatsapp/connect`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({ organizationId, sessionKey }),
  });

  console.log('CONNECT', JSON.stringify(connect.payload, null, 2));

  await new Promise((resolve) => setTimeout(resolve, 2000));
  const status = await api(`${base}/platforms/whatsapp/status?organizationId=${encodeURIComponent(organizationId)}&sessionKey=${encodeURIComponent(sessionKey)}`, {
    headers: authHeaders,
  });

  console.log('STATUS', JSON.stringify(status.payload, null, 2));

  const qr = await api(`${base}/platforms/whatsapp/qr?organizationId=${encodeURIComponent(organizationId)}&sessionKey=${encodeURIComponent(sessionKey)}`, {
    headers: authHeaders,
  });

  console.log('QR', JSON.stringify(qr.payload, null, 2));
})();
