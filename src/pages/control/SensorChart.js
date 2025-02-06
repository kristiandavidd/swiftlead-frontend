import { Line } from "react-chartjs-2";
import "chart.js/auto";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { IconDownload } from "@tabler/icons-react";
import html2canvas from 'html2canvas';


const SensorChart = ({ chartData, timeRange, setTimeRange, pdfRef }) => {

    const options = {
        responsive: true,
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const value = context.raw;
                        return `${context.dataset.label}: ${value.toFixed(2)}`;
                    },
                },
            },
        },
        scales: {
            y: {
                type: "linear",
                position: "left",
                ticks: {
                    callback: (value) => value.toFixed(2),
                },
            },
            y1: {
                type: "linear",
                position: "right",
                ticks: {
                    callback: (value) => value.toFixed(2),
                },
            },
        },
    };

    const combinedData = {
        labels: chartData.labels,
        datasets: [
            {
                label: "Suhu (°C)",
                data: chartData.Suhu,
                borderColor: "rgba(255, 99, 132, 1)",
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                yAxisID: "y",
            },
            {
                label: "Kelembaban (%)",
                data: chartData.Kelembaban,
                borderColor: "rgba(54, 162, 235, 1)",
                backgroundColor: "rgba(54, 162, 235, 0.2)",
                yAxisID: "y1",
            },
        ],
    };

    const downloadPDF = () => {
        const pdfElement = pdfRef.current;

        if (!pdfElement) {
            console.error("PDF element not found!");
            return;
        }

        html2canvas(pdfElement, { scale: 2 }).then((canvas) => {
            const doc = new jsPDF('p', 'mm', 'a4');
            const imgData = canvas.toDataURL('image/png');

            const imgWidth = 190;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            doc.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);

            const tableElement = pdfElement.querySelector('.printable table');
            if (tableElement) {
                doc.autoTable({ html: tableElement, startY: imgHeight + 15 });
            }

            if (timeRange === "daily") {
                doc.save('Data_Harian.pdf');
            } else if (timeRange === "monthly") {
                doc.save('Data_Bulanan.pdf');
            } else {
                doc.save('Data.pdf');
            }
        }).catch((error) => {
            console.error("Error generating PDF:", error);
        });
    };


    return (
        <div className="mb-6 print-content">
            <Tabs defaultValue="daily" onValueChange={(value) => setTimeRange(value)} className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-lg font-semibold">Grafik Suhu dan Kelembaban</p>
                        <p className="text-sm">Visualisasi grafik suhu dan kelembaban dalam jangka waktu harian maupun bulanan.</p>
                    </div>
                    <div className="flex items-center justify-between gap-2 no-print">
                        <Button onClick={downloadPDF} size="sm">
                            <IconDownload size={24} className="" />
                        </Button>
                        <TabsList className="flex items-center">
                            <TabsTrigger value="daily">Data Harian</TabsTrigger>
                            <TabsTrigger value="monthly">Data Bulanan</TabsTrigger>
                        </TabsList>
                    </div>
                </div>
                <TabsContent className="p-6 bg-white rounded-lg" value="daily">
                    <Line data={combinedData} options={options} />
                </TabsContent>
                <TabsContent className="p-6 bg-white rounded-lg" value="monthly">
                    <Line data={combinedData} options={options} />
                </TabsContent>
            </Tabs>

            {/* Tabel Data */}
            <div className="printable" ref={pdfRef}>
                <table className="w-full border border-collapse border-gray-300 table-auto">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 border border-gray-300">Waktu</th>
                            <th className="px-4 py-2 border border-gray-300">Suhu (°C)</th>
                            <th className="px-4 py-2 border border-gray-300">Kelembaban (%)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {chartData.labels.map((label, index) => (
                            <tr key={index}>
                                <td className="px-4 py-2 border border-gray-300">{label}</td>
                                <td className="px-4 py-2 border border-gray-300">{chartData.Suhu[index].toFixed(2)}</td>
                                <td className="px-4 py-2 border border-gray-300">{chartData.Kelembaban[index].toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SensorChart;
