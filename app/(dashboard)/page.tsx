import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSalesPerMonth, getTotalCustomers, getTotalSales } from "@/lib/actions/actions";
import { UserButton } from "@clerk/nextjs";
import { Separator } from "@radix-ui/react-separator";
import { ChartColumn, CircleDollarSign, ShoppingBag, UserRound } from "lucide-react";
import Image from "next/image";
import SalesChart from "../components/custom_ui/SalesChart";

export default async function Home() {
  const totalRevenue = await getTotalSales().then((data) => data.totalRevenue)
  const totalOrders = await getTotalSales().then((data) => data.totalOrders)
  const totalCustomers = await getTotalCustomers()

  const graphData = await getSalesPerMonth()

  return (
    <div className="px-8 py-10">
      <p className="text-heading2-bold">
        Dashboard
      </p>
      <Separator className="bg-grey-1 my-5" />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
        <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>Total Revenue</CardTitle>
              <CircleDollarSign className="max-sm:hidden" />
            </CardHeader>
            <CardContent>
              <p className="text-body-bold">$ {totalRevenue.toFixed(2)}</p>
            </CardContent>
        </Card>

        <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>Total Orders</CardTitle>
              <ShoppingBag className="max-sm:hidden" />
            </CardHeader>
            <CardContent>
              <p className="text-body-bold"> {totalOrders}</p>
            </CardContent>
        </Card>

        <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>Total Customer</CardTitle>
              <UserRound className="max-sm:hidden" />
            </CardHeader>
            <CardContent>
              <p className="text-body-bold">{totalCustomers}</p>
            </CardContent>
        </Card>
      </div>
      <Card className="mt-10">
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>Sales Chart ()</CardTitle>
              <ChartColumn className="max-sm:hidden" />
            </CardHeader>
            <CardContent>
              <SalesChart data={graphData} />
            </CardContent>
        </Card>
    </div>
  );
}
