import io from 'socket.io-client';

let socket;

export const initSocket = () => {
    if (!socket) {
        socket = io('http://localhost:5000', {
            path: '/socket.io',
            transports: ['websocket', 'polling'],
        });
    }
    return socket;
};
