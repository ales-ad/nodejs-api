require("dotenv").config();

const config = {
  app: {
    name: process.env.APP_NAME,
    environment: process.env.NODE_ENV,
  },
  ws: {
    host: process.env.WS_HOST,
    port: process.env.WS_PORT,
    path: process.env.WS_PATH,
  },
  http: {
    host: process.env.HTTP_HOST,
    port: process.env.HTTP_PORT,
  },
  zmq: {
    address: process.env.ZMQ_ADDRESS,
    identity: process.env.ZMQ_IDENTITY,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    issuer: process.env.JWT_ISSUER,
    audience: process.env.JWT_AUDIENCE,
  },
  db: {
    host: process.env.DB_HOST,
    name: process.env.DB_NAME,
    login: process.env.DB_LOGIN,
    password: process.env.DB_PASSWORD,
    SymbolGroup: process.env.SYMBOL_GROUP,
  },
};

module.exports = config;
