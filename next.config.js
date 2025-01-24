const withPWA = require('next-pwa')({
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development', // Nonaktifkan PWA saat development
});

module.exports = withPWA({
    reactStrictMode: true,
    images: {
        domains: ['localhost', 'img.youtube.com'], // Tambahkan domain backend Anda
    },
});
