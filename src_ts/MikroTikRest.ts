import "node-fetch"
import { InfluxDBBatchElement } from "./InfluxDBBatchElement";
import { MikrotikTraffic } from "./MikrotikTraffic";

const fetch = require("node-fetch");

//see https://github.com/gluap/pyess/blob/master/pyess/constants.py


class MikroTikRest {

    addr: string;
    passwd: string;
    user: string;

    constructor(addr: string, user: string, passwd: string) {
        this.addr = addr;
        this.passwd = passwd;
        this.user = user;

    }

    static getData(batch: InfluxDBBatchElement[], measurement: string, parameter: string): number {

        let returnValue: number = undefined;

        for (const element of batch) {
            if (element.measurement === measurement) {
                const fields = element.fields;
                returnValue = <number>fields[parameter];

                break;
            }
        }

        return returnValue;
    }




    async readTraffic(interfaces: string): Promise<MikrotikTraffic[]> {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
        try {

            let mikrotikTraffics: MikrotikTraffic[] = [];

            const response = await fetch(`https://${this.addr}/rest/interface/monitor-traffic`, {
                method: 'POST',
                body: JSON.stringify({ "interface": interfaces, "once": "" }), // string or object
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + Buffer.from(`${this.user}:${this.passwd}`).toString('base64')
                }
            });
            const myJson = await response.json();
            //const myJsonString = JSON.stringify(myJson);

            for (const interfaze of myJson) {
                const traffic: MikrotikTraffic = { //
                    rxBitsPerSec: parseInt(interfaze['rx-bits-per-second']), //
                    txBitsPerSec: parseInt(interfaze['tx-bits-per-second']), //
                    name: interfaze['name']
                };
                mikrotikTraffics.push(traffic);

            }

            return mikrotikTraffics;
        } catch (e) {
            console.error(e);
        }
    }


}

export { MikroTikRest };