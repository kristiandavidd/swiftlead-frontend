import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import UserLayout from '@/layout/UserLayout';
import { IconBell } from '@tabler/icons-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from '@/components/ui/separator';
import { useUser } from '@/context/userContext';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const router = useRouter();
  const { user } = useUser();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const apiUrl = process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_API_PROD_URL
    : process.env.NEXT_PUBLIC_API_URL;

  // Function to truncate text if it exceeds maxLength
  const truncateText = (text, maxLength) => {
    if (!text || text.length === 0) {
      return '';  // Jika text kosong atau undefined, kembalikan string kosong
    }

    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };


  // Fetch articles on component mount
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const apiUrl = process.env.NODE_ENV === "production"
          ? process.env.NEXT_PUBLIC_API_PROD_URL
          : process.env.NEXT_PUBLIC_API_URL;

        const response = await axios.get(`${apiUrl}/articles/published`); // Ganti URL API sesuai kebutuhan
        console.log(response.data);

        // Ambil array pertama dari response.data
        setArticles(response.data[0]); // Menyimpan array pertama ke dalam state articles
        setLoading(false);
      } catch (err) {
        setError('Gagal memuat data. Silakan coba lagi.');
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const stripHtmlTags = (html) => {
    return html.replace(/<[^>]*>/g, ''); // Menghapus semua tag HTML
  };


  if (loading) {
    return
  }

  return (
    <UserLayout head={"Beranda"}>
      <div className='flex items-center'>
        <div className='flex flex-col w-full'>
          <p className='text-lg font-semibold'>Beranda</p>
          <p className='hidden text-sm md:block'>
            Menyediakan gambaran umum tentang aktivitas dan statistik utama, membantu pengguna dengan cepat menilai kinerja dan notifikasi.
          </p>
        </div>
        <Popover>
          <PopoverTrigger asChild className='duration-300 ease-in cursor-pointer text-primary hover:text-primary/80'>
            <IconBell strokeWidth={1.2} />
          </PopoverTrigger>
          <PopoverContent className="flex flex-col gap-2 w-80">
            <Alert>
              <AlertTitle className="font-semibold">Selamat!</AlertTitle>
              <AlertDescription>Instalasi perangkat pertama Anda berhasil!</AlertDescription>
            </Alert>
            <Alert>
              <AlertTitle className="font-semibold">Selamat Datang!</AlertTitle>
              <AlertDescription>Pendaftaran akun Anda berhasil!</AlertDescription>
            </Alert>
          </PopoverContent>
        </Popover>
      </div>

      <div className='flex flex-col gap-2 my-4 md:flex-row'>
        <Card className="md:w-1/2">
          <CardHeader>
            <CardDescription>Total Pendapatan</CardDescription>
            <CardTitle>Tidak ada data tersedia.</CardTitle>
          </CardHeader>
          <CardFooter className="flex justify-between">
            <span className='text-sm text-muted-foreground'>Sama seperti bulan lalu.</span>
            <Link href={"/sales"}>
              <Button>Lihat Detail</Button>
            </Link>
          </CardFooter>
        </Card>
        <Card className="md:w-1/2">
          <CardHeader>
            <CardDescription>Total Panen</CardDescription>
            <CardTitle>Tidak ada data tersedia.</CardTitle>
          </CardHeader>
          <CardFooter className="flex justify-between">
            <span className='text-sm text-muted-foreground'>Sama seperti bulan lalu.</span>
            <Link href={"/harvest"}>
              <Button>Lihat Detail</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      <div className='flex items-center gap-4'>
        <div className='flex flex-col w-full'>
          <p className='text-lg font-semibold'>Artikel Terbaru</p>
          <p className='text-sm'>
            Jelajahi kehidupan menarik dan peran penting burung walet dalam alam, budaya, dan pertanian.
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <Button variant='outline'>
            <Link href={"/article"}>Selengkapnya</Link>
          </Button>
        </div>
      </div>

      <div className='flex flex-col gap-2 my-4'>
        {articles && articles.length > 0 ? (
          articles.map((article) => (
            <Alert key={article.id}>
              <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                <div className='flex flex-col items-center gap-4 md:flex-row'>
                  <div className='w-1/6 h-full'>
                    <Image
                      src={`${apiUrl}${article.cover_image}`}
                      alt={article.title}
                      width={80}
                      height={80}
                      objectFit='fill'
                      className='w-full h-full rounded-md'
                    />
                  </div>
                  <div className='5/6'>
                    <p className='text-[12px] mb-2 text-muted-foreground'>
                      {new Date(article.created_at).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                    <AlertTitle className="font-semibold">{article.title}</AlertTitle>
                    <AlertDescription>{truncateText(stripHtmlTags(article.content), 100)}</AlertDescription>
                  </div>
                </div>
                <Link href={`/article/${article.id}`} target='_blank' className='inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none h-9 px-3 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground'>
                  Baca Artikel
                </Link>
              </div>
            </Alert>
          ))
        ) : (
          <div>Tidak ada Artikel.</div>
        )}
      </div>
    </UserLayout>
  );
}
