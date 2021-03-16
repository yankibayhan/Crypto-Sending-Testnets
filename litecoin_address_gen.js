const litecore = require('litecore-lib');

var privateKey = new litecore.PrivateKey('testnet'); //for Testnet
var address = privateKey.toAddress();


console.log("Generated Testnet LTC Address : " + address.toString());
console.log("Generated Testnet LTC PrivateKey : " + privateKey.toString());


