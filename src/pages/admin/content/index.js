"use client";

import AdminLayout from "@/layout/AdminLayout";


import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import ArticleSection from "./ArticleSection";
import VideoSection from "./VideoSection";
import Ebook from "@/pages/member/ebook";
import EbookSection from "./EbookSection";

export default function User() {

    return (
        <AdminLayout head={"Kelola Konten"}>
            <div className="flex flex-col justify-between mb-4">
                <h1 className="text-2xl font-bold">Kelola Konten</h1>
                <p className="text-sm">Kelola konten artikel dan konten untuk membership.</p>
            </div>

            <div className="p-4 overflow-x-auto bg-white rounded-lg">
                <Tabs defaultValue="article" className="">
                    <TabsList className="grid w-1/2 grid-cols-3 p-0 px-2 pt-2 bg-white">
                        <TabsTrigger className="py-2" value="article">Artikel</TabsTrigger>
                        <TabsTrigger className="py-2" value="video">Video Membership</TabsTrigger>
                        <TabsTrigger className="py-2" value="ebook">E-Book Membership</TabsTrigger>
                    </TabsList>
                    <TabsContent value="article">
                        <ArticleSection></ArticleSection>
                    </TabsContent>
                    <TabsContent value="video">
                        <VideoSection></VideoSection>
                    </TabsContent>
                    <TabsContent value="ebook">
                        <EbookSection></EbookSection>
                    </TabsContent>
                </Tabs>
            </div>
        </AdminLayout >
    );
}
