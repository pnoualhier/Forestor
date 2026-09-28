import https from 'node:https';

function get(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, json: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    }).on('error', (err) => resolve({ error: err.message }));
  });
}

async function run() {
  const tables = [
    'extentOfForest',
    'forestCharacteristics',
    'forestAreaChange',
    'forestAreaWithinProtectedAreas',
    'forestOwnership',
    'growingStockTotal',
    'biomassStockTotal',
    'carbonStockTotal',
    'disturbances',
    'areaAffectedByFire',
    'sustainableDevelopment15_1_1'
  ];

  for (const table of tables) {
    const url = `https://fra-data.fao.org/api/explorer/data?assessmentName=fra&countryISOs[]=FRA&tableNames[]=${table}`;
    const res = await get(url);
    if (res.json && res.json.fra && res.json.fra['2025'] && res.json.fra['2025']['FRA']) {
      const tableData = res.json.fra['2025']['FRA'][table];
      const years = Object.keys(tableData || {});
      const sampleYear = years[0];
      const variables = sampleYear ? Object.keys(tableData[sampleYear] || {}) : [];
      console.log(`\nTable [${table}]:`);
      console.log(`  Years (${years.length}):`, years.slice(0, 10).join(', '));
      console.log(`  Variables for ${sampleYear}:`, variables.join(', '));
      if (sampleYear && variables.length > 0) {
        console.log(`  Sample values (${sampleYear}):`, JSON.stringify(tableData[sampleYear], null, 2).slice(0, 300));
      }
    } else {
      console.log(`Table [${table}] failed or unexpected:`, res.status, JSON.stringify(res.json || res.raw || res.error).slice(0, 150));
    }
  }
}

run();
