import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/ui/sidebarAlt';
import Head from 'next/head';
import { useUser } from '@/context/userContext';
import { jwtDecode } from 'jwt-decode';
import { Toaster } from "@/components/ui/toaster";

export default function UserLayout({ children, head, className = '' }) {
    const router = useRouter();
    const { user } = useUser();
    const [isAuthorized, setIsAuthorized] = useState(false);

    const isTokenExpired = (token) => {
        try {
            const decoded = jwtDecode(token);
            const currentTime = Date.now() / 1000; // Convert to seconds
            return decoded.exp < currentTime; // True if token is expired
        } catch (error) {
            return true; // Treat invalid token as expired
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token || isTokenExpired(token)) {
            console.log(!token);
            console.log('Token from UserLayout:', token);
            console.log('User from UserLayout:', user);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            router.push('/login');
            return;
        }

        if (!user) {
            console.log('User is not loaded yet');
            return; // Wait until `user` is ready
        }

        try {
            const { role } = jwtDecode(token);
            if (role !== 0) {
                router.push('/admin');
            } else {
                setIsAuthorized(true);
            }
        } catch (error) {
            console.log('Invalid token', error);
            router.push('/login');
        }
    }, [router, user]); // Add `user` to dependency array

    if (!isAuthorized) {
        return null;
    }

    return (
        <div className={`md:flex w-full ${className}`}>
            <Head>
                <title>{head}</title>
            </Head>

            <Sidebar />

            <div className='w-full min-h-screen p-8 bg-gray-100 md:p-12 lg:w-4/5'>
                {children}
            </div>
            <Toaster />
        </div>
    );
}
