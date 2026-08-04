const base = 'http://127.0.0.1:60079/api/v1';
const email = `verify-whatsapp-${Date.now()}@example.com`;
const password = 'Password123!';

async function jsonFetch(url, init = {}) {
  const response = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
  });

  const text = await response.text();
  let payload = text;
  try {
    payload = JSON.parse(text);
  } catch {
    // keep raw text for non-JSON response
  }

  return { response, payload };
}

async function main() {
  const register = await jsonFetch(`${base}/auth/register`, {
    method: 'POST',
    body: JSON.stringify({
      firstName: 'Verify',
      lastName: 'User',
      email,
      password,
      confirmPassword: password,
    }),
  });

  console.log('REGISTER_RESPONSE', JSON.stringify(register.payload, null, 2));

  const login = await jsonFetch(`${base}/auth/login`, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  const accessToken = login.payload?.data?.accessToken;
  console.log('LOGIN_RESPONSE', JSON.stringify(login.payload, null, 2));

  if (!accessToken) {
    process.exit(1);
  }

  const authHeaders = {
    Authorization: `Bearer ${accessToken}`,
  };

  const orgCreate = await jsonFetch(`${base}/organizations`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({ name: 'WhatsApp Verify Org', description: 'Runtime verification org' }),
  });

  const organizationId = orgCreate.payload?.data?.id;
  console.log('ORG_CREATE_RESPONSE', JSON.stringify(orgCreate.payload, null, 2));

  if (!organizationId) {
    process.exit(1);
  }

  const sessionKey = `verify-session-${Date.now()}`;
  const connect = await jsonFetch(`${base}/platforms/whatsapp/connect`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({ organizationId, sessionKey }),
  });

  console.log('CONNECT_RESPONSE', JSON.stringify(connect.payload, null, 2));

  for (let i = 1; i <= 4; i += 1) {
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const status = await jsonFetch(
      `${base}/platforms/whatsapp/status?organizationId=${encodeURIComponent(organizationId)}&sessionKey=${encodeURIComponent(sessionKey)}`,
      { headers: authHeaders }
    );

    const qr = await jsonFetch(
      `${base}/platforms/whatsapp/qr?organizationId=${encodeURIComponent(organizationId)}&sessionKey=${encodeURIComponent(sessionKey)}`,
      { headers: authHeaders }
    );

    console.log(`POLL_${i}_STATUS`, JSON.stringify(status.payload, null, 2));
    console.log(`POLL_${i}_QR`, JSON.stringify(qr.payload, null, 2));
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
