exports.schemaDeals = {
    id: '/schemaDeals',
    type: 'object',
    properties: {
        symbol: { type: 'string' },
        order: { type: 'integer', minimum: 1 },
        start: { type: 'string' },
        end: { type: 'string' },
        offset: { type: 'integer' },
        limit: { type: 'integer' },
        sort: { type: ['string'], enum: ['1', '-1'] },
    },
};

exports.schemaAccountInfo = {
    id: '/AccountInfo',
    type: 'object',
    properties: {
        request_id: { type: 'number' },
    },
    required: ['request_id'],
};

exports.schemaOrderMassStatus = {
    id: '/OrderMassStatus',
    type: 'object',
    properties: {
        request_id: { type: 'integer' },
        symbol: { type: 'string' },
    },
    required: ['request_id', 'symbol'],
};

exports.schemaOrderModify = {
    id: '/AccountInfo',
    type: 'object',
    properties: {
        request_id: { type: 'integer' },
        order_id: { type: 'integer' },
        price: { type: 'float' },
        price_trigger: { type: 'float' },
        price_sl: { type: 'float' },
        price_tp: { type: 'float' },
        expiration_time: { type: 'string' },
        side: { type: 'string', enum: ['buy', 'sell'] },
        type: {
            type: 'string',
            enum: ['market', 'limit', 'stop', 'stoplimit'],
        },
        tif: { type: 'string', enum: ['gtd', 'ioc', 'fok', 'gtd'] },
        symbol: { type: 'string' },
        comment: { type: 'string', maxLength: 32 },
    },
    required: ['request_id', 'symbol'],
};
