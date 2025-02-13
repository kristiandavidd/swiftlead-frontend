import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import UserLayout from '@/layout/UserLayout';
import { IconTrendingUp } from '@tabler/icons-react';
import { Badge } from '@/components/ui/badge'
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
  const [sales, setSales] = useState([]);
  const [harvests, setHarvests] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);

  const apiUrl = process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_API_PROD_URL
    : process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchSales = async () => {
      if (!user?.id) return;
      try {
        const res = await axios.get(`${apiUrl}/sales/user/${user.id}`);
        const filteredSales = res.data.filter(sale => sale.status === 3).slice(-2);
        filteredSales.forEach(sale => {
          sale.totalRevenue = sale.price * ((sale.bowl_weight || 0) + (sale.oval_weight || 0) + (sale.corner_weight || 0) + (sale.broken_weight || 0));
          console.log(sale.bowl_weight)
        });
        setSales(filteredSales);
      } catch (error) {
        console.error("Error fetching sales:", error);
      }
    };

    const fetchHarvests = async () => {
      if (!user?.id) return;
      try {
        const res = await axios.get(`${apiUrl}/harvest/${user.id}`);
        if (!res.data || !Array.isArray(res.data)) {
          console.error("Invalid data format for harvests:", res.data);
          return;
        }
        const groupedHarvests = Object.values(res.data.reduce((acc, harvest) => {
          if (!harvest.created_at) return acc;
          const date = new Date(harvest.created_at).toISOString().split('T')[0];
          if (!acc[date]) {
            acc[date] = {
              date,
              totalQuantity: 0
            };
          }
          acc[date].totalQuantity += (harvest.bowl || 0) + (harvest.oval || 0) + (harvest.corner || 0) + (harvest.broken || 0);
          return acc;
        }, {})).sort((a, b) => new Date(b.date) - new Date(a.date));

        setHarvests(groupedHarvests.slice(0, 2));
      } catch (error) {
        console.error("Error fetching harvests:", error);
      }
    };

    fetchSales();
    fetchHarvests();
    setLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const calculatePercentageChange = (latest, previous) => {
    if (!previous) return "Belum ada data";
    const change = ((latest - previous) / previous) * 100;
    return isNaN(change) ? "Belum ada data" : change.toFixed(2) + "%";
  };

  const truncateText = (text, maxLength) => {
    if (!text || text.length === 0) {
      return '';
    }

    console.log(harvests)
    console.log(sales)

    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const apiUrl = process.env.NODE_ENV === "production"
          ? process.env.NEXT_PUBLIC_API_PROD_URL
          : process.env.NEXT_PUBLIC_API_URL;

        const response = await axios.get(`${apiUrl}/articles/published`);

        setArticles(response.data[0].slice(-2));
        setLoading(false);
      } catch (err) {
        setError('Gagal memuat data. Silakan coba lagi.');
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const stripHtmlTags = (html) => {
    return html.replace(/<[^>]*>/g, '');
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
      </div>

      {/*bagian ringkasan*/}
      <div className='flex flex-col gap-2 my-4 md:flex-row'>
        <Card className="md:w-1/2">
          <CardHeader>
            <CardDescription>Pendapatan Terakhir</CardDescription>
            <CardTitle>{sales.length > 0 ? `Rp ${sales[0].totalRevenue.toLocaleString("id-ID")}` : "Belum ada data"}</CardTitle>
          </CardHeader>
          <CardFooter className="flex justify-between">
            <Badge className={`text-white ${sales.length < 2 ? 'bg-gray-500' : sales[0].totalRevenue >= sales[1].totalRevenue ? 'bg-green-500' : 'bg-destructive'}`}>
              {sales.length < 2 ? '' : sales[0].totalRevenue >= sales[1].totalRevenue ? 'Peningkatan' : 'Penurunan'} {calculatePercentageChange(sales[0]?.totalRevenue, sales[1]?.totalRevenue)}
            </Badge>
            <Link href={"/sales"}>
              <Button>Lihat Detail</Button>
            </Link>
          </CardFooter>
        </Card>
        <Card className="md:w-1/2">
          <CardHeader>
            <CardDescription>Panen Terakhir</CardDescription>
            <CardTitle>{harvests.length > 0 ? `${harvests[0].totalQuantity.toFixed(2)} Kg` : "Belum ada data"}</CardTitle>
          </CardHeader>
          <CardFooter className="flex justify-between">
            <Badge className={`text-white ${harvests.length < 2 ? 'bg-gray-500' : harvests[0].totalQuantity >= harvests[1].totalQuantity ? 'bg-green-500' : 'bg-destructive'}`}>
              {harvests.length < 2 ? '' : harvests[0].totalQuantity >= harvests[1].totalQuantity ? 'Peningkatan' : 'Penurunan'} {calculatePercentageChange(harvests[0]?.totalQuantity, harvests[1]?.totalQuantity)}
            </Badge>
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
