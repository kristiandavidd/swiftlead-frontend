import AdminLayout from "@/layout/AdminLayout"

export default function Article() {
    return (
        <AdminLayout>
            <div className="flex flex-col w-full">
                <p className="text-lg font-semibold">Admin Dashboard</p>
                <p className="hidden text-sm md:block">Bagian Artikel</p>
            </div>
        </AdminLayout>
    )
}