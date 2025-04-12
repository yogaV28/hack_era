"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sidebar } from "@/components/sidebar"
import { ArrowLeft, Package, MapPin, Weight } from "lucide-react"

export default function PackageDelivery() {
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
                <h1 className="text-2xl font-bold text-gray-900">Package Delivery</h1>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Send a Package</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Pickup Details</h3>

                    <div className="space-y-2">
                      <Label htmlFor="pickup-address">Pickup Address</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="pickup-address"
                          placeholder="Enter pickup address"
                          className="pl-10"
                          defaultValue="123 Main Street, Chennai"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="pickup-date">Pickup Date</Label>
                        <Input id="pickup-date" type="date" defaultValue={new Date().toISOString().split("T")[0]} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pickup-time">Pickup Time</Label>
                        <Input id="pickup-time" type="time" defaultValue={new Date().toTimeString().slice(0, 5)} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Delivery Details</h3>

                    <div className="space-y-2">
                      <Label htmlFor="delivery-address">Delivery Address</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input id="delivery-address" placeholder="Enter delivery address" className="pl-10" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="recipient-name">Recipient Name</Label>
                      <Input id="recipient-name" placeholder="Enter recipient's name" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="recipient-phone">Recipient Phone Number</Label>
                      <Input id="recipient-phone" placeholder="Enter recipient's phone number" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Package Details</h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="package-type">Package Type</Label>
                        <Select defaultValue="document">
                          <SelectTrigger id="package-type">
                            <SelectValue placeholder="Select package type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="document">Document</SelectItem>
                            <SelectItem value="small">Small Package</SelectItem>
                            <SelectItem value="medium">Medium Package</SelectItem>
                            <SelectItem value="large">Large Package</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="weight">Weight (kg)</Label>
                        <div className="relative">
                          <Weight className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="weight"
                            type="number"
                            placeholder="Enter weight in kg"
                            className="pl-10"
                            defaultValue="1"
                            min="0.1"
                            step="0.1"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Package Description</Label>
                      <Textarea id="description" placeholder="Describe your package contents" rows={3} />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Delivery Options</h3>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-purple-100 rounded-full">
                            <Package className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">Standard Delivery</h4>
                            <p className="text-sm text-gray-500">Delivery within 24 hours</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">₹100</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 border border-purple-300 bg-purple-50 rounded-lg hover:bg-purple-100 cursor-pointer">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-purple-200 rounded-full">
                            <Package className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">Express Delivery</h4>
                            <p className="text-sm text-gray-500">Delivery within 3 hours</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">₹200</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex justify-between text-lg font-bold">
                      <p>Total</p>
                      <p>₹200</p>
                    </div>
                  </div>

                  <Button className="w-full" variant="default">
                    Schedule Pickup
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
