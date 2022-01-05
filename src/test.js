"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MikroTikRest_1 = require("./MikroTikRest");
let mikrotik = new MikroTikRest_1.MikroTikRest("10.10.30.1", "admin", "95309530");
mikrotik.readTraffic("WAN_1,VLANS_5,vlan20_Childs,vlan30_Parents,vlan40_iot,vlan50_guests,vlan60_printers").then((t) => {
    console.table(t);
});
//# sourceMappingURL=test.js.map