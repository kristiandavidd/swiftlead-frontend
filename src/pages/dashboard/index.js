import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import UserLayout from '@/layout/UserLayout';
import { IconBellFilled } from '@tabler/icons-react';
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
        const response = await axios.get('http://localhost:5000/articles/published'); // Ganti URL API sesuai kebutuhan
        console.log(response.data);

        // Ambil array pertama dari response.data
        setArticles(response.data[0]); // Menyimpan array pertama ke dalam state articles
        setLoading(false);
      } catch (err) {
        setError('Failed to load articles');
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

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <UserLayout head={"Dashboard"}>
      <div className='flex items-center'>
        <div className='flex flex-col w-full'>
          <p className='text-lg font-semibold'>Dashboard</p>
          <p className='hidden text-sm md:block'>
            Provides an overview of key activities and statistics, helping users quickly assess performance and notifications.
          </p>
        </div>
        <Popover>
          <PopoverTrigger asChild className='duration-300 ease-in cursor-pointer text-primary hover:text-primary/80'>
            <IconBellFilled />
          </PopoverTrigger>
          <PopoverContent className="flex flex-col gap-2 w-80">
            <Alert>
              <AlertTitle className="font-semibold">Congratulations!</AlertTitle>
              <AlertDescription>Your first device installation has been successful!</AlertDescription>
            </Alert>
            <Alert>
              <AlertTitle className="font-semibold">Welcome!</AlertTitle>
              <AlertDescription>Your account registration is successful!</AlertDescription>
            </Alert>
          </PopoverContent>
        </Popover>
      </div>

      <div className='flex flex-col gap-2 my-4 md:flex-row'>
        <Card className="md:w-1/2">
          <CardHeader>
            <CardDescription>Total Revenue</CardDescription>
            <CardTitle>No data available.</CardTitle>
          </CardHeader>
          <CardFooter className="flex justify-between">
            <span className='text-sm text-muted-foreground'>Same as last month.</span>
            <Link href={"/sales"}>
              <Button>See Details</Button>
            </Link>
          </CardFooter>
        </Card>
        <Card className="md:w-1/2">
          <CardHeader>
            <CardDescription>Total Harvest</CardDescription>
            <CardTitle>No data available.</CardTitle>
          </CardHeader>
          <CardFooter className="flex justify-between">
            <span className='text-sm text-muted-foreground'>Same as last month.</span>
            <Link href={"/harvest"}>
              <Button>See Details</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      <div className='flex items-center gap-4'>
        <div className='flex flex-col w-full'>
          <p className='text-lg font-semibold'>Recent Articles</p>
          <p className='text-sm'>
            Explore the fascinating lives and vital roles of swallow birds in nature, culture, and agriculture.
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <Link className="px-6 py-2 font-medium text-white rounded-md bg-primary hover:bg-primary/90" href={"/article"}>More</Link>
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
                      src={`http://localhost:5000${article.cover_image}`}
                      alt={article.title}
                      width={80}
                      height={80}
                      objectFit='fill'
                      className='w-full h-full rounded-md'
                    />
                  </div>
                  <div className='5/6'>
                    <p className='text-[12px] mb-2 text-muted-foreground'>{new Date(article.created_at).toLocaleDateString()}</p>
                    <AlertTitle className="font-semibold">{article.title}</AlertTitle>
                    <AlertDescription>{truncateText(stripHtmlTags(article.content), 100)}</AlertDescription>
                  </div>
                </div>
                <Link href={`/article/${article.id}`} target='_blank' className='inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none h-9 px-3 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground'>
                  Read Article
                </Link>
              </div>
            </Alert>
          ))
        ) : (
          <div>No articles available.</div>
        )}
      </div>
    </UserLayout>
  );
}
