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
  const tests = [
    'https://fra-data.fao.org/api/cycle-data/table/table-data?assessmentName=fra&cycleName=2025&countryIso=FRA&tableNames=extentOfForest',
    'https://fra-data.fao.org/api/cycle-data/table/table-data?assessmentName=fra&cycleName=2025&countryISOs=FRA&tableNames=extentOfForest',
    'https://fra-data.fao.org/api/cycle-data/table/table-data?assessmentName=fra&cycleName=2025&countryISOs=FRA&tableNames[]=extentOfForest',
    'https://fra-data.fao.org/api/cycle-data/table/table-data?assessmentName=fra&cycleName=2025&countryIso=FRA&tableNames[]=extentOfForest&columns[]=1990',
    'https://fra-data.fao.org/api/cycle-data/table/table-data?assessmentName=fra&cycleName=2025&countryIso=FRA&tableNames=extentOfForest&columns=1990',
  ];

  for (const t of tests) {
    const res = await get(t);
    console.log(t.split('?')[1], '=>', res.status, res.data.slice(0, 150));
  }
}

run();
