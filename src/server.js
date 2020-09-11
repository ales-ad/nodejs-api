const app = require('./app');
const config = require('./config');

let serverSock = require('http').createServer();
let io = require('socket.io')(serverSock, { serverSock: config.socket.path });

const port = config.app.port;

let server = app.listen(port, function () {
    let host = server.address().address;
    let port = server.address().port;
    console.log('App listening at http://%s:%s', host, port);
});

io.on('connect', (socket) => {
    socket.on('message', async (params) => {
        io.emit('message', params);
    });
});

serverSock.listen(config.socket.port, config.socket.host, () => {
    let host = serverSock.address().address;
    let port = serverSock.address().port;
    console.log('socket http://%s:%s', host, port);
});
