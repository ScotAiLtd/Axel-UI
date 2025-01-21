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

export function SiteFilters() {
  return (
    <div className="flex items-center gap-4">
      <div className="relative w-64">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search sites..." className="pl-8" />
      </div>
      
      <Select defaultValue="all">
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Location" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Locations</SelectItem>
          <SelectItem value="north-sea">North Sea</SelectItem>
          <SelectItem value="baltic-sea">Baltic Sea</SelectItem>
          <SelectItem value="irish-sea">Irish Sea</SelectItem>
        </SelectContent>
      </Select>

      <Select defaultValue="all">
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="operational">Operational</SelectItem>
          <SelectItem value="construction">Under Construction</SelectItem>
          <SelectItem value="maintenance">Maintenance</SelectItem>
        </SelectContent>
      </Select>

      <Select defaultValue="all">
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Capacity" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Capacities</SelectItem>
          <SelectItem value="500-1000">500 - 1000 MW</SelectItem>
          <SelectItem value="1000-1500">1000 - 1500 MW</SelectItem>
          <SelectItem value="1500+">1500+ MW</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="outline" size="icon">
        <SlidersHorizontal className="h-4 w-4" />
      </Button>
    </div>
  )
} 