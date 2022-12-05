var contract = require("./contractSchema.js");

var contractOperations = {
  saveAbiData: function(contractData) {
    let userContract = new contract(contractData);
    userContract.save((err, doc) => {
      if (err) {
        console.log(`Error while saving contract Details ${err.stack}`);
        if (err.name == "BulkWriteError") {
          console.log("--------------duplicate email id -------");
          console.log("User details alreday existsexists.");
        } else {
          console.log("some error occured while registering...");
        }
      } else {
        console.log(`Saved Contract Details.. :-) ${doc}`);
      }
    });
  },
  findAbiData: function(userEmail, response) {
    contract.findOne({ email: userEmail }, function(err, doc) {
      if (err) {
        console.log("some error!!" + err);
        response
          .status(500)
          .send({ message: "some error occured while fetching data..." });
      }

      if (doc && doc != null) {
        var AbiData = {
          abi: doc.abi,
          byteCode: doc.byteCode
        };
        response.status(200).send(AbiData);
      } else {
        console.log("user doesn't exist");
        response.status(401).send({
          message: "Invalid Email.You are not authorised."
        });
      }
    });
  },
  updateData: function(searchEmail, updates, response) {
    contract.findOneAndUpdate(
      { email: searchEmail },
      updates,
      { upsert: true, new: true },
      function(err, res) {
        if (err) {
          console.log("error while updating a contract details.." + err);
          return response(0);
        } else {
          console.log(res);
          return response(1);
        }
      }
    );
  },
  fetchContracts: function(query, response) {
    contract.find(query, function(err, doc) {
      if (err) {
        console.log("Some error occured while fetching data!" + err);
        response
          .status(500)
          .send({ message: "some error occured while fetching data..." });
      } else {
        console.log("success.." + doc);
        response.status(200).send(doc);
      }
    });
  },
  fetchContractAddress: function(emailId, result) {
    contract.findOne({ email: emailId }, function(err, data) {
      if (err) {
        console.log("Some Error--->" + err);
        result(500, "Error");
      }
      if (data && data != null) {
        result(200, data);
      } else {
        result(400, "user not found...");
      }
    });
  }
};

module.exports = contractOperations;
