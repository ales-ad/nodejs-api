const { Client } = require('pg');
const config = require('./config');

let client = new Client({
    host: config.DB.HOST,
    user: config.DB.LOGIN,
    password: config.DB.PASSWORD,
    database: config.DB.NAME,
});
client.connect();

var ser = function (value) {
    var query = 'SELECT * FROM currencies';
    return new Promise(function (resolve, reject) {
        client.query(query, function (err, result) {
            var res = true;
            if (err) {
                var res = false;
            } else {
                if (result.rowCount > 0) {
                    return resolve(result.rows);
                } else {
                    res = false;
                }
            }

            return resolve(res);
        });
    });
};

ser(1).then(function (result) {
    console.log(result);
});
