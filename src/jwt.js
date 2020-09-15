const jwt = require('jsonwebtoken');
const fs = require('fs');
var privateKEY = fs.readFileSync('./key/private.key', 'utf8');
var publicKEY = fs.readFileSync('./key/public.key', 'utf8');

var payload = {
    account: 1,
};
var i = 'ternionex';
var a = 'ternionex';
var signOptions = {
    issuer: i,
    audience: a,
    expiresIn: '1000h',
    algorithm: 'RS256', // RSASSA [ "RS256", "RS384", "RS512" ]
};
var token = jwt.sign(payload, privateKEY, signOptions);
console.log('Token :' + token);
var verifyOptions = {
    algorithm: ['RS256'],
};
//var legit = jwt.verify(token, publicKEY, verifyOptions);
var legit = jwt.verify(token, publicKEY, verifyOptions, (err, decoded) => {
    console.log;
    if (err) {
        return false;
    }
    return decoded;
});

console.log('\nJWT verification result: ' + JSON.stringify(legit));
