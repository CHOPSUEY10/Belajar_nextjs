import { LatestInvoicesSkeleton, RevenueChartSkeleton } from '@/app/ui/skeletons';


export default function Loading(){
    return(
    <main>
        <div className="text-3xl font-bold">Loading...</div><br/>
        <RevenueChartSkeleton/>
        <LatestInvoicesSkeleton/>

    </main>
    ) 

    

}
