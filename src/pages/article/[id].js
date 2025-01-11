import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Head from 'next/head';
import Link from 'next/link';

const ArticlePreview = () => {
    const router = useRouter();
    const { id } = router.query;
    const [article, setArticle] = useState(null);

    console.log('accessed article preview');

    useEffect(() => {
        const apiUrl = process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_API_PROD_URL
            : process.env.NEXT_PUBLIC_API_URL;

        if (id) {
            const apiUrl = process.env.NODE_ENV === "production"
                ? process.env.NEXT_PUBLIC_API_PROD_URL
                : process.env.NEXT_PUBLIC_API_URL;

            axios.get(`${apiUrl}/articles/${id}`)
                .then(response => {
                    if (Array.isArray(response.data) && response.data.length > 0) {
                        setArticle(response.data[0]);
                    } else {
                        console.error('Article not found');
                    }
                })
                .catch(error => console.error('Error fetching article:', error));
        }
    }, [id]);

    if (!article) {
        return
    }

    return (
        <div className="max-w-3xl p-6 mx-auto mt-10 bg-white rounded-md shadow-md">
            <Head ><title>{article.title}</title></Head>
            <div className='w-full mb-10'>
                <Link href={"/"}>
                    <Image alt='Swiftlead' className='mx-auto ' src="/images/logo.png" width={80} height={80} />
                </Link>
            </div>
            <h1 className="mb-4 text-3xl font-bold text-center">{article.title}</h1>
            {article.cover_image && (
                <Image
                    src={`http://localhost:5000${article.cover_image}`}
                    alt="Cover"
                    className="object-cover mx-auto mt-6 mb-6 rounded-md max-h-96"
                    width={800}
                    height={400}
                />
            )}
            <div dangerouslySetInnerHTML={{ __html: article.content }} className='text-justify ' />

        </div>
    );
};

export default ArticlePreview;
