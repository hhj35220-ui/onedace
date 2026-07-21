const assert = require('assert');

function normalizeLinkedInData(raw) {
  if (!raw) return null;
  if (raw.connections || raw.contacts || raw.messages) return raw;
  if (raw.data && typeof raw.data === 'object') {
    return raw.data;
  }
  return null;
}

function readConnections(raw) {
  const data = normalizeLinkedInData(raw);
  if (!data) return [];
  return Array.isArray(data.connections) ? data.connections : [];
}

const wrapped = { version: 2, updatedAt: '2026-07-21T18:59:39.547Z', data: { contacts: [], connections: [{ id: 'cr1' }] } };
const plain = { contacts: [], connections: [{ id: 'cr2' }] };

assert.deepStrictEqual(readConnections(wrapped), [{ id: 'cr1' }]);
assert.deepStrictEqual(readConnections(plain), [{ id: 'cr2' }]);
console.log('linkedin connection requests storage normalization test passed');
