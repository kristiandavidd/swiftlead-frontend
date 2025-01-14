import io from 'socket.io-client';

let socket;

export const initSocket = () => {

    if (!socket) {
        const apiUrl = process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_API_PROD_URL
            : process.env.NEXT_PUBLIC_API_URL;

        socket = io(apiUrl, {
            path: '/socket.io',
            transports: ['websocket', 'polling'],
        });
    }
    return socket;
};
