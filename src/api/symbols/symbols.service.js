const db = require("../../core/db");
const config = require("../../config");
class SymbolService {
  constructor() {}

  static async GetData(account) {
    let query =
      "SELECT s.Symbol, " +
      "s.CurrencyBase, " +
      "s.CurrencyProfit, " +
      "s.CurrencyMargin, " +
      "s.Digits, " +
      "s.VolumeMinExt / 100000000 AS VolumeMin, " +
      "s.VolumeMaxExt / 100000000 AS VolumeMax, " +
      "s.VolumeStepExt / 100000000 AS VolumeStep, " +
      "s.ContractSize " +
      "FROM mt5_symbols s " +
      "WHERE s.Path LIKE '" +
      config.db.SymbolGroup +
      "\\\\%' " +
      "AND s.CalcMode <> 64 " +
      "ORDER BY s.Symbol";

    console.log(query);
    return db.QueryDB(query);
  }
}

module.exports = SymbolService;
