const WebSocket = require('ws');

const ws = new WebSocket('ws://127.0.0.1:8000/ws/mural-producao');

ws.on('open', function open() {
    console.log('Connected to server');
});

ws.on('message', function incoming(data) {
    console.log('Received:', data.toString());
    ws.close();
});

ws.on('error', function error(err) {
    console.error('WS Error:', err);
});
