import { Metadata } from "next"
import { SupportTicketForm } from "@/components/forms/support-ticket-form"
import { TicketList } from "@/components/support/ticket-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Support | Aurai Wind",
  description: "Get help and support for your wind turbine projects",
}

export default function SupportPage() {
  return (
    <div className="flex-1">
      <div className="space-y-6 p-6 pt-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground/90">Support Center</h2>
          <p className="text-muted-foreground mt-2">Get assistance with your wind turbine projects and documentation</p>
        </div>

        <Tabs defaultValue="new-ticket" className="space-y-6">
          <TabsList className="grid w-full max-w-[400px] grid-cols-2">
            <TabsTrigger value="new-ticket">New Ticket</TabsTrigger>
            <TabsTrigger value="my-tickets">My Tickets</TabsTrigger>
          </TabsList>

          <TabsContent value="new-ticket" className="space-y-4">
            <SupportTicketForm />
          </TabsContent>

          <TabsContent value="my-tickets">
            <Card>
              <TicketList />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 