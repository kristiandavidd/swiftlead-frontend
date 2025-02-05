"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import RegistMembershipModal from "@/components/registMembershipModal";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import UserLayout from "@/layout/UserLayout";
import { useRouter } from "next/router";

export default function MembershipPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isTermsAccepted, setIsTermsAccepted] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const handleCheckboxChange = (e) => {
        setIsTermsAccepted(e.target.checked);
    };

    const handleRegisterClick = () => {
        if (isTermsAccepted) {
            setIsModalOpen(true);
        } else {
            toast({
                title: "Galat!",
                description: "Anda harus menyetujui syarat dan ketentuan yang berlaku.",
                variant: "destructive"
            })
        }
    };

    return (
        <UserLayout head={"Daftar membership"}>
            <div className="container w-2/3 p-4 mx-auto">
                <div className="flex flex-col justify-between mb-4">
                    <h1 className="text-2xl font-bold">Bergabung dengan Membership Sekarang!</h1>
                    <p className="text-sm">Dapatkan berbagai keuntungan dengan menjadi petani walet kelas atas.</p>
                </div>

                <Card className="mt-6 mb-4">
                    <CardHeader>
                        <h2 className="text-lg font-bold">Syarat dan Ketentuan</h2>
                    </CardHeader>
                    <CardContent className="overflow-y-scroll h-60">
                        <ul className="pl-6 space-y-2 text-sm list-disc">
                            <li>Membership ini diperuntukkan bagi peternak burung walet yang menggunakan layanan monitoring kandang dari platform kami.</li>
                            <li>Anggota wajib menggunakan perangkat monitoring resmi yang kompatibel dengan sistem kami.</li>
                            <li>Semua data yang dihasilkan oleh perangkat monitoring akan disimpan secara aman sesuai kebijakan privasi platform kami.</li>
                            <li>Anggota wajib mematuhi peraturan dan panduan teknis yang telah ditentukan oleh penyedia layanan.</li>
                            <li>Keanggotaan dapat dihentikan jika terjadi pelanggaran syarat dan ketentuan atau jika layanan dihentikan oleh platform kami.</li>
                            <li>Biaya keanggotaan berlaku sesuai paket yang dipilih dan tidak dapat dikembalikan kecuali dalam kondisi tertentu yang ditentukan oleh penyedia layanan.</li>
                            <li>Platform tidak bertanggung jawab atas kerugian yang diakibatkan oleh kelalaian pengguna dalam mengoperasikan perangkat atau mengikuti panduan teknis.</li>
                            <li>Anggota harus memperbarui perangkat monitoring secara berkala agar tetap kompatibel dengan pembaruan sistem.</li>
                            <li>Anggota dilarang keras membagikan akses ke perangkat monitoring kepada pihak ketiga tanpa izin resmi dari platform.</li>
                            <li>Keamanan akun dan kata sandi adalah tanggung jawab masing-masing anggota.</li>
                            <li>Platform berhak mengubah syarat dan ketentuan tanpa pemberitahuan sebelumnya, dan anggota akan diberi tahu melalui email terdaftar.</li>
                            <li>Anggota wajib mengikuti pelatihan atau panduan yang disediakan oleh platform untuk memaksimalkan manfaat layanan.</li>
                            <li>Setiap perangkat monitoring yang rusak akibat kelalaian pengguna tidak menjadi tanggung jawab platform.</li>
                            <li>Anggota dilarang menggunakan perangkat monitoring untuk tujuan selain yang telah disepakati dalam keanggotaan.</li>
                            <li>Platform tidak bertanggung jawab atas gangguan teknis yang disebabkan oleh faktor eksternal seperti bencana alam atau pemadaman listrik.</li>
                            <li>Anggota yang ingin membatalkan keanggotaan harus memberikan pemberitahuan tertulis minimal 30 hari sebelum periode berakhir.</li>
                            <li>Setiap penyalahgunaan layanan monitoring akan mengakibatkan penghentian keanggotaan tanpa pengembalian biaya.</li>
                            <li>Platform memiliki hak untuk melakukan inspeksi perangkat monitoring secara berkala guna memastikan kepatuhan terhadap standar teknis.</li>
                            <li>Anggota wajib menjaga kondisi perangkat monitoring agar tetap berfungsi dengan baik.</li>
                            <li>Platform memiliki hak untuk menonaktifkan akun anggota jika ditemukan aktivitas mencurigakan.</li>
                            <li>Anggota dilarang memodifikasi perangkat monitoring tanpa persetujuan tertulis dari platform.</li>
                            <li>Segala sengketa yang timbul akan diselesaikan melalui mediasi sesuai hukum yang berlaku di wilayah operasional platform.</li>
                            <li>Anggota bertanggung jawab untuk memperbarui informasi pribadi yang terdaftar jika ada perubahan.</li>
                            <li>Platform tidak bertanggung jawab atas kehilangan data yang diakibatkan oleh kelalaian anggota.</li>
                            <li>Keanggotaan hanya berlaku untuk individu atau badan yang telah terdaftar secara resmi pada platform.</li>
                            <li>Anggota harus memiliki akses internet yang memadai untuk menggunakan layanan monitoring secara efektif.</li>
                            <li>Segala informasi yang diberikan oleh anggota kepada platform harus akurat dan tidak menyesatkan.</li>
                            <li>Platform memiliki hak untuk menghentikan layanan sementara untuk keperluan pemeliharaan sistem.</li>
                            <li>Anggota wajib melaporkan kerusakan perangkat atau gangguan layanan dalam waktu 24 jam setelah kejadian.</li>
                            <li>Platform memiliki hak untuk menolak pendaftaran yang tidak memenuhi persyaratan keanggotaan.</li>
                        </ul>
                    </CardContent>
                    <CardContent>
                        <div className="mt-4">
                            <label className="flex items-center space-x-2">
                                <Checkbox
                                    checked={isTermsAccepted}
                                    onCheckedChange={(checked) => setIsTermsAccepted(checked)}
                                />
                                <span>Saya menyetujui syarat dan ketentuan di atas</span>
                            </label>
                        </div>
                    </CardContent>
                </Card>
                <div className="flex items-center justify-end gap-4">
                    <Button onClick={() => router.push("/profile")} variant="outline">
                        Batal
                    </Button>
                    <Button className="" onClick={handleRegisterClick}>
                        Daftar Membership
                    </Button>
                </div>

                <RegistMembershipModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />
            </div>
        </UserLayout>
    );
}
