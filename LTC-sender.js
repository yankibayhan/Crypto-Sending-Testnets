const litecore = require('litecore-lib');


// LTC ADDRESS GENERATOR
var privateKey = new litecore.PrivateKey('testnet'); //for Testnet
var address = privateKey.toAddress();


console.log("Generated Testnet LTC Address : " + address.toString());
console.log("Generated Testnet LTC PrivateKey : " + privateKey.toString());



// Send LTC 
const sendLTC = async (ltc_reciever, ltc_amountToSend) => {

    const sochain_network = "LTCTEST";
      const ltc_privateKey = "7feae43e44863c5cb64b05f8052527752a599b3c1c4a37e8dcd39bf990f35fa3";
      const ltc_sourceAddress = "muNcpiUHxiuTrRsuW7rnuqMyaT7Y5SMcPE";
      const liteToSend = ltc_amountToSend * 100000000;
      let fee = 0;
      let inputCount = 0;
      let outputCount = 2;
      const utxos = await axios.get(
        `https://sochain.com/api/v2/get_tx_unspent/${sochain_network}/${sourceAddress}`
      );
      const transaction = new litecore.Transaction();
      let totalAmountAvailable = 0;
    
      let inputs = [];
      utxos.data.data.txs.forEach(async (element) => {
        let utxo = {};
        utxo.satoshis = Math.floor(Number(element.value) * 100000000);
        utxo.script = element.script_hex;
        utxo.address = utxos.data.data.address;
        utxo.txId = element.txid;
        utxo.outputIndex = element.output_no;
        totalAmountAvailable += utxo.satoshis;
        inputCount += 1;
        inputs.push(utxo);
      });
    
      if (totalAmountAvailable - liteToSend - fee  < 0) {
        throw new Error("Balance is too low for this transaction");
      }
    
      //Set transaction input
      transaction.from(inputs);
    
      // set the recieving address and the amount to send
      transaction.to(ltc_reciever, liteToSend);
    
      // Set change address - Address to receive the left over funds after transfer
      transaction.change(ltc_sourceAddress);
    
      //Litecoin transaction fees: 2 satoshis per byte
      transaction.fee(fee * 2);
    
      // Sign transaction with your private key
      transaction.sign(ltc_privateKey);
    
      // serialize Transactions
      const serializedTransaction = transaction.serialize();
      // Send transaction
      const result = await axios({
        method: "POST",
        url: `https://sochain.com/api/v2/send_tx/${sochain_network}`,
        data: {
          tx_hex: serializedTransaction,
        },
      });
      return result.data.data;
    };

// LTC Sender Init

// sendLTC('n28CWww8GCm5gQszt77RDKDmomkh48yAS7', 2);


