import { Metadata } from "next"
import { FileManager } from "@/components/files/file-manager"
import { FileUploadButton } from "@/components/files/file-upload-button"
import { FileFilters } from "@/components/files/file-filters"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

export const metadata: Metadata = {
  title: "File Management | Aurai Wind",
  description: "Manage and track project files and documentation",
}

export default function FilesPage() {
  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">File Management</h1>
          <p className="text-muted-foreground mt-2">
            Upload, manage and track project documentation
          </p>
        </div>
        <FileUploadButton />
      </div>

      <Separator />

      <Tabs defaultValue="all" className="w-full">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All Files</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="sites">Sites</TabsTrigger>
            <TabsTrigger value="turbines">Turbines</TabsTrigger>
          </TabsList>
          <FileFilters />
        </div>

        <TabsContent value="all" className="mt-6">
          <FileManager category="all" />
        </TabsContent>
        <TabsContent value="projects" className="mt-6">
          <FileManager category="projects" />
        </TabsContent>
        <TabsContent value="sites" className="mt-6">
          <FileManager category="sites" />
        </TabsContent>
        <TabsContent value="turbines" className="mt-6">
          <FileManager category="turbines" />
        </TabsContent>
      </Tabs>
    </div>
  )
} 