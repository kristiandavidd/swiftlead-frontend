const statusLabels = {
    0: 'Pending',
    1: 'Checking',
    2: 'Approved',
    3: 'Completed',
    4: 'Cancelled',
    5: 'Rejected',
};

const statusColors = {
    0: 'bg-gray-300 text-gray-700',
    1: 'bg-blue-300 text-blue-700',
    2: 'bg-green-300 text-green-700',
    3: 'bg-green-500 text-white',
    4: 'bg-red-300 text-red-700',
    5: 'bg-red-500 text-white',
};

export default function ProgressStatus({ status }) {
    return (
        <div className={`px-4 py-2 rounded-full ${statusColors[status]}`}>
            {statusLabels[status] || 'Unknown Status'}
        </div>
    );
}
