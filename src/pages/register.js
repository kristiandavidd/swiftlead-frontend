import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardDescription,
} from '@/components/ui/card';
import { Label } from '@radix-ui/react-label';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import Cookies from 'js-cookie';
import { useUser } from '@/context/userContext';

export default function Register() {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const [message, setMessage] = useState('');
    const router = useRouter();
    const { setUser } = useUser();
    const password = watch('password');

    const onSubmit = async (data) => {
        setMessage('');
        try {
            const apiUrl = process.env.NODE_ENV === 'production'
                ? process.env.NEXT_PUBLIC_API_PROD_URL
                : process.env.NEXT_PUBLIC_API_URL;

            const res = await axios.post(`${apiUrl}/auth/register`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });

            if (res.status === 201 || res.status === 200) {
                const { token, user } = res.data;

                // Menyimpan token di localStorage
                localStorage.setItem('token', token);

                // Menyimpan user di context dan localStorage
                const userData = {
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    location: user.location,
                    no_telp: user.no_telp,
                    img_profile: user.img_profile,
                };
                setUser(userData);

                // Redirect ke dashboard
                router.push('/dashboard');
            } else {
                setMessage('Registration failed: ' + res.data.message);
            }
        } catch (error) {
            if (error.response) {
                console.error('Error response:', error.response.data);
                setMessage(error.response.data.message || 'An error occurred');
            } else {
                console.error('Error:', error.message);
                setMessage(error.message);
            }
        }
    };

    return (
        <Card className='w-full m-auto my-10 sm:w-1/2 lg:w-1/3'>
            <Head>
                <title>Register</title>
            </Head>
            <CardHeader className="flex flex-col items-center justify-center text-center">
                <Image src='/images/logo.png' width={100} height={100} alt='Swiftlead' className='my-1' />
                <CardDescription>Create a new account</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6'>
                    <div className='flex flex-col gap-2'>
                        <Label htmlFor='email'>Email</Label>
                        <Input {...register('email', { required: true })} type="email" id="email" placeholder="Email" />
                        {errors.email && <p className='text-sm text-red-500'>Email is required</p>}
                    </div>
                    <div className='flex flex-col gap-2'>
                        <Label htmlFor='name'>Name</Label>
                        <Input {...register('name', { required: true })} type="text" id="name" placeholder="Name" />
                        {errors.name && <p className='text-sm text-red-500'>Name is required</p>}
                    </div>
                    <div className='flex flex-col gap-2'>
                        <Label htmlFor='password'>Password</Label>
                        <Input {...register('password', { required: true })} type="password" id="password" placeholder="Password" />
                        {errors.password && <p className='text-sm text-red-500'>Password is required</p>}
                    </div>
                    <div className='flex flex-col gap-2'>
                        <Label htmlFor='confirmPassword'>Confirm Password</Label>
                        <Input
                            {...register('confirmPassword', {
                                required: true,
                                validate: value => value === password || "Passwords do not match"
                            })}
                            type="password"
                            id="confirmPassword"
                            placeholder="Confirm Password"
                        />
                        {errors.confirmPassword && <p className='text-sm text-red-500'>{errors.confirmPassword.message}</p>}
                    </div>
                    {message && <p className='text-sm text-red-500'>{message}</p>}
                    <Button type="submit">Register</Button>
                </form>
            </CardContent>
            <CardFooter className="flex justify-center">
                <p className='text-sm text-muted-foreground'>Already have an account? <Link href="/login" className="text-primary">Login</Link></p>
            </CardFooter>
        </Card>
    );
}
