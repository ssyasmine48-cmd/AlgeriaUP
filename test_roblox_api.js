const https = require('https');

const ID = '78108050172428';

function fetchUrl(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    resolve({ error: 'JSON Parse Error', raw: data });
                }
            });
        }).on('error', reject);
    });
}

async function test() {
    console.log(`Testing ID: ${ID}`);

    // 1. Try as Place ID to get Universe ID
    console.log('\n--- Attempting to resolve as Place ID ---');
    try {
        const placeData = await fetchUrl(`https://games.roblox.com/v1/games/multiget-place-details?placeIds=${ID}`);
        console.log('Place API Response:', JSON.stringify(placeData, null, 2));
    } catch (e) {
        console.error('Place API Error:', e.message);
    }

    // 2. Try as Universe ID directly
    console.log('\n--- Attempting to use as Universe ID directly ---');
    try {
        const gameData = await fetchUrl(`https://games.roblox.com/v1/games?universeIds=${ID}`);
        console.log('Game API Response:', JSON.stringify(gameData, null, 2));
    } catch (e) {
        console.error('Game API Error:', e.message);
    }
}

test();
