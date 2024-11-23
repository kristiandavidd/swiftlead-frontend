import AdminLayout from "@/layout/AdminLayout"

export default function Admin() {
    console.log("Admin Dashboard")
    return (
        <AdminLayout>
            <div className="flex flex-col w-full">
                <p className="text-lg font-semibold">Admin Dashboard</p>
                <p className="hidden text-sm md:block">Provides an overview of key activities and statistics, helping users quickly assess performance and notifications.</p>
            </div>
        </AdminLayout>
    )
}