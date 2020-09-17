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

exports.schemaOrderModify = {
    id: '/OrderModify',
    type: 'object',
    properties: {
        request_id: { type: 'number' },
        order_id: { type: 'number' },
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
        symbol: { type: 'string', maxLength: 32 },
        comment: { type: 'string', maxLength: 32 },
    },
    required: [
        'request_id',
        'order_id',
        'symbol',
        'price',
        'price_trigger',
        'price_sl',
        'price_tp',
        'expiration_time',
        'side',
        'tif',
        'type',
    ],
};

exports.schemaOrderCancel = {
    id: '/OrderCancel',
    type: 'object',
    properties: {
        request_id: { type: 'number' },
        order_id: { type: 'number' },
        side: { type: 'string', enum: ['buy', 'sell'] },
        type: {
            type: 'string',
            enum: ['market', 'limit', 'stop', 'stoplimit'],
        },
        symbol: { type: 'string', maxLength: 32 },
    },
    required: ['request_id', 'symbol', 'price', 'order_id', 'side', 'type'],
};

exports.schemaOrderCreate = {
    id: '/OrderCreate',
    type: 'object',
    properties: {
        external_id: { type: 'number' },
        position_id: { type: 'number' },
        volume: { type: 'float' },
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
        symbol: { type: 'string', maxLength: 32 },
        comment: { type: 'string', maxLength: 32 },
    },
    required: [
        'external_id',
        'position_id',
        'volume',
        'symbol',
        'price',
        'price_trigger',
        'price_sl',
        'price_tp',
        'expiration_time',
        'side',
        'tif',
        'type',
    ],
};

exports.schemaOrderMassStatus = {
    id: '/OrderMassStatus',
    type: 'object',
    properties: {
        request_id: { type: 'number' },
        symbol: { type: 'string', maxLength: 32 },
    },
    required: ['request_id', 'symbol'],
};

exports.schemaOrderMassCancel = {
    id: '/OrderMassCancel',
    type: 'object',
    properties: {
        request_id: { type: 'number' },
        symbol: { type: 'string', maxLength: 32 },
    },
    required: ['request_id', 'symbol'],
};

exports.schemaPositionCloseBy = {
    id: '/PositionCloseBy',
    type: 'object',
    properties: {
        request_id: { type: 'number' },
        position_id: { type: 'number' },
        positionby_id: { type: 'number' },
        symbol: { type: 'string', maxLength: 32 },
    },
    required: ['request_id', 'positionby_id', 'position_id', 'symbol'],
};

exports.schemaPositionModify = {
    id: '/PositionModify',
    type: 'object',
    properties: {
        request_id: { type: 'number' },
        position_id: { type: 'number' },
        price_sl: { type: 'float' },
        price_tp: { type: 'float' },
        symbol: { type: 'string', maxLength: 32 },
    },
    required: ['request_id', 'price_sl', 'price_tp', 'position_id', 'symbol'],
};

exports.schemaPositionMassStatus = {
    id: '/PositionMassStatus',
    type: 'object',
    properties: {
        request_id: { type: 'number' },
        symbol: { type: 'string', maxLength: 32 },
    },
    required: ['request_id', 'symbol'],
};
