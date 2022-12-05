const solc = require("solc");
const fs = require("fs");

var contract = {
  contractName: ":UserContract",
  compile: function(userAddress) {
    const input = fs.readFileSync("./UserContract.sol");
    var initialContract = input.toString();
    var re = /0x00000000000000000000000000000000000000000/gi;
    var usercontract = initialContract.replace(re, userAddress);
    console.log(usercontract);
    const output = solc.compile(usercontract, 1);
    if (!output.contracts[this.contractName]) {
      console.log("Contract must have same name as file!");
      process.exit(1);
    }
    console.log("output--->" + output);
    const bytecodeValue = output.contracts[this.contractName].bytecode;
    const abiValue = JSON.parse(output.contracts[this.contractName].interface);
    console.log(
      "abi before parse--->" + output.contracts[this.contractName].interface
    );
    console.log("bytecode--->" + bytecodeValue);

    var contractData = {
      byteCode: bytecodeValue,
      abi: abiValue
    };
    return contractData;
  }
};

module.exports = contract;
