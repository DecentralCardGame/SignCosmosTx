
const Bip39 = require('bip39');
const Codec = require('./codec');
const CosmosKeypair = require('./cosmoskeypair.js');

let verbose = false;


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

//console.log("privkey: ", account.privateKey)
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

    //console.log("data: ", JSON.stringify(data))

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
    if (isEmpty(fee.amount)) {
        fee.amount = []
    }
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
      fee: FeeGetSignBytes(fee), // TODO check
      memo: memo,
      msgs: msgs,
      sequence: sequence
  };

  tx = sortObjectKeys(tx);

  tx.msgs.forEach(function(msg, idx) {
    switch(msg.type) {
      case "cardservice/SaveCardContent":
        msg.value.CardId = parseInt(msg.value.CardId);
        break;
      case "cardservice/DonateToCard":
        msg.value.CardId = parseInt(msg.value.CardId);
        break;
      case "cardservice/TransferCard":
        msg.value.CardId = parseInt(msg.value.CardId);
        break;
      case "cardservice/VoteCard":
        msg.value.CardId = parseInt(msg.value.CardId);
        break;
    }

    if(msg.type.indexOf('cardservice') >= 0) {
      tx.msgs[idx] = msg.value
    }
  })

  return tx;
}



function signTx(unsigned, mnemonic, chainId, account_number, sequence) {

  let account = recover(mnemonic,'english');
  let keypair = CosmosKeypair.import(account.privateKey);


  signStuff = GetTxSignJSON(chainId, account_number, sequence, unsigned.value.msg, unsigned.value.memo, unsigned.value.fee)



  let signature = sign(signStuff, account.privateKey);
  let signatures = {
      pub_key: {
        type: 'tendermint/PubKeySecp256k1',
        value: Buffer.from(signature.pub_key).toString('base64')
       },
      signature: Buffer.from(signature.signature).toString('base64')
  }

  //console.log("stdTx: ", JSON.stringify(signStuff))
  if(verbose) console.log("signatures: ", signatures)


  var coreTx = {
          msg: MsgGetSignBytes(unsigned.value.msg),
          fee: signStuff.fee,
          signatures: [signatures],
          memo: signStuff.memo
      }

  finalTx = {
    type:"auth/StdTx",
    value: coreTx
  };

  if(verbose) console.log("finalTx: ", JSON.stringify(finalTx))

  //console.log("key: ", finalTx.value.signatures)

  //fs.writeFileSync('./signedTx.json', JSON.stringify(finalTx), 'utf-8');

  return finalTx
}

//signTx(unsignedTx, chain_id, account_number, sequence);

module.exports.signTx = signTx;
