async function testLogin() {
    console.log("Testing POST to /api/proxy/auth/login...");
    try {
        const res = await fetch('http://127.0.0.1:3000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'operador@facebrasil.com',
                password: 'password123'
            })
        });

        const status = res.status;
        console.log("STATUS:", status);
        console.log("HEADERS (Set-Cookie):", res.headers.get('set-cookie'));

        const text = await res.text();
        console.log("BODY:", text);
    } catch (err) {
        console.error("Fetch failed:", err);
    }
}

testLogin();
