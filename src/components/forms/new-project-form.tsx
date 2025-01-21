"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Wind, FileText, MapPin, Building2, Plus, 
  Link2, GitBranch, Upload, CheckCircle2
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface DocumentType {
  id: string
  name: string
  type: string
  required: boolean
  dependencies: string[]
  version: string
  status: 'pending' | 'uploaded' | 'approved'
}

export function NewProjectForm() {
  const router = useRouter()
  const [selectedSection, setSelectedSection] = React.useState<string>("basic")
  const [documents, setDocuments] = React.useState<DocumentType[]>([])

  const sections = [
    { id: "basic", label: "Project Details", icon: Wind, step: 1 },
    { id: "location", label: "Location & Site", icon: MapPin, step: 2 },
    { id: "turbine", label: "Turbine Configuration", icon: Building2, step: 3 },
    { id: "traceability", label: "Traceability", icon: GitBranch, step: 4 },
    { id: "documents", label: "Documentation", icon: FileText, step: 5 },
  ]

  const currentStep = sections.find(s => s.id === selectedSection)?.step || 1
  const isLastStep = currentStep === sections.length

  const handleNext = () => {
    const nextSection = sections.find(s => s.step === currentStep + 1)
    if (nextSection) {
      setSelectedSection(nextSection.id)
    }
  }

  const handlePrevious = () => {
    const prevSection = sections.find(s => s.step === currentStep - 1)
    if (prevSection) {
      setSelectedSection(prevSection.id)
    }
  }

  const addDocument = () => {
    const newDoc: DocumentType = {
      id: `doc-${documents.length + 1}`,
      name: "",
      type: "",
      required: true,
      dependencies: [],
      version: "1.0.0",
      status: 'pending'
    }
    setDocuments([...documents, newDoc])
  }

  return (
    <div className="grid grid-cols-12 gap-6">
      
      <div className="col-span-3 space-y-4">
        {sections.map((section) => {
          const Icon = section.icon
          const isActive = selectedSection === section.id
          const isCompleted = section.step < currentStep
          
          return (
            <Card
              key={section.id}
              className={cn(
                "cursor-pointer transition-all hover:shadow-md relative",
                isActive
                  ? "border-primary bg-primary/5"
                  : isCompleted
                  ? "border-primary/30 hover:border-primary/50"
                  : "hover:border-primary/50"
              )}
              onClick={() => setSelectedSection(section.id)}
            >
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : isCompleted
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground"
                  )}>
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      section.step
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium">{section.label}</span>
                    <span className="text-xs text-muted-foreground">
                      Step {section.step} of {sections.length}
                    </span>
                  </div>
                </div>
                <Icon className={cn(
                  "h-5 w-5",
                  isActive ? "text-primary" : "text-muted-foreground"
                )} />
              </CardContent>
            </Card>
          )
        })}
      </div>

     
      <div className="col-span-9">
        <Card className="border-2">
          <CardContent className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {selectedSection === "basic" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="projectName">Project Name</Label>
                        <Input id="projectName" placeholder="Enter project name" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="projectId">Project ID</Label>
                        <Input id="projectId" placeholder="Enter project ID" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Enter project description"
                        className="min-h-[100px]"
                      />
                    </div>
                  </div>
                )}

                {selectedSection === "location" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="site">Site</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select site" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="site1">Site Alpha</SelectItem>
                            <SelectItem value="site2">Site Beta</SelectItem>
                            <SelectItem value="site3">Site Gamma</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="platform">Platform</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select platform" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="platform1">Platform A</SelectItem>
                            <SelectItem value="platform2">Platform B</SelectItem>
                            <SelectItem value="platform3">Platform C</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="latitude">Latitude</Label>
                        <Input id="latitude" placeholder="Enter latitude" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="longitude">Longitude</Label>
                        <Input id="longitude" placeholder="Enter longitude" />
                      </div>
                    </div>
                  </div>
                )}

                {selectedSection === "turbine" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="turbineType">Turbine Type</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select turbine type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="type1">Type A-100</SelectItem>
                            <SelectItem value="type2">Type B-200</SelectItem>
                            <SelectItem value="type3">Type C-300</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="capacity">Capacity (MW)</Label>
                        <Input id="capacity" type="number" placeholder="Enter capacity" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="specifications">Technical Specifications</Label>
                      <Textarea
                        id="specifications"
                        placeholder="Enter technical specifications"
                        className="min-h-[100px]"
                      />
                    </div>
                  </div>
                )}

                {selectedSection === "traceability" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="serialNumber">Serial Number</Label>
                        <Input 
                          id="serialNumber" 
                          placeholder="Enter turbine serial number"
                          className="font-mono"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="workOrder">Work Order Number</Label>
                        <Input 
                          id="workOrder" 
                          placeholder="Enter work order number"
                          className="font-mono"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="partNumber">Part Number</Label>
                        <Input 
                          id="partNumber" 
                          placeholder="Enter part number"
                          className="font-mono"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="purchaseOrder">Purchase Order Number</Label>
                        <Input 
                          id="purchaseOrder" 
                          placeholder="Enter PO number"
                          className="font-mono"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="uniqueId">Unique Identifier</Label>
                      <Input 
                        id="uniqueId" 
                        placeholder="Enter unique identifier"
                        className="font-mono"
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        This unique ID will be used for tracking throughout the system
                      </p>
                    </div>
                  </div>
                )}

                {selectedSection === "documents" && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <Label className="text-lg">Required Documents</Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          Configure document requirements and dependencies
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addDocument}
                        className="flex items-center gap-2"
                      >
                        <Plus className="h-4 w-4" /> Add Document
                      </Button>
                    </div>
                    <ScrollArea className="h-[400px] pr-4">
                      <div className="space-y-4">
                        {documents.map((doc, index) => (
                          <Card key={doc.id} className="p-4">
                            <div className="space-y-4">
                              <div className="flex justify-between items-start">
                                <div className="space-y-4 flex-1">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label>Document Name</Label>
                                      <Input placeholder="Enter document name" />
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Document Type</Label>
                                      <Select>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="technical">Technical Specification</SelectItem>
                                          <SelectItem value="compliance">Compliance Document</SelectItem>
                                          <SelectItem value="certification">Certification</SelectItem>
                                          <SelectItem value="maintenance">Maintenance Guide</SelectItem>
                                          <SelectItem value="safety">Safety Protocol</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Dependencies</Label>
                                    <Select>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select dependencies" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {documents
                                          .filter(d => d.id !== doc.id)
                                          .map(d => (
                                            <SelectItem key={d.id} value={d.id}>
                                              {d.name || `Document ${d.id}`}
                                            </SelectItem>
                                          ))
                                        }
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                <div className="flex flex-col items-end gap-2 ml-4">
                                  <Badge variant="outline">
                                    v{doc.version}
                                  </Badge>
                                  <Badge variant="secondary">
                                    {doc.status}
                                  </Badge>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 pt-2 border-t">
                                <Button variant="outline" size="sm" className="w-full">
                                  <Upload className="h-4 w-4 mr-2" />
                                  Upload Document
                                </Button>
                                <Button variant="outline" size="sm" className="w-full">
                                  <Link2 className="h-4 w-4 mr-2" />
                                  Link External
                                </Button>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-between items-center gap-4 mt-8 pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                Step {currentStep} of {sections.length}
              </div>
              <div className="flex gap-4">
                {currentStep > 1 && (
                  <Button 
                    variant="outline" 
                    onClick={handlePrevious}
                  >
                    Previous
                  </Button>
                )}
                {!isLastStep ? (
                  <Button 
                    className="min-w-[100px]"
                    onClick={handleNext}
                  >
                    Next
                  </Button>
                ) : (
                  <Button 
                    className="min-w-[150px]"
                    onClick={() => {
                 
                      console.log("Creating project...")
                    }}
                  >
                    Create Project
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 