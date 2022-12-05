pragma solidity ^0.4.0;
contract UserContract {
string HID;
string fileHash;
address owner;
address user;

modifier vendorOnly() {
require(msg.sender==owner);
_;
}

modifier userOnly() {
require(msg.sender==user);
_;
}

function setHID(string h) public vendorOnly {
 HID = h;
}

function setSoftwareHash(string s) public vendorOnly {
fileHash = s;
}

function UserContract() public {
owner = msg.sender;
user = 0x00000000000000000000000000000000000000000;
}

function getHID() public userOnly constant returns(string) {
return HID;
}
function getSoftwareHash() public userOnly constant returns(string) {
return fileHash;
}

}