import { InfluxDBBatchElement } from "./InfluxDBBatchElement";
import { MikrotikTraffic } from "./MikrotikTraffic";

interface InfluxDBMikroTikRestTraffic extends InfluxDBBatchElement {
    fields: {
        rxMBitsPerSec: number;
        txMBitsPerSec: number;
        interface: string;
        device: string;
    }
}

class InfluxDBMikroTikRestTrafficImpl {
    public static getInfluxDB(data: MikrotikTraffic, device: string): InfluxDBMikroTikRestTraffic {
        const influxElement: InfluxDBMikroTikRestTraffic = {
            measurement: "MikroTikRestTraffic",
            fields: {
                rxMBitsPerSec: data.rxBitsPerSec / 1000000,
                txMBitsPerSec: data.txBitsPerSec / 1000000,
                interface: data.name,
                device: device
            }
        }

        return influxElement;
    }
}

export { InfluxDBMikroTikRestTraffic, InfluxDBMikroTikRestTrafficImpl };