"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, SlidersHorizontal } from "lucide-react"

export function TurbineFilters() {
  return (
    <div className="flex items-center gap-4">
      <div className="relative w-64">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search turbines..." className="pl-8" />
      </div>
      
      <Select defaultValue="all">
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Manufacturer" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Manufacturers</SelectItem>
          <SelectItem value="aurai">Aurai Wind</SelectItem>
          <SelectItem value="vestas">Vestas</SelectItem>
          <SelectItem value="siemens">Siemens Gamesa</SelectItem>
        </SelectContent>
      </Select>

      <Select defaultValue="all">
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Power Capacity" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Capacities</SelectItem>
          <SelectItem value="2-3">2.0 - 3.0 MW</SelectItem>
          <SelectItem value="3-4">3.0 - 4.0 MW</SelectItem>
          <SelectItem value="4-5">4.0 - 5.0 MW</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="outline" size="icon">
        <SlidersHorizontal className="h-4 w-4" />
      </Button>
    </div>
  )
} 