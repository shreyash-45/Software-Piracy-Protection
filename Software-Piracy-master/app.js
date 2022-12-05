const express = require("express");
const userAuth = require("./userAuthentication");
const bodyParser = require("body-parser");
const userOperations = require("./db/userOperations");
const ejs = require("ejs");
const fs = require("fs");
const jre = require("node-jre");
const contract = require("./deployContract");
const contractOperations = require("./db/contractOperations");
const app = express();
var contractt = require("./db/contractSchema.js");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

app.post("/authenticate", (request, response) => {
  //console.log("Request received is :", request.body.userInput);
  console.log("Request received is :", request.body);
  //userAuth.authenticate(request, response);
});

app.post("/register", (request, response) => {
  console.log("request is : ", request.body);
  var newUser = request.body;
  userOperations.createUser(newUser, response, result => {
    if (result == 1) {
      console.log(request.body.ethAddress);
      var contractData = contract.compile(request.body.ethAddress);
      contractData["email"] = request.body.email;
      contractOperations.saveAbiData(contractData);
    }
  });
});

app.post("/emailCheck", (request, response) => {
  console.log(request.body);
  userOperations.checkEmail(request.body.email, response);
});

app.post("/unDeployedContracts", (req, res) => {
  var query = { isDeployed: false };
  contractOperations.fetchContracts(query, res);
});

app.post("/withoutvalueContracts", (req, res) => {
  var query = { isValuesReceived: true, isValuesSet: false };
  contractOperations.fetchContracts(query, res);
});

/*app.post("/contractData", (req, res) => {
  // console.log(req);
  contractOperations.findAbiData("ayu0070@gmail.com", res);
});*/

app.post("/contractAddress", (req, res) => {
  console.log(
    "contractAddress-->> " +
      req.body.email +
      req.body.contractAddress +
      JSON.stringify(req.body)
  );
  var updates = {
    contractAddress: req.body.contractAddress,
    isDeployed: true
  };
  contractOperations.updateData(req.body.email, updates, response => {
    if (response == 1) {
      res.send("Contract registered...");
    } else res.status(500).send("Some error occurred");
  });
});

app.post("/contractValuesSet", (req, res) => {
  var updates = {
    isValuesSet: true
  };
  contractOperations.updateData(req.body.email, updates, response => {
    if (response == 1) {
      res.send("Contract updated...");
    } else res.status(500).send("Some error occurred");
  });
});

app.post("/loginClient", (req, res) => {
  var email = req.body.email;
  var password = req.body.password;
  var HID = req.body.HID;
  console.log(`\nEmail: ${email}\nPassword: ${password}\nHID: ${HID}`);

  //verify user from database
  userOperations.verifyUser(
    { email: email, password: password },
    res,
    result => {
      if (result == 200) {
        //check from database and then:
        var valid = "Yes"; // Yes for valid and No for invalid.
        //after deployment of contract (done during registration)...
        var mmAddress;
        var contractAddress;
        userOperations.fetchEthAddress(email, (status, value) => {
          if (status == 200) {
            mmAddress = value;

            contractOperations.fetchContractAddress(email, (status, value) => {
              if (status == 200) {
                // if (!value.isValuesSet) {
                if (value.isDeployed) {
                  contractAddress = value.contractAddress;

                  /*creating user specific file*/
                  var fileName = "user" + email + ".ini";
                  fs.writeFileSync(
                    "./public/" + fileName,
                    mmAddress + "\r\n" + contractAddress
                  );
                  console.log("file successfully created.");
                  var files = ["./public/" + fileName]; //, "./public/SnakeGame.exe"];

                  //creating FID...
                  var FID = jre
                    .spawnSync(
                      // call synchronously
                      ["java"], // add the relative directory 'java' to the class-path
                      "FID", // call main routine in class 'FID'
                      files, // pass files as parameters
                      { encoding: "utf8" } // encode output as string
                    )
                    .stdout.trim(); // take output from stdout as trimmed String
                  console.log("FID: " + FID);

                  //set HID and FID in the contract here...
                  var updates = {
                    hid: HID,
                    fid: FID,
                    isValuesReceived: true
                  };
                  contractOperations.updateData(email, updates, response => {
                    if (response == 1) {
                      console.log("user hid,fid updated in db");
                      res.status(200).send({ message: "User authenticated" });
                    } else {
                      console.log("user hid not updated ");
                      res.status(500).send({
                        message: "some error occured while authenticating..."
                      });
                    }
                  });
                } else {
                  res.status(501).send({
                    message: "Work in progrss.Try later..."
                  });
                }
                /* } else {
                  res.status(500).send({
                    message: "Redundant installation attempt..."
                  });
                }*/
                //////////////////////////////
              } else {
                console.log("some error occured...");
                res.status(500).send({
                  message: "some error occured while authenticating..."
                });
              }
            });
          } else {
            console.log("some error occured...");
            res
              .status(500)
              .send({ message: "some error occured while authenticating..." });
          }
        });
      }
    }
  );
});

app.post("/setupComplete", (req, res) => {
  //delete the
  var fileName = "user" + req.body.email + ".ini";
  console.log(req.body.id);
  if (req.body.id != "bsakfo13431fsa") return;
  var file = "./public/" + fileName;
  fs.unlink(file, err => {
    if (err) console.log("Failed to delete file..." + fileName);
    else console.log("Installation finished.");
  });
});

app.post("/getfid", async(req, res) => {
  //delete the
  var contractadd=req.body.contractadd
  
  abc=await contractt.findOne({contractAddress:contractadd})
  console.log(abc.hid);
  res.status(200).send({ hid: abc.hid,fid:abc.fid });
});

// edwin ka code khatam

app.listen(1234, function() {
  console.log("Server started...");
});
