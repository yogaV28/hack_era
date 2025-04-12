"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Sidebar } from "@/components/sidebar"
import { ArrowLeft, Search, ShoppingBag, Plus, Minus } from "lucide-react"
import { useState } from "react"

const groceryItems = [
  { id: 1, name: "Rice (5kg)", price: 350, image: "/placeholder.svg?height=80&width=80", category: "Staples" },
  { id: 2, name: "Wheat Flour (1kg)", price: 60, image: "/placeholder.svg?height=80&width=80", category: "Staples" },
  { id: 3, name: "Tomatoes (1kg)", price: 40, image: "/placeholder.svg?height=80&width=80", category: "Vegetables" },
  { id: 4, name: "Onions (1kg)", price: 35, image: "/placeholder.svg?height=80&width=80", category: "Vegetables" },
  { id: 5, name: "Milk (1L)", price: 60, image: "/placeholder.svg?height=80&width=80", category: "Dairy" },
  { id: 6, name: "Eggs (12)", price: 80, image: "/placeholder.svg?height=80&width=80", category: "Dairy" },
  { id: 7, name: "Chicken (1kg)", price: 220, image: "/placeholder.svg?height=80&width=80", category: "Meat" },
  { id: 8, name: "Apples (1kg)", price: 180, image: "/placeholder.svg?height=80&width=80", category: "Fruits" },
]

export default function Grocery() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [cart, setCart] = useState<{ id: number; quantity: number }[]>([])

  const addToCart = (id: number) => {
    const existingItem = cart.find((item) => item.id === id)
    if (existingItem) {
      setCart(cart.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item)))
    } else {
      setCart([...cart, { id, quantity: 1 }])
    }
  }

  const removeFromCart = (id: number) => {
    const existingItem = cart.find((item) => item.id === id)
    if (existingItem && existingItem.quantity > 1) {
      setCart(cart.map((item) => (item.id === id ? { ...item, quantity: item.quantity - 1 } : item)))
    } else {
      setCart(cart.filter((item) => item.id !== id))
    }
  }

  const getItemQuantity = (id: number) => {
    const item = cart.find((item) => item.id === id)
    return item ? item.quantity : 0
  }

  const filteredItems = groceryItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const totalAmount = cart.reduce((total, cartItem) => {
    const item = groceryItems.find((i) => i.id === cartItem.id)
    return total + (item ? item.price * cartItem.quantity : 0)
  }, 0)

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
                <h1 className="text-2xl font-bold text-gray-900">Grocery Delivery</h1>
              </div>
              <div className="flex items-center">
                <div className="relative">
                  <ShoppingBag className="h-6 w-6 text-gray-500" />
                  {cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-green-500 rounded-full flex items-center justify-center text-xs text-white">
                      {cart.reduce((total, item) => total + item.quantity, 0)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search for groceries..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredItems.map((item) => (
                    <Card key={item.id} className="overflow-hidden">
                      <div className="flex p-4">
                        <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="ml-4 flex-1">
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-gray-500">{item.category}</p>
                          <div className="mt-2 flex justify-between items-center">
                            <p className="font-medium">₹{item.price}</p>

                            {getItemQuantity(item.id) > 0 ? (
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => removeFromCart(item.id)}
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <span>{getItemQuantity(item.id)}</span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => addToCart(item.id)}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <Button variant="outline" size="sm" onClick={() => addToCart(item.id)}>
                                Add
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="md:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Cart</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {cart.length === 0 ? (
                      <div className="text-center py-8">
                        <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">Your cart is empty</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {cart.map((cartItem) => {
                          const item = groceryItems.find((i) => i.id === cartItem.id)
                          if (!item) return null

                          return (
                            <div key={cartItem.id} className="flex justify-between items-center">
                              <div className="flex items-center">
                                <div className="w-10 h-10 bg-gray-100 rounded-md overflow-hidden mr-3">
                                  <img
                                    src={item.image || "/placeholder.svg"}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div>
                                  <p className="font-medium">{item.name}</p>
                                  <p className="text-sm text-gray-500">
                                    ₹{item.price} × {cartItem.quantity}
                                  </p>
                                </div>
                              </div>
                              <p className="font-medium">₹{item.price * cartItem.quantity}</p>
                            </div>
                          )
                        })}

                        <div className="pt-4 mt-4 border-t border-gray-200">
                          <div className="flex justify-between">
                            <p>Subtotal</p>
                            <p className="font-medium">₹{totalAmount}</p>
                          </div>
                          <div className="flex justify-between mt-2">
                            <p>Delivery Fee</p>
                            <p className="font-medium">₹40</p>
                          </div>
                          <div className="flex justify-between mt-2 text-lg font-bold">
                            <p>Total</p>
                            <p>₹{totalAmount + 40}</p>
                          </div>
                        </div>

                        <Button className="w-full mt-4" variant="default">
                          Proceed to Checkout
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
