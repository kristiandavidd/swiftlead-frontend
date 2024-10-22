import io from 'socket.io-client';

let socket;

export const initSocket = () => {
    if (!socket) {
        socket = io('https://swiftlead-backend-production.up.railway.app', {
            path: '/socket.io',
            transports: ['websocket', 'polling'],
        });
    }
    return socket;
};
