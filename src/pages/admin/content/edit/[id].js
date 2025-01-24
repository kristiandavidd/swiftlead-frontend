import AdminLayout from '@/layout/AdminLayout';
import ArticleForm from '../../../../components/ArticleForm';

export default function EditArticle() {
    return (
        <AdminLayout head="Edit Article">
            <ArticleForm />
        </AdminLayout>
    )
}