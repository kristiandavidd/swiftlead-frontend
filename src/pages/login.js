import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Head from 'next/head';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setEmailError('');
        setPasswordError('');
        setError('');

        if (!email) {
            setEmailError('Email is required');
            return;
        }
        if (!password) {
            setPasswordError('Password is required');
            return;
        }

        try {
            const res = await axios.post('https://swiftlead-backend-production.up.railway.app/api/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('email', email);
            router.push('/dashboard');
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
                        {emailError && <p className='text-sm text-red-500'>{emailError}</p>}
                    </div>
                    <div className='flex flex-col gap-2'>
                        <Label htmlFor='password'>Password</Label>
                        <Input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                        {passwordError && <p className='text-sm text-red-500'>{passwordError}</p>}
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
