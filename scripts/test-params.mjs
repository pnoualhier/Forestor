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
  console.log('--- Testing /api/cycle-data/table/table-data variations ---');
  // Check parameters in Swagger for table-data
  // countryIso vs countryISOs[]
  const test1 = await get('https://fra-data.fao.org/api/cycle-data/table/table-data?assessmentName=fra&cycleName=2025&countryIso=FRA&tableNames[]=extentOfForest');
  console.log('countryIso=FRA:', test1.status, test1.data.slice(0, 300));

  const test2 = await get('https://fra-data.fao.org/api/cycle-data/table/table-data?assessmentName=fra&cycleName=2025&countryISOs[]=FRA&tableNames[]=extentOfForest');
  console.log('countryISOs[]=FRA:', test2.status, test2.data.slice(0, 300));

  const test3 = await get('https://fra-data.fao.org/api/cycle-data/table/table-data?assessmentName=fra&cycleName=2025&countryIso=FRA&tableName=extentOfForest');
  console.log('countryIso=FRA & tableName=extentOfForest:', test3.status, test3.data.slice(0, 300));

  console.log('\n--- Testing /api/cycle-data/descriptions ---');
  const testDesc = await get('https://fra-data.fao.org/api/cycle-data/descriptions?assessmentName=fra&cycleName=2025&countryIso=FRA');
  console.log('descriptions status:', testDesc.status, testDesc.data.slice(0, 400));

  console.log('\n--- Testing /api/cycle-data/national-data-points ---');
  const testNdp = await get('https://fra-data.fao.org/api/cycle-data/national-data-points?assessmentName=fra&cycleName=2025&countryIso=FRA');
  console.log('national-data-points status:', testNdp.status, testNdp.data.slice(0, 400));
}

run();
