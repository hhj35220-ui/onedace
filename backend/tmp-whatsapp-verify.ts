import { setTimeout as delay } from 'timers/promises';

const base = 'http://127.0.0.1:3100/api/v1';
const email = `verify-whatsapp-${Date.now()}@example.com`;
const password = 'Password123!';

async function jsonFetch(url: string, init: RequestInit = {}) {
  const response = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
  });

  const text = await response.text();
  let payload: unknown = text;
  try {
    payload = JSON.parse(text);
  } catch {
    // leave raw text for non-JSON responses
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

  const loginPayload = login.payload as { success?: boolean; data?: { accessToken?: string } };
  if (!loginPayload?.success || !loginPayload.data?.accessToken) {
    console.error('LOGIN_FAILED', JSON.stringify(login.payload, null, 2));
    process.exit(1);
  }

  const accessToken = loginPayload.data.accessToken;
  const authHeaders = {
    Authorization: `Bearer ${accessToken}`,
  };

  const orgCreate = await jsonFetch(`${base}/organizations`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({ name: 'WhatsApp Verify Org', description: 'Runtime verification org' }),
  });

  const orgPayload = orgCreate.payload as { data?: { id?: string } };
  const organizationId = orgPayload?.data?.id;
  if (!organizationId) {
    console.error('ORG_CREATE_FAILED', JSON.stringify(orgCreate.payload, null, 2));
    process.exit(1);
  }

  const sessionKey = `verify-session-${Date.now()}`;
  const connect = await jsonFetch(`${base}/platforms/whatsapp/connect`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({ organizationId, sessionKey }),
  });

  console.log('CONNECT_RESPONSE', JSON.stringify(connect.payload, null, 2));

  for (let i = 0; i < 6; i += 1) {
    await delay(2000);
    const status = await jsonFetch(`${base}/platforms/whatsapp/status?organizationId=${encodeURIComponent(organizationId)}&sessionKey=${encodeURIComponent(sessionKey)}`, {
      headers: authHeaders,
    });

    const qr = await jsonFetch(`${base}/platforms/whatsapp/qr?organizationId=${encodeURIComponent(organizationId)}&sessionKey=${encodeURIComponent(sessionKey)}`, {
      headers: authHeaders,
    });

    console.log(`POLL_${i + 1}_STATUS`, JSON.stringify(status.payload, null, 2));
    console.log(`POLL_${i + 1}_QR`, JSON.stringify(qr.payload, null, 2));
  }
}

void main();
