import os from "os"
import config from "config"

const expressConfig: any = config.get("express")
export function GetLocalIP(): string {
    const ifaces: NodeJS.Dict<os.NetworkInterfaceInfo[]> = os.networkInterfaces();
    let localIP: string = "localhost";

    if (!expressConfig.useNetwork) {
        return localIP
    }

    Object.keys(ifaces).forEach((ifname) => {
        const networkInterface = ifaces[ifname]
        if (networkInterface === undefined) {
            return;
        }
        networkInterface.forEach((iface) => {
            if (iface.family === 'IPv4' && !iface.internal) {
                localIP = iface.address;
            }
        });
    });

    return localIP;
}

