import AdminLayout from "@/layout/AdminLayout"

export default function Installation() {
    return (
        <AdminLayout>
            <div className="flex flex-col w-full">
                <p className="text-lg font-semibold">Installation</p>
                <p className="hidden text-sm md:block">Manage Installation</p>
            </div>
        </AdminLayout>
    )
}