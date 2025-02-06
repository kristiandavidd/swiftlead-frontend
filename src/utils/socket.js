import { io } from "socket.io-client";

let socket;

export const initSocket = () => {
    if (!socket) {
        const apiUrl =
            process.env.NODE_ENV === "production"
                ? process.env.NEXT_PUBLIC_API_PROD_URL
                : process.env.NEXT_PUBLIC_API_URL;

        socket = io(apiUrl, {
            path: "/socket.io",
            transports: ["websocket", "polling"],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 2000,
        });
    }
    return socket;
};

export const subscribeToSensor = ({ installCode }) => {
    if (!socket) {
        console.error("Socket not initialized. Call initSocket() first.");
        return;
    }

    if (!installCode) {
        console.error("Install code is required to subscribe.");
        return;
    }

    socket.emit("subscribeToSensor", { installCode });
    console.log(`Subscribed to sensor with installCode: ${installCode}`);
};

export const unsubscribeFromSensor = () => {
    if (!socket) {
        console.error("Socket not initialized. Call initSocket() first.");
        return;
    }

    socket.emit("unsubscribeFromSensor");
    console.log("Unsubscribed from the current sensor.");
};

export const closeSocket = () => {
    if (socket) {
        socket.disconnect();
        console.log("Socket connection closed.");
        socket = null;
    }
};
