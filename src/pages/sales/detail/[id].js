// pages/sales/detail/[id].jsx

import axios from "axios";
import UserLayout from "@/layout/UserLayout";
import Image from "next/image";

export async function getServerSideProps(context) {
    const { id } = context.params;

    try {
        const apiUrl = process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_API_PROD_URL
            : process.env.NEXT_PUBLIC_API_URL;

        const res = await axios.get(`${apiUrl}/sales/${id}`);
        return { props: { sale: res.data } };
    } catch (error) {
        console.error("Error fetching sale:", error);
        return { props: { sale: null } };
    }
}

export default function SaleDetailsPage({ sale }) {
    const statusMapping = {
        0: 'Submission',
        1: 'Checking',
        2: 'Admin Approval',
        3: 'Completed',
        4: 'Cancelled',
        5: 'Rejected',
        6: "Rescheduled"
    };

    const getProgressPercentage = (status) => {
        switch (status) {
            case 0:
                return 16;
            case 1:
                return 33;
            case 2:
                return 66;
            case 3:
                return 100;
            case 4:
            case 5:
                return 0;
            default:
                return 0;
        }
    };

    if (!sale) {
        return (
            <UserLayout>
                <p>Sale not found</p>
            </UserLayout>
        );
    }
    const apiUrl = process.env.NODE_ENV === "production"
        ? process.env.NEXT_PUBLIC_API_PROD_URL
        : process.env.NEXT_PUBLIC_API_URL;

    return (
        <UserLayout>
            <h1 className="mb-4 text-2xl font-bold">Detail Penjualan</h1>
            <div className="p-4 bg-white rounded-lg ">
                <div className="space-y-4">
                    <div>
                        <strong>Province:</strong> {sale.province}
                    </div>
                    <div>
                        <strong>Price:</strong>{" "}
                        {parseFloat(sale.price).toLocaleString("id-ID", {
                            style: "currency",
                            currency: "IDR",
                        })}
                    </div>
                    <div>
                        <strong>Bowl Weight:</strong> {sale.bowl_weight} kg
                    </div>
                    <div>
                        <strong>Oval Weight:</strong> {sale.oval_weight} kg
                    </div>
                    <div>
                        <strong>Corner Weight:</strong> {sale.corner_weight} kg
                    </div>
                    <div>
                        <strong>Broken Weight:</strong> {sale.broken_weight} kg
                    </div>
                    <div>
                        <strong>Appointment Date:</strong>{" "}
                        {new Date(sale.appointment_date).toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                        })}
                    </div>
                    <div>
                        <strong>Status:</strong> {statusMapping[sale.status]}
                    </div>
                    <div>
                        <strong>Progress:</strong>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                            <div
                                className={`h-2.5 rounded-full ${getProgressPercentage(sale.status) === 100
                                    ? "bg-green-500"
                                    : "bg-blue-500"
                                    }`}
                                style={{
                                    width: `${getProgressPercentage(sale.status)}%`,
                                }}
                            ></div>
                        </div>
                    </div>
                    <div>
                        <strong>Proof Photo:</strong>
                        <br />
                        {sale.proof_photo ? (
                            <Image
                                src={`${apiUrl}${sale.proof_photo}`}
                                alt="Proof"
                                width={200}
                                height={200}
                            />
                        ) : (
                            "No Photo"
                        )}
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
