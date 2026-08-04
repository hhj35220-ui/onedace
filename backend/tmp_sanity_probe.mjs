const fs = require('fs');
fs.writeFileSync('sanity_probe.txt', 'hello-from-node\n');
console.log('wrote');
