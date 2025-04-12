"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sidebar } from "@/components/sidebar"
import { ArrowLeft, MapPin, Car } from "lucide-react"

export default function Ride() {
  const router = useRouter()

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")} className="mr-2">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-2xl font-bold text-gray-900">Book a Ride</h1>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Enter Ride Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="pickup">Pickup Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="pickup"
                        placeholder="Enter your pickup location"
                        className="pl-10"
                        defaultValue="Current Location"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="destination">Destination</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input id="destination" placeholder="Enter your destination" className="pl-10" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Date</Label>
                      <Input id="date" type="date" defaultValue={new Date().toISOString().split("T")[0]} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">Time</Label>
                      <Input id="time" type="time" defaultValue={new Date().toTimeString().slice(0, 5)} />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="font-medium mb-4">Available Vehicles</h3>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-100 rounded-full">
                            <Car className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">Standard</h4>
                            <p className="text-sm text-gray-500">Comfortable ride for 4</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">₹250</p>
                          <p className="text-sm text-gray-500">10 mins away</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-green-100 rounded-full">
                            <Car className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">Premium</h4>
                            <p className="text-sm text-gray-500">Luxury ride for 4</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">₹350</p>
                          <p className="text-sm text-gray-500">5 mins away</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-purple-100 rounded-full">
                            <Car className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">XL</h4>
                            <p className="text-sm text-gray-500">Spacious ride for 6</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">₹450</p>
                          <p className="text-sm text-gray-500">12 mins away</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full mt-4" variant="default">
                    Book Ride
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
