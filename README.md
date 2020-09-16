# Project installation

1. git clone https://github.com/JustinTulloss/zeromq.node.git
2. Install npm dependencies
3. configure .env
4. run `npm start`

# Project url

API: <br> GET `/api/deals` <br> GET `/api/deals/:id` <br> GET `/api/symbols`

SOCKET client example:

`const socket2 = io('127.0.0.1:1000"', { path:"/data", transportOptions: { polling: { extraHeaders: { "Authorization": 'Bearer YOUR_JWT_TOKEN'} } }, });`
