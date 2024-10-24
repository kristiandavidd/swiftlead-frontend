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
    CardTitle,
} from '@/components/ui/card';
import { Label } from '@radix-ui/react-label';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';

export default function Register() {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const [message, setMessage] = useState('');
    const router = useRouter();
    const password = watch('password');

    const onSubmit = async (data) => {
        try {
            const res = await axios.post('https://swiftlead-backend-production-9ac7.up.railway.app/auth/register', data, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            })
                .then(response => {
                    console.log('Success:', response.data);
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            localStorage.setItem('token', res.data.token);
            setMessage(res.data.message);
            router.push('/dashboard');
        } catch (error) {
            console.error('Error:', error.response || error.message);
            setMessage('Registration failed');
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
