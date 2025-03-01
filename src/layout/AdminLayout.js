import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import SidebarAdmin from '@/components/ui/sidebarAdmin';
import Head from 'next/head';
import { Toaster } from '@/components/ui/toaster';
import { jwtDecode } from 'jwt-decode';

export default function AdminLayout({ children, head, className = '' }) {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);

    const isTokenExpired = (token) => {
        try {
            const decoded = jwtDecode(token);
            const currentTime = Date.now() / 1000; 
            console.log(currentTime);
            return decoded.exp < currentTime; 
        } catch (error) {
            return true; 
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (isTokenExpired(token)) {
            localStorage.removeItem('token');
            router.push('/login');
        }

        if (!token) {
            router.push('/login');
            return;
        }

        try {
            const { role } = jwtDecode(token);
            if (role !== 1) {
                router.push('/dashboard');
                return;
            }
            setIsAuthorized(true);
        } catch (error) {
            router.push('/login');
        }
    }, [router]);

    if (!isAuthorized) {
        return null;
    }

    return (
        <div className={`md:flex w-full ${className}`}>
            <Head>
                <title>{head}</title>
            </Head>

            <SidebarAdmin />

            <div className='w-full min-h-screen p-8 bg-gray-100 md:p-12 lg:w-4/5'>
                {children}
            </div>
            <Toaster />
        </div>
    );
}
