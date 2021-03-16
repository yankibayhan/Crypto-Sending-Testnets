
// Libraries to use
var bitcore = require('bitcore-lib');

// Using axios to import sochain api
var axios = require('axios');

// Using web3 for Ethereum testnet

const Web3 = require('web3');
const web3 = new Web3('HTTP://127.0.0.1:7545') // to connect to our development blockchain

// Provider for HDWALLET ETH

const Provider = require('@truffle/hdwallet-provider');

// Implementing smart contract

// const MyContract = require('./contracts/')

// Fork Ethereum Account from Ganache

// Eth Account Checking
// const account = web3.eth.getAccounts().then(console.log);
// const block = web3.eth.getBlockNumber().then(console.log);
// const nodeInfo = web3.eth.getNodeInfo().then(console.log);

// const eth_balance = web3.eth.getBalance("0xc6dBd350B74D608DF830574b07F7531cfd785188").then(console.log);


// SEND BTC
const sendBitcoin = async (recieverAddress, amountToSend) => {
    const sochain_network = "BTCTEST";
    const privateKey = "92zxU1Sz8feY5pswsfEyrZyyH6o7T9tHgBhWY3VUrCDV9ynbZSo";
    const sourceAddress = "mySLuwi58jC2r1yXtbuehUWwY9Ta71A8bh";
    const satoshiToSend = amountToSend * 100000000;
    let fee = 0;
    let inputCount = 0;
    let outputCount = 2;
    const utxos = await axios.get(
      `https://sochain.com/api/v2/get_tx_unspent/${sochain_network}/${sourceAddress}`
    );
    const transaction = new bitcore.Transaction();
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
  
    transactionSize = inputCount * 146 + outputCount * 34 + 10 - inputCount;
    // Check if we have enough funds to cover the transaction and the fees assuming we want to pay 20 satoshis per byte
  
    fee = transactionSize * 20
    if (totalAmountAvailable - satoshiToSend - fee  < 0) {
      throw new Error("Balance is too low for this transaction");
    }
  
    //Set transaction input
    transaction.from(inputs);
  
    // set the recieving address and the amount to send
    transaction.to(recieverAddress, satoshiToSend);
  
    // Set change address - Address to receive the left over funds after transfer
    transaction.change(sourceAddress);
  
    //manually set transaction fees: 20 satoshis per byte
    transaction.fee(fee * 20);
  
    // Sign transaction with your private key
    transaction.sign(privateKey);
  
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

var sent_amount = 0;

function _sentAmount(sent_price){

    return sent_amount = sent_price;


  }

// Send ETH
const sendEthereum = async (eth_reciever_adress, eth_amountToSend) => {

    const eth_source_address = '0xc6dBd350B74D608DF830574b07F7531cfd785188'; // Source ETH address
    const eth_private_key = '3e6033b2e04d48d63e6e88a8d89934e32c9f3051b3084c112259fbe8218315cb'; // to sign transactions
    
    
    

    // Transaction Creation

    const deploy = async () => {

      console.log(`Sending a transaction from ${eth_source_address} to ${eth_reciever_adress}`)
    }

    const createTransaction = await web3.eth.accounts.signTransaction({

      from: eth_source_address,
      to : eth_reciever_adress,
      value : web3.utils.toWei(_sentAmount(eth_amountToSend).toString(),'ether'),
      gas: 21000,
    },
    eth_private_key
    )

    // Deploy transaction

    const receipt = await web3.eth.sendSignedTransaction(createTransaction.rawTransaction);
    console.log(`Transtaction successful with hash: ${receipt.transactionHash}`)

    deploy();

}

sendEthereum('0x92D1FBadAFE874F923c32fec691De5Ec6feDB1E6', 10 );
// sendBitcoin('mhxWPpVvNePdVXqXwmY5PZrTSpUW7BGAZe', 0.0001);