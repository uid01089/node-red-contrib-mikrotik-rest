"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MikroTikRest = void 0;
require("node-fetch");
const fetch = require("node-fetch");
//see https://github.com/gluap/pyess/blob/master/pyess/constants.py
class MikroTikRest {
    constructor(addr, user, passwd) {
        this.addr = addr;
        this.passwd = passwd;
        this.user = user;
    }
    static getData(batch, measurement, parameter) {
        let returnValue = undefined;
        for (const element of batch) {
            if (element.measurement === measurement) {
                const fields = element.fields;
                returnValue = fields[parameter];
                break;
            }
        }
        return returnValue;
    }
    readTraffic(interfaces) {
        return __awaiter(this, void 0, void 0, function* () {
            process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
            try {
                let mikrotikTraffics = [];
                const response = yield fetch(`https://${this.addr}/rest/interface/monitor-traffic`, {
                    method: 'POST',
                    body: JSON.stringify({ "interface": interfaces, "duration": "330s", "once": "" }),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Basic ' + Buffer.from(`${this.user}:${this.passwd}`).toString('base64')
                    }
                });
                const myJson = yield response.json();
                //const myJsonString = JSON.stringify(myJson);
                for (const interfaze of myJson) {
                    const traffic = {
                        rxBitsPerSec: parseInt(interfaze['rx-bits-per-second']),
                        txBitsPerSec: parseInt(interfaze['tx-bits-per-second']),
                        name: interfaze['name']
                    };
                    mikrotikTraffics.push(traffic);
                }
                return mikrotikTraffics;
            }
            catch (e) {
                console.error(e);
            }
        });
    }
}
exports.MikroTikRest = MikroTikRest;
//# sourceMappingURL=MikroTikRest.js.map