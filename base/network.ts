import os from "os";
import config from "config";

const expressConfig: any = config.get("express");

export function GetLocalIP(): string {
    const ifaces: NodeJS.Dict<os.NetworkInterfaceInfo[]> = os.networkInterfaces();
    let localIP: string = "localhost";

    if (!expressConfig.useNetwork) {
        return localIP;
    }

    const desiredAdapter = expressConfig.networkAdapter

    Object.keys(ifaces).forEach((ifname) => {
        console.log(ifname);
        if (ifname !== desiredAdapter) {
            return;
        }

        const networkInterface = ifaces[ifname];
        if (networkInterface === undefined) {
            return;
        }

        networkInterface.forEach((iface) => {
            if (iface.family === "IPv4" && !iface.internal) {
                localIP = iface.address;
            }
        });
    });

    console.log(localIP);

    return localIP;
}

