import { Button } from "@/components/ui/button"
import Link from 'next/link'

export default function HarvestSection() {
    return (
        <div>
            <Link href={`/admin/transaction/add-weekly-price`}>
                <Button>Add Weekly Price</Button>
            </Link>
        </div>
    )
}