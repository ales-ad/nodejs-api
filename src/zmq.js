const zeromq = require('../zeromq.node');
let logger = require('./utils/logger');

const config = require('./config');
const iomanager = require('./utils/iomanager');
const messages = require('./messages/serialization_pb');
const constants = require('./core/constants');

function send(account, event, data) {
    const json = JSON.stringify(data);

    iomanager.getAccountSockets(account).forEach((socket) => {
        if (socket.initialized) {
            socket.socket.emit(event, json);
            logger.info(
                'MESSAGE: ' +
                    event +
                    ' socket - ' +
                    socket.uuid +
                    ' data - ' +
                    json
            );
            console.debug(`${socket.uuid} sent: ${json}`);
        }
    });
}

function getOrder(order) {
    return [
        order.getId(),
        order.getExternalid(),
        order.getPositionid(),
        order.getPositionbyid(),
        order.getSide(),
        order.getType(),
        order.getTimeinforce(),
        order.getStatus(),
        order.getVolumeremain(),
        order.getVolumeinitial(),
        order.getPrice(),
        order.getPricetrigger(),
        order.getPricesl(),
        order.getPricetp(),
        order.getExpirationtime(),
        order.getCreatetime(),
        order.getDigits(),
        order.getSymbol(),
        order.getComment(),
    ];
}

function getPosition(position) {
    return [
        position.getId(),
        position.getType(),
        position.getVolume(),
        position.getOpenprice(),
        position.getPricesl(),
        position.getPricetp(),
        position.getSwap(),
        position.getCreatetime(),
        position.getUpdatetime(),
        position.getDigits(),
        position.getSymbol(),
        position.getComment(),
    ];
}

function getDeal(deal) {
    return [
        deal.getId(),
        deal.getOrderid(),
        deal.getPositionid(),
        deal.getType(),
        deal.getDirection(),
        deal.getVolume(),
        deal.getPrice(),
        deal.getProfit(),
        deal.getSwap(),
        deal.getCommission(),
        deal.getFee(),
        deal.getCreatetime(),
        deal.getSymbol(),
        deal.getComment(),
    ];
}

function onOrderCreatedMessage(message) {
    let order = message.getOrder();
    let account = order.getAccount();

    send(account, constants.MSG_ORDER_CREATED, getOrder(order));
}

function onOrderUpdatedMessage(message) {
    let order = message.getOrder();
    let account = order.getAccount();

    send(account, constants.MSG_ORDER_UPDATED, getOrder(order));
}

function onOrderDeletedMessage(message) {
    let order = message.getOrder();
    let account = order.getAccount();

    send(account, constants.MSG_ORDER_DELETED, getOrder(order));
}

function onOrderMassStatusMessage(message) {
    let account = message.getAccount();
    let data = [
        message.getRequestid(),
        [
            message.getOrdersList().map((order) => {
                return getOrder(order);
            }),
        ],
    ];

    send(account, constants.MSG_ORDER_MASS_STATUS, data);
}

function onOrderCreateRejectedMessage(message) {
    let account = message.getAccount();
    let data = [message.getRequestid(), message.getCode()];

    send(account, constants.MSG_ORDER_CREATE_REJECTED, data);
}

function onOrderModifyRejectedMessage(message) {
    let account = message.getAccount();
    let data = [message.getRequestid(), message.getCode()];

    send(account, constants.MSG_ORDER_MODIFY_REJECTED, data);
}

function onOrderCancelRejectedMessage(message) {
    let account = message.getAccount();
    let data = [message.getRequestid(), message.getCode()];

    send(account, constants.MSG_ORDER_CANCEL_REJECTED, data);
}

function onPositionCreatedMessage(message) {
    let position = message.getPosition();
    let account = position.getAccount();

    send(account, constants.MSG_POSITION_CREATED, getPosition(position));
}

function onPositionUpdatedMessage(message) {
    let position = message.getPosition();
    let account = position.getAccount();

    send(account, constants.MSG_POSITION_UPDATED, getPosition(position));
}

function onPositionDeletedMessage(message) {
    let position = message.getPosition();
    let account = position.getAccount();

    send(account, constants.MSG_POSITION_DELETED, getPosition(position));
}

function onPositionMassStatusMessage(message) {
    let account = message.getAccount();
    let data = [
        message.getRequestid(),
        [
            message.getPositionsList().map((order) => {
                return getOrder(order);
            }),
        ],
    ];

    send(account, constants.MSG_POSITION_MASS_STATUS, data);
}

function onPositionModifyRejectedMessage(message) {
    let account = message.getAccount();
    let data = [message.getRequestid(), message.getCode()];

    send(account, constants.MSG_POSITION_MODIFY_REJECTED, data);
}

function onPositionCloseByRejectedMessage(message) {
    let account = message.getAccount();
    let data = [message.getRequestid(), message.getCode()];

    send(account, constants.MSG_POSITION_CLOSEBY_REJECTED, data);
}

function onDealCreatedMessage(message) {
    let deal = message.getDeal();
    let account = deal.getAccount();

    send(account, constants.MSG_DEAL_CREATED, getDeal(deal));
}

function onAccountInfoMessage(message) {
    let account = message.getAccount();

    let data = [
        message.getRequestid(),
        message.getStopoutlevel(),
        message.getMargincalllevel(),
        message.getLeverage(),
        message.getDigits(),
        message.getCurrency(),
        message.getBalancesList().map((balance) => {
            return [
                balance.getAmount(),
                balance.getCredit(),
                balance.getDigits(),
                balance.getCurrency(),
            ];
        }),
    ];

    send(account, constants.MSG_ACCOUNT_INFO, data);
}

function onAccountBalanceUpdatedMessage(message) {
    let account = message.getAccount();
    let balance = message.getBalance();
    let data = [
        balance.getAmount(),
        balance.getCredit(),
        balance.getDigits(),
        balance.getCurrency(),
    ];

    send(account, constants.MSG_ACCOUNT_BALANCE_UPDATED, data);
}

const zmq = zeromq.socket('dealer');
zmq.setsockopt(zeromq.ZMQ_LINGER, 0);
zmq.setsockopt(zeromq.ZMQ_RECONNECT_IVL_MAX, 1000);
zmq.setsockopt(zeromq.ZMQ_IDENTITY, Buffer.from(config.zmq.identity));

zmq.on('connect', function () {
    console.info('ZMQ connected');
    iomanager.ready = true;
});

zmq.on('disconnect', function (fd, ep) {
    console.warn('ZMQ disconnected');
    iomanager.ready = false;
    iomanager.getAllSockets().forEach((socket) => {
        if (socket.socket) socket.socket.disconnect();
    });
});

zmq.on('message', function (identity, msg) {
    let wrapper = messages.MessageWrapper.deserializeBinary(msg);
    let type = wrapper.getType();
    let data = wrapper.getData();

    logger.info('MESSAGE: ' + type);
    switch (type) {
        case messages.MessageWrapper.MessageType.MSG_ORDER_CREATED:
            onOrderCreatedMessage(
                messages.OrderCreatedMessage.deserializeBinary(data)
            );
            break;
        case messages.MessageWrapper.MessageType.MSG_ORDER_UPDATED:
            onOrderUpdatedMessage(
                messages.OrderUpdatedMessage.deserializeBinary(data)
            );
            break;
        case messages.MessageWrapper.MessageType.MSG_ORDER_DELETED:
            onOrderDeletedMessage(
                messages.OrderDeletedMessage.deserializeBinary(data)
            );
            break;
        case messages.MessageWrapper.MessageType.MSG_ORDER_MASS_STATUS:
            onOrderMassStatusMessage(
                messages.OrderMassStatusMessage.deserializeBinary(data)
            );
            break;
        case messages.MessageWrapper.MessageType.MSG_ORDER_CREATE_REJECTED:
            onOrderCreateRejectedMessage(
                messages.OrderCreateRejectedMessage.deserializeBinary(data)
            );
            break;
        case messages.MessageWrapper.MessageType.MSG_ORDER_MODIFY_REJECTED:
            onOrderModifyRejectedMessage(
                messages.OrderModifyRejectedMessage.deserializeBinary(data)
            );
            break;
        case messages.MessageWrapper.MessageType.MSG_ORDER_CANCEL_REJECTED:
            onOrderCancelRejectedMessage(
                messages.OrderCancelRejectedMessage.deserializeBinary(data)
            );
            break;
        case messages.MessageWrapper.MessageType.MSG_POSITION_CREATED:
            onPositionCreatedMessage(
                messages.PositionCreatedMessage.deserializeBinary(data)
            );
            break;
        case messages.MessageWrapper.MessageType.MSG_POSITION_UPDATED:
            onPositionUpdatedMessage(
                messages.PositionUpdatedMessage.deserializeBinary(data)
            );
            break;
        case messages.MessageWrapper.MessageType.MSG_POSITION_DELETED:
            onPositionDeletedMessage(
                messages.PositionDeletedMessage.deserializeBinary(data)
            );
            break;
        case messages.MessageWrapper.MessageType.MSG_POSITION_MASS_STATUS:
            onPositionMassStatusMessage(
                messages.PositionMassStatusMessage.deserializeBinary(data)
            );
            break;
        case messages.MessageWrapper.MessageType.MSG_POSITION_MODIFY_REJECTED:
            onPositionModifyRejectedMessage(
                messages.PositionModifyRejectedMessage.deserializeBinary(data)
            );
            break;
        case messages.MessageWrapper.MessageType.MSG_POSITION_CLOSEBY_REJECTED:
            onPositionCloseByRejectedMessage(
                messages.PositionCloseByRejectedMessage.deserializeBinary(data)
            );
            break;
        case messages.MessageWrapper.MessageType.MSG_DEAL_CREATED:
            onDealCreatedMessage(
                messages.DealCreatedMessage.deserializeBinary(data)
            );
            break;
        case messages.MessageWrapper.MessageType.MSG_ACCOUNT_INFO:
            onAccountInfoMessage(
                messages.AccountInfoMessage.deserializeBinary(data)
            );
            break;
        case messages.MessageWrapper.MessageType.MSG_ACCOUNT_BALANCE_UPDATED:
            onAccountBalanceUpdatedMessage(
                messages.AccountBalanceUpdatedMessage.deserializeBinary(data)
            );
            break;
    }
});

zmq.on('monitor_error', function (err) {
    console.log(
        'Error in monitoring: %s, will restart monitoring in 5 seconds',
        err
    );
    setTimeout(function () {
        zmq.monitor(500, 0);
    }, 5000);
});
zmq.monitor();

zmq.connect(`tcp://${config.zmq.address}`);

module.exports = zmq;
