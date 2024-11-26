import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useUser } from '@/context/userContext';
import { jwtDecode } from 'jwt-decode';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { user, setUser } = useUser();
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                const { role } = decoded;

                if (role === 1) {
                    router.push('/admin');
                } else if (role === 0) {
                    router.push('/dashboard');
                }
            } catch (error) {
                console.error('Invalid token:', error);
            }
        }
    }, [router]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Email and password are required');
            return;
        }

        try {
            const apiUrl = process.env.NODE_ENV === 'production'
                ? process.env.NEXT_PUBLIC_API_PROD_URL
                : process.env.NEXT_PUBLIC_API_URL;

            const res = await axios.post(`${apiUrl}/auth/login`, { email, password });

            const { token, user: { name, role, location, no_telp, img_profile } } = res.data;

            localStorage.setItem('token', token);

            setUser({ email, name, role, location, no_telp, img_profile });

            if (role === 1) {
                router.push('/admin');
            } else if (role === 0) {
                router.push('/dashboard');
            } else {
                setError('Unknown user role');
            }
        } catch (error) {
            setError('Invalid credentials');
        }
    };

    return (
        <Card className='w-full m-auto my-10 sm:w-1/2 lg:w-1/3'>
            <Head>
                <title>Login</title>
            </Head>
            <CardHeader className="flex flex-col items-center justify-center text-center">
                <Image src='/images/logo.png' width={100} height={100} alt='Swiftlead' className='my-1' />
                <CardDescription>Login to your account</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleLogin} className='flex flex-col gap-6'>
                    <div className='flex flex-col gap-2'>
                        <Label htmlFor='email'>Email</Label>
                        <Input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <Label htmlFor='password'>Password</Label>
                        <Input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                    </div>
                    <div className='flex flex-col gap-2'>
                        {error && <p className='text-sm text-red-500'>{error}</p>}
                        <Button type="submit">Login</Button>
                    </div>
                </form>
            </CardContent>
            <CardFooter className="flex justify-center">
                <p className='text-sm text-muted-foreground'>Don&apos;t have an account? <Link href="/register" className="text-primary">Register</Link></p>
            </CardFooter>
        </Card>
    );
}
