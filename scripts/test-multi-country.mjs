import https from 'node:https';

function get(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

async function run() {
  const countries = ['FRA', 'BRA', 'CAN', 'IDN', 'COD'];
  const tables = ['extentOfForest', 'forestCharacteristics', 'forestAreaChange', 'forestAreaWithinProtectedAreas', 'carbonStockTotal', 'sustainableDevelopment15_1_1'];
  
  const query = countries.map(c => `countryISOs[]=${c}`).join('&') + '&' + tables.map(t => `tableNames[]=${t}`).join('&');
  const url = `https://fra-data.fao.org/api/explorer/data?assessmentName=fra&${query}`;
  console.log('Fetching multi-country data...');
  const data = await get(url);
  if (!data || !data.fra || !data.fra['2025']) {
    console.log('Error fetching multi-country data');
    return;
  }
  for (const c of countries) {
    const cData = data.fra['2025'][c];
    console.log(`\n=== COUNTRY ${c} ===`);
    if (!cData) {
      console.log('No data');
      continue;
    }
    const extent1990 = cData.extentOfForest?.['1990']?.forestArea?.raw;
    const extent2025 = cData.extentOfForest?.['2025']?.forestArea?.raw;
    const prop2025 = cData.sustainableDevelopment15_1_1?.['2025']?.forestAreaProportionLandArea2015?.raw;
    const carbon2025Soil = cData.carbonStockTotal?.['2025']?.carbon_forest_soil?.raw;
    const carbon2025Above = cData.carbonStockTotal?.['2025']?.carbon_forest_above_ground?.raw;
    const protected2025 = cData.forestAreaWithinProtectedAreas?.['2025']?.forest_area_within_protected_areas?.raw;
    const primary2025 = cData.forestCharacteristics?.['2025']?.primaryForest?.raw;
    const planted2025 = cData.forestCharacteristics?.['2025']?.plantedForest?.raw;

    console.log(`  Forest Area (1000 ha): 1990=${extent1990}, 2025=${extent2025}`);
    console.log(`  Forest Proportion (%): 2025=${prop2025}`);
    console.log(`  Carbon (M tonnes): 2025 Above=${carbon2025Above}, Soil=${carbon2025Soil}`);
    console.log(`  Protected (1000 ha): 2025=${protected2025}`);
    console.log(`  Characteristics (1000 ha): 2025 Primary=${primary2025}, Planted=${planted2025}`);
  }
}

run();
