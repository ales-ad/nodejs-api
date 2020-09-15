let Validator = require("jsonschema").Validator;
let v = new Validator();

exports.uuid = function () {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

exports.GetArrayData = function (Data) {
  let NewArray = Array();
  Data.map((_i) => {
    let arrayValue = new Array();
    Object.keys(_i).map((_keys) => {
      arrayValue.push(_i[_keys]);
    });
    NewArray.push(arrayValue);
  });

  return NewArray;
};

exports.IsValid = function (body, Schema) {
  return v.validate(body, Schema).valid;
};
