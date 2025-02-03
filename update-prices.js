const https = require('https');
const fs = require('fs');

async function fetchPrices() {
    try {
        // Haal TenneT data op via proxy
        const url = `https://api.allorigins.win/raw?url=${encodeURIComponent('https://transparency.tennet.eu/api/v1/dayahead_prices?date=' + new Date().toISOString().split('T')[0])}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data && data.data) {
            const prices = data.data.map(item => parseFloat(item.price));
            
            // Bereken statistieken
            const priceData = {
                last_updated: new Date().toISOString(),
                prices: {
                    average: prices.reduce((a, b) => a + b, 0) / prices.length,
                    minimum: Math.min(...prices),
                    maximum: Math.max(...prices)
                }
            };
            
            // Schrijf naar bestand
            fs.writeFileSync('prices.json', JSON.stringify(priceData, null, 2));
            console.log('Prices updated successfully');
        }
    } catch (error) {
        console.error('Error updating prices:', error);
        process.exit(1);
    }
}

fetchPrices();
