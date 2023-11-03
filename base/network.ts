import os from "os"

export function GetLocalIP(): string {
    const ifaces: NodeJS.Dict<os.NetworkInterfaceInfo[]> = os.networkInterfaces();
    let localIP: string = "localhost";

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

