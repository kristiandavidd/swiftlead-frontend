// pages/admin/articles/create.js
import AdminLayout from '@/layout/AdminLayout';
import ArticleForm from '../../../components/ArticleForm';

export default function CreateArticle() {
    return (
        <AdminLayout head="Create Article">
            <ArticleForm />
        </AdminLayout>
    )
}
