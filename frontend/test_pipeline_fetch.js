const fetch = require('node-fetch');

async function testPipeline() {
    try {
        const res = await fetch('http://127.0.0.1:3000/api/proxy/articles/production', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Use the valid cookie from the login phase if we can, but since we are just testing if the proxy is alive, we might get 401. 
                // Let's at least check if it resolves to 401 instead of 404!
            }
        });

        console.log("Status:", res.status);
        const text = await res.text();
        console.log("Body:", text);
    } catch (e) {
        console.error("Fetch failed:", e);
    }
}

testPipeline();
