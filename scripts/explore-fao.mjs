import https from 'node:https';

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`Failed to parse JSON from ${url}: ${e.message}. Status: ${res.statusCode}. Body: ${data.slice(0, 300)}`));
        }
      });
    }).on('error', reject);
  });
}

async function run() {
  const swagger = await fetchJson('https://fra-data.fao.org/api-docs/swagger.json');
  console.log('OpenAPI Version:', swagger.openapi);
  console.log('Servers:', swagger.servers);

  const resolve = (ref) => {
    if (!ref || !ref.startsWith('#/')) return ref;
    const parts = ref.replace('#/', '').split('/');
    let curr = swagger;
    for (const p of parts) curr = curr[p];
    return curr;
  };

  for (const [p, methods] of Object.entries(swagger.paths)) {
    if (p === 'openapi') continue;
    for (const [m, op] of Object.entries(methods)) {
      console.log(`\n=== ${m.toUpperCase()} ${p} ===`);
      console.log('Summary:', op.summary);
      console.log('Parameters:');
      for (const param of (op.parameters || [])) {
        const resolved = param['$ref'] ? resolve(param['$ref']) : param;
        console.log(`  - ${resolved.name} (in: ${resolved.in}, req: ${resolved.required}): schema = ${JSON.stringify(resolved.schema)}`);
      }
    }
  }
}

run().catch(console.error);
