const connection = require("./connection");

var Schema = connection.Schema;
var contractSchema = new Schema({
  email: { type: String, required: true, index: { unique: true } },
  byteCode: String,
  abi: Object,
  isDeployed: { type: Boolean, default: false },
  isValuesSet: { type: Boolean, default: false },
  contractAddress: { type: String, default: null },
  isValuesReceived: { type: Boolean, default: false },
  hid: { type: String, default: null },
  fid: { type: String, default: null }
});

var contractModel = connection.model("userContracts", contractSchema);

module.exports = contractModel;
