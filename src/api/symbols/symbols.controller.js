const SymbolService = require("./symbols.service");
const utils = require("../../utils");

exports.getData = async (req, res) => {
  const result = await SymbolService.GetData(req.user.account);
  res.status(200).json(utils.GetArrayData(result));
};
