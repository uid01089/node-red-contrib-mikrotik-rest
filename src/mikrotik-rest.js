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
const InfluxDBMikroTikRestTraffic_1 = require("./InfluxDBMikroTikRestTraffic");
const MikroTikRest_1 = require("./MikroTikRest");
const MikrotikTrafficIntegrator_1 = require("./MikrotikTrafficIntegrator");
const func = (RED) => {
    const mikrotikRest = function (config) {
        this.name = config.name;
        this.user = config.user;
        this.passwd = config.passwd;
        this.interfaces = config.interfaces;
        this.interval = config.interval;
        this.mikrotikRest = new MikroTikRest_1.MikroTikRest(this.name, this.user, this.passwd);
        this.mikrotikTrafficIntegrator = new MikrotikTrafficIntegrator_1.MikrotikTrafficIntegrator(parseInt(this.interval));
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const node = this;
        RED.nodes.createNode(node, config);
        /**
         * Nodes register a listener on the input event
         * to receive messages from the up-stream nodes in a flow.
        */
        node.on("input", function (msg, send, done) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    // For maximum backwards compatibility, check that send exists.
                    // If this node is installed in Node-RED 0.x, it will need to
                    // fallback to using `node.send`
                    // eslint-disable-next-line prefer-spread, prefer-rest-params
                    send = send || function () { node.send.apply(node, arguments); };
                    const mikrotikRest = (node.mikrotikRest);
                    const mikrotikTrafficIntegrator = (node.mikrotikTrafficIntegrator);
                    const message = [];
                    const traffics = yield mikrotikRest.readTraffic(node.interfaces);
                    traffics.forEach(traffic => {
                        const integratedTraffic = mikrotikTrafficIntegrator.push(traffic);
                        if (null != integratedTraffic) {
                            message.push(InfluxDBMikroTikRestTraffic_1.InfluxDBMikroTikRestTrafficImpl.getInfluxDB(integratedTraffic, node.name));
                        }
                    });
                    send([
                        { payload: message }
                    ]);
                }
                catch (e) {
                    console.error(e);
                }
                // Once finished, call 'done'.
                // This call is wrapped in a check that 'done' exists
                // so the node will work in earlier versions of Node-RED (<1.0)
                if (done) {
                    done();
                }
            });
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
            }
            else {
                // This node is being restarted
            }
            done();
        });
    };
    RED.nodes.registerType("mikrotik-rest", mikrotikRest);
};
module.exports = func;
//# sourceMappingURL=mikrotik-rest.js.map