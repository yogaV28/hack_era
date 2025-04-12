"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sidebar } from "@/components/sidebar"
import { AlertCircle, Car, ShoppingBag, Package, Bell, User } from "lucide-react"

export default function Dashboard() {
  const router = useRouter()
  const [notifications, setNotifications] = useState(3)

  const handleEmergencyClick = () => {
    router.push("/emergency")
  }

  const handleRideClick = () => {
    router.push("/ride")
  }

  const handleGroceryClick = () => {
    router.push("/grocery")
  }

  const handlePackageClick = () => {
    router.push("/package")
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Bell className="h-6 w-6 text-gray-500" />
                  {notifications > 0 && (
                    <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
                      {notifications}
                    </span>
                  )}
                </div>
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="h-5 w-5 text-gray-500" />
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card
                className="hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-red-50 to-red-100 border-red-200"
                onClick={handleEmergencyClick}
              >
                <CardContent className="p-6 flex flex-col items-center justify-center space-y-4">
                  <div className="p-4 bg-red-500 rounded-full">
                    <AlertCircle className="h-10 w-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-red-700">Emergency</h2>
                  <p className="text-center text-gray-600">
                    Request immediate medical assistance for critical situations
                  </p>
                  <Button variant="destructive" className="w-full">
                    Get Help Now
                  </Button>
                </CardContent>
              </Card>

              <Card
                className="hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200"
                onClick={handleRideClick}
              >
                <CardContent className="p-6 flex flex-col items-center justify-center space-y-4">
                  <div className="p-4 bg-blue-500 rounded-full">
                    <Car className="h-10 w-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-blue-700">Ride</h2>
                  <p className="text-center text-gray-600">Book a ride to your destination safely and quickly</p>
                  <Button variant="outline" className="w-full border-blue-500 text-blue-700 hover:bg-blue-50">
                    Book Ride
                  </Button>
                </CardContent>
              </Card>

              <Card
                className="hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-green-50 to-green-100 border-green-200"
                onClick={handleGroceryClick}
              >
                <CardContent className="p-6 flex flex-col items-center justify-center space-y-4">
                  <div className="p-4 bg-green-500 rounded-full">
                    <ShoppingBag className="h-10 w-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-green-700">Grocery</h2>
                  <p className="text-center text-gray-600">Order groceries and essentials delivered to your doorstep</p>
                  <Button variant="outline" className="w-full border-green-500 text-green-700 hover:bg-green-50">
                    Shop Now
                  </Button>
                </CardContent>
              </Card>

              <Card
                className="hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200"
                onClick={handlePackageClick}
              >
                <CardContent className="p-6 flex flex-col items-center justify-center space-y-4">
                  <div className="p-4 bg-purple-500 rounded-full">
                    <Package className="h-10 w-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-purple-700">Package</h2>
                  <p className="text-center text-gray-600">
                    Send and receive packages with our reliable delivery service
                  </p>
                  <Button variant="outline" className="w-full border-purple-500 text-purple-700 hover:bg-purple-50">
                    Send Package
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
