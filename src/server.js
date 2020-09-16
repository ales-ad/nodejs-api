const config = require('./config');
const app = require('./app');
require('./io');

app.listen(config.http.port, config.http.host, () => {
    console.info(
        'HTTP server is running: http://%s:%s',
        config.http.host,
        config.http.port
    );
});
