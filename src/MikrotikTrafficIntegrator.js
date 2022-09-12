"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MikrotikTrafficIntegrator = void 0;
class MikrotikTrafficIntegrator {
    constructor(interval) {
        this.data = new Map();
        this.interval = interval;
    }
    push(traffic) {
        let result = null;
        let existingTraffic = this.data.get(traffic.name);
        if (undefined === existingTraffic) {
            existingTraffic = { name: traffic.name, rxBitsPerSec: traffic.rxBitsPerSec, txBitsPerSec: traffic.txBitsPerSec, ctr: 1 };
            this.data.set(traffic.name, existingTraffic);
        }
        else {
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
exports.MikrotikTrafficIntegrator = MikrotikTrafficIntegrator;
//# sourceMappingURL=MikrotikTrafficIntegrator.js.map