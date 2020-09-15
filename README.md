# Project installation

1. git clone
   https://github.com/JustinTulloss/zeromq.node.gitJustinTulloss/zeromq.nodehttps://github.com
2. Install npm dependencies
3. configure .env
4. run `npm start`

# Project url

API: <br> GET `/api/deals` <br> GET `/api/deals/:id` <br> GET `/api/symbols`

SOCKET client example:

`let socket2 = io("127.0.0.1:1111",{ path:"/data", query: 'auth_token='+your_jwt })`
