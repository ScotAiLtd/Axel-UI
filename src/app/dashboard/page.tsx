import { Suspense } from "react"
import { Metadata } from "next"
import {
  Wind,
  Building2,
  Boxes,
  ClipboardList,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Overview } from "@/components/dashboard/overview"
import { RecentApprovals } from "@/components/dashboard/recent-approvals"
import { TasksList } from "@/components/dashboard/tasks-list"

export const metadata: Metadata = {
  title: "Dashboard | Aurai Wind",
  description: "Wind turbine documentation management dashboard",
}

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-6 p-6 pt-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground/90">Welcome back</h2>
        <p className="text-muted-foreground mt-2">Here's an overview of your wind turbine operations.</p>
      </div>

    
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Turbines</CardTitle>
            <Wind className="h-4 w-4 text-[#8ec2b3]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">247</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <span className="text-emerald-500 mr-1">↑</span>
              12 from last month
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sites</CardTitle>
            <Boxes className="h-4 w-4 text-[#8ec2b3]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <span className="text-emerald-500 mr-1">↑</span>
              2 from last month
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platforms</CardTitle>
            <Building2 className="h-4 w-4 text-[#8ec2b3]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <span className="text-emerald-500 mr-1">↑</span>
              1 from last month
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
            <ClipboardList className="h-4 w-4 text-[#8ec2b3]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">34</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <span className="text-amber-500 mr-1">⚡</span>
              8 due today
            </div>
          </CardContent>
        </Card>
      </div>

     
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Monthly Performance</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview />
          </CardContent>
        </Card>
        <Card className="col-span-3 hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Recent Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentApprovals />
          </CardContent>
        </Card>
      </div>

    
      <div className="grid gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Pending Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <TasksList />
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 