const cardanoWallet = require('cardano-wallet');
const bip39 = require('bip39');


const mnemonic = bip39.generateMnemonic();
console.log(mnemonic);


var myMnemonic = Buffer.from(mnemonic);
const PASSWORD = "1234";
 
// to connect the wallet to testtnet
var settings = cardanoWallet.BlockchainSettings.mainnet(); // This function will change into testnet
 
// recover the entropy
var entropy = cardanoWallet.Entropy.from_english_mnemonics(myMnemonic.toString());
// recover the wallet
var wallet = cardanoWallet.Bip44RootPrivateKey.recover(entropy, PASSWORD);
 
// create a wallet account
var account = wallet.bip44_account(cardanoWallet.AccountIndex.new(0 | 0x80000000));
var account_public = account.public();
 
// create an address
var chain_pub = account_public.bip44_chain(false);
var key_pub = chain_pub.address_key(cardanoWallet.AddressKeyIndex.new(0));
var address = key_pub.bootstrap_era_address(settings);
 
console.log("Your new generated ADA address is : ", address.to_base58());
console.log("Your Private Key is : ");


// Transaction Creation

const inputs = [
    { pointer: { id: "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef", index: 1 }, value: 1 },
    { pointer: { id: "fedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210", index: 0 }, value: 1 }
];
const outputs = [
    { address: "Ae2tdPwUPEZCEhYAUVU7evPfQCJjyuwM6n81x6hSjU9TBMSy2YwZEVydssL", value: "1826205" }
];

const fee_algorithm = cardanoWallet.LinearFeeAlgorithm.default();

var transaction_builder = new cardanoWallet.TransactionBuilder();

for (var index = 0; index < inputs.length; index++) {
    const pointer = cardanoWallet.TxoPointer.from_json(inputs[index].pointer);
    const value = cardanoWallet.Coin.from(inputs[index].value, 0);
    transaction_builder.add_input(pointer, value);
}

// verify the balance and the fees:
const balance = transaction_builder.get_balance(fee_algorithm);
if (balance.is_negative()) {
    console.error("not enough inputs, ", balance.value().to_str());
    throw Error("Not enough inputs");
} else {
    if (balance.is_zero()) {
    console.info("Perfect balance no dust");
    } else {
    console.warn("Loosing some coins in extra fees: ", balance.value().to_str());
    }
}

var transaction = transaction_builder.make_transaction();


// Signing Transaction

var transaction_finalizer = new cardanoWallet.TransactionFinalized(transaction);

for (var index = 0; index < inputs.length; index++) {
    const witness = cardanoWallet.Witness.new_extended_key(
        settings,
        key_prv,
        transaction_finalizer.id()
    );
    transaction_finalizer.add_witness(witness);
}

// Transaction Sending
const signed_transaction = transaction_finalizer.finalize();
console.log("ready to send transaction: ", signed_transaction.to_hex());
console.log(signed_transaction.to_json());
