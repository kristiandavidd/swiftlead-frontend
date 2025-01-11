import io from 'socket.io-client';

let socket;

export const initSocket = () => {

    if (!socket) {
        const apiUrl = process.env.NODE_ENV === 'production'
            ? 'https://swiftlead-backend-production-832b.up.railway.app'
            : 'http://localhost:5000';

        socket = io(apiUrl, {
            path: '/socket.io',
            transports: ['websocket', 'polling'],
        });
    }
    return socket;
};
