/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import SidebarMember from '@/components/ui/sidebarMember';
import Head from 'next/head';
import { Toaster } from '@/components/ui/toaster';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useUser } from '@/context/userContext';
import Spinner from '@/components/ui/spinner'; 

export default function MemberLayout({ children, head, className = '' }) {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [loading, setLoading] = useState(false);
    const { user } = useUser();

    const isTokenExpired = (token) => {
        try {
            const decoded = jwtDecode(token);
            console.log('Decoded token:', decoded);
            const currentTime = Math.floor(Date.now() / 1000);
            return decoded.exp < currentTime; 
        } catch (error) {
            console.log('Error decoding token:', error);
            return true; 
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        setLoading(true);

        if (!token || isTokenExpired(token)) {
            console.log(!token);
            console.log(isTokenExpired(token));
            console.log('Token from MemberLayout:', token);
            console.log('User from MemberLayout:', user);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            router.push('/login');
            setLoading(false); 
            return;
        }

        try {
            const decoded = jwtDecode(token);
            const { id, role } = decoded;

            if (role !== 0) {
                router.push('/admin'); 
                setLoading(false); 
                return;
            }

            setIsAuthorized(true);

            checkMemberStatus(id);
        } catch (error) {
            console.error('Invalid token:', error);
            router.push('/login');
            setLoading(false);
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
                router.push('/dashboard');
            }
        } catch (error) {
            console.error('Failed to fetch membership status:', error);
            router.push('/dashboard');
        } finally {
            setLoading(false);
        }
    };

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
