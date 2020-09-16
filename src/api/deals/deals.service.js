const db = require('../../core/db');
class DealsService {
    constructor() {}

    static async GetFilter(param, account) {
        let limit = !param.limit ? 1000 : param.limit;
        let offset = !param.offset ? 0 : param.offset;
        let sort = !param.sort ? 1 : param.sort;

        let query =
            'SELECT DISTINCT d.Deal,' +
            ' d.Login, ' +
            ' d.Order, ' +
            ' d.Action, ' +
            ' d.Entry, ' +
            ' d.Symbol, ' +
            ' d.VolumeExt / 100000000 as Volume, ' +
            ' d.Price, ' +
            ' d.Storage, ' +
            ' d.Commission, ' +
            ' d.Profit, ' +
            ' d.Comment, ' +
            ' d.TimeMsc, ' +
            ' d.ApiData ' +
            ' FROM mt5_deals d' +
            ' LEFT JOIN mt5_symbols s ON s.Symbol = d.Symbol ' +
            ' WHERE d.Login =' +
            account +
            ' AND s.CalcMode <> 64 ' +
            (param.symbol
                ? " AND lower(d.Symbol) = lower('" + param.symbol + "')"
                : '') +
            (param.order ? ' AND d.Order = ' + param.order : '') +
            (param.start ? ' AND d.TimeMsc >= ' + param.start : '') +
            (param.end ? ' AND d.TimeMsc <= ' + param.end : '') +
            (sort > 0 ? ' ORDER BY d.Deal ' : 'ORDER BY d.Deal DESC ') +
            ' LIMIT ' +
            limit +
            ' OFFSET ' +
            offset;

        return db.QueryDB(query);
    }

    static async GetOne(id, account) {
        let query =
            'SELECT DISTINCT d.Deal,' +
            ' d.Login, ' +
            ' d.Order, ' +
            ' d.Action, ' +
            ' d.Entry, ' +
            ' d.Symbol, ' +
            ' d.VolumeExt / 100000000 as Volume, ' +
            ' d.Price, ' +
            ' d.Storage, ' +
            ' d.Commission, ' +
            ' d.Profit, ' +
            ' d.Comment, ' +
            ' d.TimeMsc, ' +
            ' d.ApiData ' +
            ' FROM mt5_deals d' +
            ' LEFT JOIN mt5_symbols s ON s.Symbol = d.Symbol ' +
            '  WHERE d.Login =' +
            account +
            ' AND s.CalcMode <> 64 ' +
            ' AND d.Deal =' +
            id;

        return db.QueryDB(query);
    }
}

module.exports = DealsService;
