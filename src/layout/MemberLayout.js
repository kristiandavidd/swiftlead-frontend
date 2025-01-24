/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import SidebarMember from '@/components/ui/sidebarMember';
import Head from 'next/head';
import { Toaster } from '@/components/ui/toaster';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useUser } from '@/context/userContext';
import Spinner from '@/components/ui/spinner'; // Pastikan Anda memiliki komponen spinner atau ganti dengan loader lain

export default function MemberLayout({ children, head, className = '' }) {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [loading, setLoading] = useState(false); // Tambahkan state untuk loading
    const { user } = useUser();

    const isTokenExpired = (token) => {
        try {
            const decoded = jwtDecode(token);
            console.log('Decoded token:', decoded);
            const currentTime = Math.floor(Date.now() / 1000); // Convert to seconds
            return decoded.exp < currentTime; // True if token is expired
        } catch (error) {
            console.log('Error decoding token:', error);
            return true; // Treat invalid token as expired
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        setLoading(true); // Aktifkan loading saat useEffect berjalan

        if (!token || isTokenExpired(token)) {
            console.log(!token);
            console.log(isTokenExpired(token));
            console.log('Token from MemberLayout:', token);
            console.log('User from MemberLayout:', user);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            router.push('/login');
            setLoading(false); // Matikan loading jika gagal
            return;
        }

        try {
            const decoded = jwtDecode(token);
            const { id, role } = decoded;

            if (role !== 0) {
                router.push('/admin'); // Arahkan admin ke halaman admin
                setLoading(false); // Matikan loading
                return;
            }

            setIsAuthorized(true);

            // Periksa status member berdasarkan ID pengguna
            checkMemberStatus(id);
        } catch (error) {
            console.error('Invalid token:', error);
            router.push('/login');
            setLoading(false); // Matikan loading
        }
    }, [router]);

    const checkMemberStatus = async (id) => {
        const apiUrl = process.env.NODE_ENV === 'production'
            ? process.env.NEXT_PUBLIC_API_PROD_URL
            : process.env.NEXT_PUBLIC_API_URL;

        try {
            const response = await axios.get(`${apiUrl}/membership/user/${id}`);
            const { isActive } = response.data;

            if (!isActive) {
                // Jika user tidak aktif atau tidak terdaftar, alihkan ke dashboard
                router.push('/dashboard');
            }
        } catch (error) {
            console.error('Failed to fetch membership status:', error);
            router.push('/dashboard'); // Jika terjadi error, anggap user tidak aktif
        } finally {
            setLoading(false); // Matikan loading setelah memeriksa status
        }
    };

    // Tambahkan event listener untuk perubahan rute
    useEffect(() => {
        const handleStart = () => setLoading(true);
        const handleComplete = () => setLoading(false);

        router.events.on('routeChangeStart', handleStart);
        router.events.on('routeChangeComplete', handleComplete);
        router.events.on('routeChangeError', handleComplete);

        return () => {
            router.events.off('routeChangeStart', handleStart);
            router.events.off('routeChangeComplete', handleComplete);
            router.events.off('routeChangeError', handleComplete);
        };
    }, [router]);

    if (loading || !isAuthorized) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Spinner /> {/* Komponen Spinner untuk loading */}
            </div>
        );
    }

    return (
        <div className={`md:flex w-full ${className}`}>
            <Head>
                <title>{head}</title>
            </Head>

            <SidebarMember />

            <div className="w-full min-h-screen p-8 bg-gray-100 md:p-12 lg:w-4/5">
                {children}
            </div>

            <Toaster />
        </div>
    );
}
