const fs = require("fs");
const zmq = require("./zmq");
const http = require("http");
const socketio = require("socket.io");
const jwtAuth = require("socketio-jwt-auth");
const config = require("./config");

const constants = require("./core/constants");
const utils = require("./utils");
const iomanager = require("./utils/iomanager");
const messages = require("./messages/serialization_pb");

const Schemas = require("./core/validatorSchema");

const server = http.createServer();

let io = socketio(server, {
  path: config.ws.path,
});

let account = null;
const publicKey = fs.readFileSync(config.jwt.secret, "utf8");

io.sockets.use(
  jwtAuth.authenticate(
    {
      secret: publicKey,
      algorithm: "RS256",
    },
    function (payload, done) {
      if (payload && payload.account) {
        return done(null, account);
      } else {
        return done();
      }
    }
  )
);

io.sockets.on("connect", (socket) => {
  //socket.request.user - account form Token
  const uuid = utils.uuid();
  const account = socket.request.user;

  if (!iomanager.ready) {
    socket.disconnect(true);
    return;
  }

  iomanager.addSocket(uuid, account, socket);
  console.info(`Socket connected: ${uuid} (account: ${account})`);

  socket.on("disconnect", (reason) => {
    console.info(`Socket disconnected: ${uuid} [${reason}]`);
    iomanager.removeSocket(uuid, account, socket);
  });

  socket.on(constants.REQ_ACCOUNT_INFO, (data) => {
    if (utils.IsValid(data, Schemas.schemaAccountInfo)) {
      iomanager.initializeSocket(uuid, account);

      let wrapper = new messages.RequestWrapper();
      let request = new messages.AccountInfoRequest();

      request.setRequestid(data.request_id);
      request.setAccount(socket.request.user);
      wrapper.setType(messages.RequestWrapper.RequestType.REQ_ACCOUNT_INFO);
      wrapper.setData(request.serializeBinary());
      let binary_data = wrapper.serializeBinary();

      zmq.send(binary_data);
    } else {
      console.info(`error valid data`);
    }
  });

  socket.on(constants.REQ_ORDER_CREATE, (data) => {
    if (utils.IsValid(data, Schemas.schemaOrderMassStatus)) {
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
      console.info(`error valid data`);
    }
  });

  socket.on(constants.REQ_ORDER_MODIFY, (data) => {
    if (utils.IsValid(data, Schemas.schemaOrderModify)) {
    } else {
      console.info(`error valid data`);
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
    "WebSocket server is running on ws://%s:%s",
    config.ws.host,
    config.ws.port
  );
});

module.exports = io;
