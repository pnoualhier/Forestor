import https from 'node:https';

function get(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          url,
          status: res.statusCode,
          contentType: res.headers['content-type'],
          data: data
        });
      });
    }).on('error', (err) => {
      resolve({ url, error: err.message });
    });
  });
}

async function run() {
  console.log('Testing /api/cycle-data/table/table-data...');
  const res1 = await get('https://fra-data.fao.org/api/cycle-data/table/table-data?assessmentName=fra&cycleName=2025&countryISOs[]=FRA&tableNames[]=extentOfForest');
  console.log('Status 1:', res1.status, res1.contentType);
  if (res1.data) {
    try {
      const parsed = JSON.parse(res1.data);
      console.log('Parsed type:', Array.isArray(parsed) ? `Array(${parsed.length})` : typeof parsed);
      console.log('Keys / sample:', Array.isArray(parsed) ? parsed.slice(0, 3) : Object.keys(parsed));
      console.log('Sample item:', JSON.stringify(Array.isArray(parsed) ? parsed[0] : parsed, null, 2).slice(0, 800));
    } catch {
      console.log('Body raw:', res1.data.slice(0, 300));
    }
  }

  console.log('\nTesting /api/explorer/data...');
  const res2 = await get('https://fra-data.fao.org/api/explorer/data?assessmentName=fra&countryISOs[]=FRA&tableNames[]=extentOfForest');
  console.log('Status 2:', res2.status, res2.contentType);
  if (res2.data) {
    try {
      const parsed2 = JSON.parse(res2.data);
      console.log('Parsed type 2:', Array.isArray(parsed2) ? `Array(${parsed2.length})` : typeof parsed2);
      console.log('Keys / sample 2:', Array.isArray(parsed2) ? parsed2.slice(0, 3) : Object.keys(parsed2));
      console.log('Sample item 2:', JSON.stringify(Array.isArray(parsed2) ? parsed2[0] : parsed2, null, 2).slice(0, 800));
    } catch {
      console.log('Body raw 2:', res2.data.slice(0, 300));
    }
  }
}

run();
