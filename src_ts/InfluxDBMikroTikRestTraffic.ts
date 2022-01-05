import { InfluxDBBatchElement } from "./InfluxDBBatchElement";
import { MikrotikTraffic } from "./MikrotikTraffic";

interface InfluxDBMikroTikRestTraffic extends InfluxDBBatchElement {
    fields: {
        rxMBitsPerSec: number;
        txMBitsPerSec: number;
    }
}

class InfluxDBMikroTikRestTrafficImpl {
    public static getInfluxDB(data: MikrotikTraffic, device: string): InfluxDBMikroTikRestTraffic {
        const influxElement: InfluxDBMikroTikRestTraffic = {
            measurement: `MikroTikRestTraffic_${device}-${data.name}`,
            fields: {
                rxMBitsPerSec: data.rxBitsPerSec / 1000000,
                txMBitsPerSec: data.txBitsPerSec / 1000000
            }
        }

        return influxElement;
    }
}

export { InfluxDBMikroTikRestTraffic, InfluxDBMikroTikRestTrafficImpl };