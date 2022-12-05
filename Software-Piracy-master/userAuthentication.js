require("es6-promise").polyfill();
require("isomorphic-fetch");
var value;
var obj = {
  ainvyiAddress: "0x229F0997B13c726ec3711911cd65c64D2d21773B",
  authenticate(request, response) {
    var userAddress = request.body.address;
    console.log(userAddress);
    fetch(
      "http://ropsten.etherscan.io/api?module=account&action=txlist&address=" +
        request.body.address +
        "&startblock=0&endblock=latest&sort=dsc&apikey=CHDR8J5WRHST5ERICFH4T5TDR4NAFXSDEZ"
    )
      .then(function(data) {
        if (data.status >= 400) {
          throw new Error("Bad response from server");
        }
        return data.json();
      })
      .then(function(txlist) {
        console.log(txlist.result);
        var vendorAddress = "0x229F0997B13c726ec3711911cd65c64D2d21773B";
        for (tx of txlist.result) {
          if (tx.from === vendorAddress && tx.to === userAddress) {
            console.log("Status", tx.txreceipt_status);
            value = tx.txreceipt_status;
            //  response.writeHead(200, { "Content-Type": "text/html" });
            //response.sendFile("./views/hello.html", { root: __dirname });
            response.render("hello", { user: "click here" });
            break;
          }
        }
      });
  }
};

module.exports = obj;
