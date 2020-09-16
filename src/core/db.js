const { Client } = require('pg');
const config = require('../config');

let client = new Client({
    host: config.db.host,
    user: config.db.login,
    password: config.db.password,
    database: config.db.name,
});
client.connect();

var ser = function (query) {
    return new Promise(function (resolve, reject) {
        client.query(query, function (err, result) {
            var res = true;
            if (err) {
                var res = [];
            } else {
                if (result.rowCount > 0) {
                    return resolve(result.rows);
                } else {
                    res = [];
                }
            }
            return resolve(res);
        });
    });
};

exports.QueryDB = ser;
