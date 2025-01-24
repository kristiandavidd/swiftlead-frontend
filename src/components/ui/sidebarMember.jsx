import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { IconHome, IconBook2, IconArticle, IconArrowLeft, IconBrandYoutube } from '@tabler/icons-react';

export default function SidebarMember() {
    const router = useRouter();

    return (
        <>
            <div className="hidden w-1/5 text-white md:flex-col md:bg-white md:h-screen md:flex">
                <div className="flex items-center justify-center p-6 pt-12">
                    <Image src="/images/logo.png" alt="Logo" width={120} height={120} />
                </div>

                <nav className="px-10 py-12">
                    <ul className='flex flex-col gap-4 '>
                        <li>
                            <Button className='w-full'>
                                <Link href="/dashboard" className='flex items-center gap-2'><IconArrowLeft /> Kembali</Link>
                            </Button>
                        </li>
                        <li>
                            <a href="/member">
                                <div
                                    className={`flex gap-2 px-4 py-2 rounded-md items-center cursor-pointer ${router.pathname === '/member' ? 'bg-tersier text-primary' : 'text-primary'
                                        }`}
                                >
                                    <IconHome size={20} stroke={1.5} /> Dashboard
                                </div>
                            </a>
                        </li>
                        <li>
                            <a href="/member/article">
                                <div
                                    className={`flex gap-2 px-4 py-2 rounded-md items-center cursor-pointer ${router.pathname === '/member/article' ? 'bg-tersier text-primary' : 'text-primary'
                                        }`}
                                >
                                    <IconArticle size={20} stroke={1.5} /> Article
                                </div>
                            </a>
                        </li>
                        <li>
                            <a href="/member/video">
                                <div
                                    className={`flex gap-2 px-4 py-2 rounded-md items-center cursor-pointer ${router.pathname === '/member/video' ? 'bg-tersier text-primary' : 'text-primary'
                                        }`}
                                >
                                    <IconBrandYoutube size={20} stroke={1.5} /> Video
                                </div>
                            </a>
                        </li>
                        <li>
                            <a href="/member/ebook">
                                <div
                                    className={`flex gap-2 px-4 py-2 rounded-md items-center cursor-pointer ${router.pathname === '/member/ebook' ? 'bg-tersier text-primary' : 'text-primary'
                                        }`}
                                >
                                    <IconBook2 size={20} stroke={1.5} /> E-Book
                                </div>
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
            <div className='fixed bottom-0 left-0 right-0 z-20 md:hidden '>
                <div className='flex items-center justify-center bg-white border border-muted rounded-t-md'>
                    <nav className="px-10 py-4">
                        <ul className='flex gap-4 '>
                            <li>
                                <a href="/member">
                                    <div
                                        className={`flex gap-2 px-4 py-2 rounded-md items-center cursor-pointer ${router.pathname === '/member' ? 'bg-tersier text-primary' : 'text-primary'
                                            }`}
                                    >
                                        <IconHome size={20} stroke={1.5} /> Dashboard
                                    </div>
                                </a>
                            </li>
                            <li>
                                <a href="/member/article">
                                    <div
                                        className={`flex gap-2 px-4 py-2 rounded-md items-center cursor-pointer ${router.pathname === '/member/article' ? 'bg-tersier text-primary' : 'text-primary'
                                            }`}
                                    >
                                        <IconArticle size={20} stroke={1.5} /> Article
                                    </div>
                                </a>
                            </li>
                            <li>
                                <a href="/member/video">
                                    <div
                                        className={`flex gap-2 px-4 py-2 rounded-md items-center cursor-pointer ${router.pathname === '/member/video' ? 'bg-tersier text-primary' : 'text-primary'
                                            }`}
                                    >
                                        <IconBrandYoutube size={20} stroke={1.5} /> Video
                                    </div>
                                </a>
                            </li>
                            <li>
                                <a href="/member/ebook">
                                    <div
                                        className={`flex gap-2 px-4 py-2 rounded-md items-center cursor-pointer ${router.pathname === '/member/ebook' ? 'bg-tersier text-primary' : 'text-primary'
                                            }`}
                                    >
                                        <IconBook2 size={20} stroke={1.5} /> E-Book
                                    </div>
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </>
    );
}
