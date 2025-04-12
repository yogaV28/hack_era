"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Home, AlertCircle, Car, ShoppingBag, Package, Settings, User, LogOut, Menu, X } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"

export function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const isMobile = useMobile()
  const [isOpen, setIsOpen] = useState(false)

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const navigate = (path: string) => {
    router.push(path)
    if (isMobile) {
      setIsOpen(false)
    }
  }

  const sidebarItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: AlertCircle, label: "Emergency", path: "/emergency" },
    { icon: Car, label: "Ride", path: "/ride" },
    { icon: ShoppingBag, label: "Grocery", path: "/grocery" },
    { icon: Package, label: "Package", path: "/package" },
    { icon: Settings, label: "Settings", path: "/settings" },
    { icon: User, label: "Profile", path: "/profile" },
  ]

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="p-4 flex items-center justify-center">
        <h1 className="text-xl font-bold text-red-600">Emergency App</h1>
        {isMobile && (
          <Button variant="ghost" size="icon" className="ml-auto" onClick={toggleSidebar}>
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      <div className="flex-1 px-3 py-4 space-y-1">
        {sidebarItems.map((item) => (
          <Button
            key={item.path}
            variant="ghost"
            className={cn("w-full justify-start", pathname === item.path && "bg-gray-100")}
            onClick={() => navigate(item.path)}
          >
            <item.icon className="h-5 w-5 mr-3" />
            {item.label}
          </Button>
        ))}
      </div>

      <div className="p-4">
        <Button variant="ghost" className="w-full justify-start text-red-600" onClick={() => navigate("/login")}>
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </Button>
      </div>
    </div>
  )

  if (isMobile) {
    return (
      <>
        <Button variant="ghost" size="icon" className="fixed top-3 left-3 z-50" onClick={toggleSidebar}>
          <Menu className="h-5 w-5" />
        </Button>

        {isOpen && <div className="fixed inset-0 z-40 bg-black/50" onClick={toggleSidebar} />}

        <div
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out",
            isOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          {sidebarContent}
        </div>
      </>
    )
  }

  return <div className="hidden md:block w-64 bg-white border-r border-gray-200">{sidebarContent}</div>
}
