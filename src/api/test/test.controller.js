const TestService = require('./test.service');

exports.test = async (req, res) => {
        const result = await TestService.create();
        res.status(200).json(result);
}