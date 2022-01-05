"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InfluxDBMikroTikRestTrafficImpl = void 0;
class InfluxDBMikroTikRestTrafficImpl {
    static getInfluxDB(data, device) {
        const influxElement = {
            measurement: `MikroTikRestTraffic_${device}-${data.name}`,
            fields: {
                rxMBitsPerSec: data.rxBitsPerSec / 1000000,
                txMBitsPerSec: data.txBitsPerSec / 1000000
            }
        };
        return influxElement;
    }
}
exports.InfluxDBMikroTikRestTrafficImpl = InfluxDBMikroTikRestTrafficImpl;
//# sourceMappingURL=InfluxDBMikroTikRestTraffic.js.map