const { default: hdkey } = require('ethereumjs-wallet/dist/hdkey');
const Wallet= require('ethereumjs-wallet');
const BIP39 = require('bip39');

// Using web3 for Ethereum testnet

const Web3 = require('web3');
const web3 = new Web3('HTTP://127.0.0.1:7545') // to connect to our development blockchain


// hd generation

function createMnemonic(){

    return BIP39.generateMnemonic();
}

// mnemonic to seed

function generateHexSeed(mnemonic){
    return BIP39.mnemonicToSeedSync(mnemonic);
}

function generatePrivKey(mnemonic){

    const seed = generateHexSeed(mnemonic)
    return hdkey.fromMasterSeed(seed).derivePath(`m/44'/60'/0'/0`).getWallet().getPrivateKey();
}

// Deriving public key from the private key

//  function derivePubKey(privKey){
//     const wallet = Wallet.fromPrivateKey(privKey);
//     return wallet.getPublicKey();
// } 


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

// ETH SENDER INIT
// sendEthereum('0x92D1FBadAFE874F923c32fec691De5Ec6feDB1E6', 10 );
