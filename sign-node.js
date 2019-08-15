const fs = require('fs')
const R = require('ramda')

const Bip39 = require('bip39');
const Base64 = require('base64-node');
const CosmosKeypair = require('./cosmoskeypair.js');
const Codec = require('./codec');



let chain_id = "testCardchain";
let mnemonic = 'glance where caution later core they property myself decline inside admit network distance volcano offer buyer impact water walnut gloom language awful solid frequent';
let account_number = 0;
let sequence = 6;




    function recover(secret, language) {
        let keyPair = CosmosKeypair.recover(secret,Bip39.wordlists.english);
        if (keyPair) {
            return encode({
                address: keyPair.address,
                phrase: secret,
                privateKey: keyPair.privateKey,
                publicKey: keyPair.publicKey
            });
        }
    }

    function encode(acc){
        /*if(!Utils.isEmpty(acc)){
            switch (Config.cosmos.defaultCoding){
                case Config.cosmos.coding.bech32:{
                    if (Codec.Hex.isHex(acc.address)){
                        acc.address =  Codec.Bech32.toBech32(Config.cosmos.bech32.accAddr, acc.address);
                    }
                    if (Codec.Hex.isHex(acc.publicKey)){
                        acc.publicKey = Codec.Bech32.toBech32(Config.cosmos.bech32.accPub, acc.publicKey);
                    }
                }
            }*/
            return acc
        //}
    }

let account = recover(mnemonic,'english');
let keypair = CosmosKeypair.import(account.privateKey);

console.log("privkey: ", account.privateKey)
//console.log("public hex: ", keypair.publicKey)
//console.log("private hex: ", keypair.privateKey)


/**
 * 签名交易数据
 *
 * @param data
 * @param privateKey
 * @returns {}
 */
function sign(data, privateKey) {
    if (typeof data === "string") {
        data = JSON.parse(data);
    }

    console.log("data: ", JSON.stringify(data))

    let signbyte = CosmosKeypair.sign(privateKey, data);
    let keypair = CosmosKeypair.import(privateKey);

    //console.log("signbyte: ", signbyte)

    return {
        pub_key:Codec.Hex.hexToBytes(keypair.publicKey),
        signature:signbyte
    }
}


OldMsgGetSignBytes = function (msg) {
  let sortMsg = sortObjectKeys(msg);
  return {
      "type": "cosmos-sdk/MsgSend",
      "value": sortMsg
  };
}

MsgGetSignBytes = function (msgs) {
  let sortedMsgs = [];
  msgs.forEach(function(msg) {
    let sortMsg = sortObjectKeys(msg.value);
    sortedMsgs.push({
        "type": msg.type,
        "value": sortMsg
    });
  });
  return sortedMsgs;
}

FeeGetSignBytes = function (fee){
    //if (isEmpty(fee.amount)) {
    //    fee.amount = [{amount:"1",denom:"credits"}]
    //}
    return {
        amount: fee.amount,
        gas: fee.gas
    }
};

function isEmpty(obj) {
    switch (typeof obj) {
        case "undefined": {
            return true
        }
        case "string": {
            return obj.length === 0
        }
        case "number": {
            return obj === 0
        }
        case "object": {
            if (obj == null) {
                return true
            } else if (Array.isArray(obj)) {
                return obj.length === 0
            } else {
                return Object.keys(obj).length === 0
            }
        }
    }
}

class StdSignMsg {
    constructor(chainID, accnum, sequence, fee, msg, memo) {
        this.chain_id = chainID;
        this.account_number = accnum;
        this.sequence = sequence;
        this.fee = fee;
        this.msgs = [msg];
        this.memo = memo;
    }

    OldGetSignBytes() {
        let msgs = [];
        this.msgs.forEach(function(msg) {
            msgs.push(OldMsgGetSignBytes(msg))
        });

        let tx = {
            account_number: this.account_number,
            chain_id: this.chain_id,
            fee: FeeGetSignBytes(this.fee),
            memo: this.memo,
            msgs: msgs,
            sequence: this.sequence
        };
        return sortObjectKeys(tx)
    }

    GetSignBytes() {
        let msgs = [];
        this.msgs.forEach(function(msg) {
            msgs.push(MsgGetSignBytes(msg))
        });

        let tx = {
            account_number: this.account_number,
            chain_id: this.chain_id,
            fee: FeeGetSignBytes(this.fee),
            memo: this.memo,
            msgs: msgs,
            sequence: this.sequence
        };
        return sortObjectKeys(tx)
    }

    ValidateBasic() {
        if (Utils.isEmpty(this.chain_id)) {
            throw new Error("chain_id is  empty");
        }
        if (this.account_number < 0) {
            throw new Error("account_number is  empty");
        }
        if (this.sequence < 0) {
            throw new Error("sequence is  empty");
        }
        this.msgs.forEach(function(msg) {
            msg.ValidateBasic();
        });
    }
}

function sortObjectKeys(obj) {
    let sort = function (obj) {
        let tmp = {};
        Object.keys(obj).sort().forEach(function (k) {
            if (Array.isArray(obj[k])) {
                let p = [];
                obj[k].forEach(function (item) {
                    if (item != null && typeof(item) === "object") {
                        p.push(sort(item));
                    } else {
                        p.push(item);
                    }
                });
                tmp[k] = p;
            } else if (obj[k] != null && typeof(obj[k]) === "object") {
                tmp[k] = sort(obj[k]);
            } else if (obj[k] != null && typeof(obj[k]) === "function") {
                tmp[k] = evil(obj[k].toString())
            } else {
                tmp[k] = new String(obj[k]).toString();
            }
        });
        return tmp;
    };
    return sort(obj)
}


function GetTxSignJSON(chain_id, account_number, sequence, msgs, memo, fee) {
    msgs = MsgGetSignBytes(msgs);

    let tx = {
        account_number: account_number,
        chain_id: chain_id,
        fee: fee, //FeeGetSignBytes(fee), // TODO check
        memo: memo,
        msgs: msgs,
        sequence: sequence
    };

    return sortObjectKeys(tx);
}


unsignedTx = {"type":"auth/StdTx","value":{"msg":[{"type":"cardservice/BuyCardScheme","value":{"Bid":{"denom":"credits","amount":"800"},"Buyer":"cosmos1n84hwcnmtl20dng2reruvwwdnv3nk5258qyjmn"}}],"fee":{"amount":[{"denom":"credits","amount":"1"}],"gas":"50544"},"signatures":null,"memo":""}};
//unsignedTx = {"type":"auth/StdTx","value":{"msg":[{"type":"cosmos-sdk/MsgSend","value":{"from_address":"cosmos1n84hwcnmtl20dng2reruvwwdnv3nk5258qyjmn","to_address":"cosmos1n84hwcnmtl20dng2reruvwwdnv3nk5258qyjmn","amount":[{"denom":"credits","amount":"1"}]}}],"fee":{"amount":[{"denom":"credits","amount":"1"}],"gas":"200000"},"signatures":null,"memo":""}}


function signTx(unsigned, chainId, account_number, sequence) {
  signStuff = GetTxSignJSON(chainId, account_number, sequence, unsigned.value.msg, unsigned.value.memo, unsigned.value.fee)

  signStuff.msgs = [signStuff.msgs[0].value]      // FOR MSGSEND THIS IS TO BE REMOVED; GOD KNOWS WHY


  console.log("msg bytes: ", Array.from(Buffer.from(JSON.stringify(signStuff.msgs))))

  let signature = sign(signStuff, account.privateKey);
  let signatures = {
      pub_key: {
        type: 'tendermint/PubKeySecp256k1',
        value: Base64.encode(signature.pub_key)
       },
      signature: Base64.encode(signature.signature)
  }

  console.log("stdTx: ", JSON.stringify(signStuff))
  console.log("signatures: ", signatures)


  var coreTx = {
          msg: MsgGetSignBytes(unsigned.value.msg),
          fee: signStuff.fee,
          signatures: [signatures],
          memo: signStuff.memo
      }
    /*
  var coreTx = {
    msg: MsgGetSignBytes(signStuff.msgs),
    fee: signStuff.fee,
    signatures: [signatures],
    memo: signStuff.memo
    }
    */

  //coreTx.msg[0].value = coreTx.msg[0].value[0]

  finalTx = {
    type:"auth/StdTx",
    value: coreTx
  };

  console.log("finalTx: ", JSON.stringify(finalTx))

  //console.log("key: ", finalTx.value.signatures)

  //fs.writeFileSync('./signedTx.json', JSON.stringify(finalTx), 'utf-8');
}

signTx(unsignedTx, chain_id, account_number, sequence)
