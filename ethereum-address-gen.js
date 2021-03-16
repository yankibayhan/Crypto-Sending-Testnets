const { default: hdkey } = require('ethereumjs-wallet/dist/hdkey');
const Wallet= require('ethereumjs-wallet');
const BIP39 = require('bip39');
const web3 = require('web3');


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



console.log(generatePrivKey("floor blue drive dress nest eager pass behave average comfort warm other").toString('hex'));


