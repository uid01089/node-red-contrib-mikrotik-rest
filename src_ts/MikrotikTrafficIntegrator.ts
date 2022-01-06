import { Hash } from "crypto";
import { MikrotikTraffic } from "./MikrotikTraffic";

interface MikrotikTrafficSum extends MikrotikTraffic {
    ctr: number;
}


class MikrotikTrafficIntegrator {
    interval: number;
    data: Map<string, MikrotikTrafficSum> = new Map();

    constructor(interval: number) {
        this.interval = interval;
    }

    push(traffic: MikrotikTraffic): MikrotikTraffic | null {

        let result: MikrotikTraffic = null;

        const existingTraffic = this.data.get(traffic.name);
        if (undefined === existingTraffic) {
            this.data.set(traffic.name, { name: traffic.name, rxBitsPerSec: traffic.rxBitsPerSec, txBitsPerSec: traffic.txBitsPerSec, ctr: 1 });
        } else {
            existingTraffic.rxBitsPerSec += traffic.rxBitsPerSec;
            existingTraffic.txBitsPerSec += traffic.txBitsPerSec;
            existingTraffic.ctr++;
        }

        if (existingTraffic.ctr >= this.interval) {

            result = { rxBitsPerSec: existingTraffic.rxBitsPerSec / existingTraffic.ctr, txBitsPerSec: existingTraffic.txBitsPerSec / existingTraffic.ctr, name: existingTraffic.name };
            this.data.delete(existingTraffic.name);
        }

        return result;

    }

}

export { MikrotikTrafficIntegrator };