const fs = require('fs');
const socketio = require('socket.io');
const socketioJwt = require('socketio-jwt');
const http = require('http');

const zmq = require('./zmq');
const config = require('./config');

let logger = require('./utils/logger');
const utils = require('./utils');
const iomanager = require('./utils/iomanager');

const constants = require('./core/constants');
const Schemas = require('./core/validatorSchema');
const messages = require('./messages/serialization_pb');

const server = http.createServer();

let io = socketio(server, {
    path: config.ws.path,
    handlePreflightRequest: (req, res) => {
        const headers = {
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Allow-Origin': req.headers.origin,
            'Access-Control-Allow-Credentials': true,
        };
        res.writeHead(200, headers);
        res.end();
    },
});

const publicKey = fs.readFileSync(config.jwt.secret, 'utf8');

io.sockets.use(
    socketioJwt.authorize({
        secret: publicKey,
        handshake: true,
        auth_header_required: true,
        timeout: 5000,
        algorithm: 'RS256',
    })
);

io.sockets.on('connect', (socket) => {
    //socket.decoded_token.account - account form Token
    const uuid = utils.uuid();
    const account = socket.decoded_token.account;

    if (!iomanager.ready) {
        socket.write({ error: 1002, messages: 'Service unavailable' });
        socket.disconnect(true);
        return;
    }

    iomanager.addSocket(uuid, account, socket);
    console.info(`Socket connected: ${uuid} (account: ${account})`);

    socket.on('disconnect', (reason) => {
        console.info(`Socket disconnected: ${uuid} [${reason}]`);
        iomanager.removeSocket(uuid, account, socket);
    });

    socket.on(constants.REQ_ACCOUNT_INFO, (data) => {
        if (utils.IsValid(data, Schemas.schemaAccountInfo)) {
            iomanager.initializeSocket(uuid, account);
            logger.info(
                constants.REQ_ACCOUNT_INFO +
                    ' - ' +
                    JSON.stringify(data) +
                    ' account - ' +
                    account
            );
            let wrapper = new messages.RequestWrapper();
            let request = new messages.AccountInfoRequest();

            request.setRequestid(data.request_id);
            request.setAccount(socket.request.user);
            wrapper.setType(
                messages.RequestWrapper.RequestType.REQ_ACCOUNT_INFO
            );
            wrapper.setData(request.serializeBinary());
            let binary_data = Buffer.from(wrapper.serializeBinary());

            zmq.send(binary_data);
        } else {
            socket.write({
                error: 1001,
                message: 'Incorrect data format',
            });
        }
    });

    socket.on(constants.REQ_ORDER_CREATE, (data) => {
        if (utils.IsValid(data, Schemas.schemaOrderMassStatus)) {
            logger.info(
                constants.REQ_ORDER_CREATE +
                    ' - ' +
                    JSON.stringify(data) +
                    ' account - ' +
                    account
            );
            let wrapper = new messages.RequestWrapper();
            let request = new messages.OrderMassStatusRequest();

            request.setAccount(socket.request.user);
            request.setAccount(data.request_id);
            request.setSymbol(data.symbol);
            wrapper.setType(
                messages.RequestWrapper.RequestType.REQ_ORDER_MASS_STATUS
            );
            wrapper.setData(request.serializeBinary());
            let binary_data = wrapper.serializeBinary();

            zmq.send(binary_data);
        } else {
            socket.write({
                error: 1001,
                message: 'Incorrect data format',
            });
        }
    });

    socket.on(constants.REQ_ORDER_MODIFY, (data) => {
        if (utils.IsValid(data, Schemas.schemaOrderModify)) {
        } else {
            socket.write({
                error: 1001,
                message: 'Incorrect data format',
            });
        }
    });

    socket.on(constants.REQ_ORDER_CANCEL, (data) => {});

    socket.on(constants.REQ_ORDER_MASS_CANCEL, (data) => {});

    socket.on(constants.REQ_ORDER_MASS_STATUS, (data) => {});

    socket.on(constants.REQ_POSITION_MODIFY, (data) => {});

    socket.on(constants.REQ_POSITION_CLOSEBY, (data) => {});

    socket.on(constants.REQ_POSITION_MASS_STATUS, (data) => {});
});

server.listen(config.ws.port, config.ws.host, () => {
    console.info(
        'WebSocket server is running on ws://%s:%s',
        config.ws.host,
        config.ws.port
    );
});

module.exports = io;
