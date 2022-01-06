import { Node, Red, NodeProperties } from "node-red";
import { InfluxDBBatchElement } from "./InfluxDBBatchElement";
import { InfluxDBMikroTikRestTrafficImpl } from "./InfluxDBMikroTikRestTraffic";
import { MikroTikRest } from "./MikroTikRest";
import { MikrotikTrafficIntegrator } from "./MikrotikTrafficIntegrator";

const func = (RED: Red) => {
    const mikrotikRest = function (config: NodeProperties) {

        this.name = (config as any).name;
        this.user = (config as any).user;
        this.passwd = (config as any).passwd;
        this.interfaces = (config as any).interfaces;
        this.interval = (config as any).interval;


        this.mikrotikRest = new MikroTikRest(this.name, this.user, this.passwd);
        this.mikrotikTrafficIntegrator = new MikrotikTrafficIntegrator(parseInt(this.interval));

        const node: Node = this;



        RED.nodes.createNode(node, config);


        /** 
         * Nodes register a listener on the input event 
         * to receive messages from the up-stream nodes in a flow.
        */
        node.on("input", async function (msg, send, done) {

            // For maximum backwards compatibility, check that send exists.
            // If this node is installed in Node-RED 0.x, it will need to
            // fallback to using `node.send`
            send = send || function () { node.send.apply(node, arguments) }

            const mikrotikRest = ((node as any).mikrotikRest) as MikroTikRest;
            const mikrotikTrafficIntegrator = ((node as any).mikrotikTrafficIntegrator) as MikrotikTrafficIntegrator;





            const message: InfluxDBBatchElement[] = [];
            const traffics = await mikrotikRest.readTraffic((node as any).interfaces);

            traffics.forEach(traffic => {

                const integratedTraffic = mikrotikTrafficIntegrator.push(traffic);
                if (null != integratedTraffic) {
                    message.push(InfluxDBMikroTikRestTrafficImpl.getInfluxDB(integratedTraffic, (node as any).name));
                }
            });





            send([
                { payload: message }
            ]);


            // Once finished, call 'done'.
            // This call is wrapped in a check that 'done' exists
            // so the node will work in earlier versions of Node-RED (<1.0)
            if (done) {
                done();
            }


        });


        /** 
         * Whenever a new flow is deployed, the existing nodes are deleted. 
         * If any of them need to tidy up state when this happens, such as 
         * disconnecting from a remote system, they should register a listener 
         * on the close event.
        */
        node.on('close', function (removed, done) {
            if (removed) {
                // This node has been disabled/deleted
            } else {
                // This node is being restarted
            }
            done();
        });

    }
    RED.nodes.registerType("mikrotik-rest", mikrotikRest);
}

module.exports = func;