const DealsService = require('./deals.service');
const utils = require('../../utils');

let Schema = require('../../core/validatorSchema').schemaDeals;

exports.getFilter = async (req, res) => {
    let valid = utils.IsValid(req.query, Schema);
    if (valid) {
        const result = await DealsService.GetFilter(
            req.query,
            req.user.account
        );
        res.status(200).json(utils.GetArrayData(result));
    } else {
        res.status(400).send({
            error: 1001,
            messages: 'Incorrect data format',
        });
    }
};

exports.getOne = async (req, res) => {
    if (req.params.id) {
        const result = await DealsService.GetOne(
            req.params.id,
            req.user.account
        );
        res.status(200).json(utils.GetArrayData(result));
    } else {
        res.status(400).send({
            error: 1001,
            messages: 'Incorrect data format',
        });
    }
};
