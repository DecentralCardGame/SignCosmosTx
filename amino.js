'use strict';

const Codec = require("./codec.js");
const Sha256 = require("sha256");
const Config = require('./config');
const R_Cosmos = require('./tx');

/**
 * 处理amino编码（目前支持序列化）
 *
 */
class Amino {
    constructor() {
        this._keyMap = {};
    }

    /**
     */

    GetRegisterInfo(key) {
        let info = this._keyMap[key];
        if (info === undefined) {
            throw new Error("not Registered");
        }
        return info
    }

    /**
     * 注册amino类型
     *
     * @param class field的类型
     * @param key amino前缀
     */
    RegisterConcrete(type, key) {

        this._keyMap[key] = {
            prefix: this._aminoPrefix(key),
            classType: type
        }
    }

    /**
     * 给消息加上amino前缀
     *
     * @param key amino前缀
     * @param message 编码msg
     * @returns { Array }
     */
    MarshalBinary(key, message) {
        let prefixBytes = this._keyMap[key].prefix;
        prefixBytes = Buffer.from(prefixBytes.concat(message.length));
        prefixBytes = Buffer.concat([prefixBytes, message]);
        return prefixBytes
    }

    MarshalJSON(key, message) {
        let pair = {
            "type": key,
            "value": message
        };
        return pair
    }

    _aminoPrefix(name) {
        let a = Sha256(name);
        let b = Codec.Hex.hexToBytes(a);
        while (b[0] === 0) {
            b = b.slice(1, b.length - 1)
        }
        b = b.slice(3, b.length - 1);
        while (b[0] === 0) {
            b = b.slice(1, b.length - 1)
        }
        b = b.slice(0, 4);//注意和go-amino v0.6.2以前的不一样
        return b
    }
}

let amino = new Amino();
amino.RegisterConcrete(null, Config.amino.pubKey);
amino.RegisterConcrete(null, Config.amino.signature);

amino.RegisterConcrete(R_Cosmos.MsgDelegate, Config.tx.delegate.prefix);
amino.RegisterConcrete(R_Cosmos.MsgSend, Config.tx.transfer.prefix);
amino.RegisterConcrete(R_Cosmos.MsgSetWithdrawAddress, Config.tx.setWithdrawAddress.prefix);
amino.RegisterConcrete(R_Cosmos.MsgWithdrawDelegatorReward, Config.tx.withdrawDelegatorReward.prefix);
amino.RegisterConcrete(R_Cosmos.MsgWithdrawValidatorCommission, Config.tx.withdrawValidatorCommission.prefix);
amino.RegisterConcrete(R_Cosmos.MsgUndelegate, Config.tx.undelegate.prefix);
amino.RegisterConcrete(R_Cosmos.MsgBeginRedelegate, Config.tx.beginRedelegate.prefix);
amino.RegisterConcrete(R_Cosmos.StdTx, Config.tx.stdTx.prefix);

module.exports = amino;
