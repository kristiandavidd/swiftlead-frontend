import AdminLayout from "@/layout/AdminLayout";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import HarvestSection from "./HarvestSection";
import MembershipSection from "./MembershipSection";
import SalesSection from "./SalesSection";


export default function Index() {
    return (
        <AdminLayout>
            <div className="flex flex-col justify-between mb-4">
                <h1 className="text-2xl font-bold">Manage Transaction</h1>
                <p className="text-sm">Manage transaction page.</p>
            </div>

            <div className="p-4 overflow-x-auto bg-white rounded-lg">
                <Tabs defaultValue="harvest" className="">
                    <TabsList className="grid w-1/2 grid-cols-3 p-0 px-2 pt-2 bg-white">
                        <TabsTrigger className="py-2" value="harvest">Harvest</TabsTrigger>
                        <TabsTrigger className="py-2" value="sales">Sales</TabsTrigger>
                        <TabsTrigger className="py-2" value="membership">Membership</TabsTrigger>
                    </TabsList>
                    <TabsContent value="harvest">
                        <HarvestSection></HarvestSection>
                    </TabsContent>
                    <TabsContent value="sales">
                        <SalesSection></SalesSection>
                    </TabsContent>
                    <TabsContent value="membership">
                        <MembershipSection></MembershipSection>
                    </TabsContent>
                </Tabs>
            </div>
        </AdminLayout >
    );
}