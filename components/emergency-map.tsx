"use client"

import { useEffect, useRef, useState } from "react"
import { Loader } from "lucide-react"

interface EmergencyMapProps {
  emergencyType: string
  ambulanceType: string
}

export default function EmergencyMap({ emergencyType, ambulanceType }: EmergencyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(true)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

  // Simulate map loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
      // Default to Chennai coordinates
      setUserLocation({ lat: 13.0827, lng: 80.2707 })
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!loading && mapRef.current && userLocation) {
      // This would be replaced with actual map implementation
      // like Google Maps or Mapbox in a production environment
      renderSimulatedMap()
    }
  }, [loading, userLocation])

  const renderSimulatedMap = () => {
    if (!mapRef.current) return

    const mapElement = mapRef.current
    mapElement.innerHTML = ""

    // Create simulated map
    const mapContainer = document.createElement("div")
    mapContainer.className = "relative w-full h-full bg-gray-100"

    // Add map elements
    const mapImage = document.createElement("div")
    mapImage.className = "absolute inset-0 bg-gray-200"
    mapImage.style.backgroundImage = "url('/placeholder.svg?height=400&width=800')"
    mapImage.style.backgroundSize = "cover"
    mapImage.style.opacity = "0.7"

    // Add roads
    const roads = document.createElement("div")
    roads.className = "absolute inset-0"

    // Horizontal road
    const hRoad = document.createElement("div")
    hRoad.className = "absolute h-4 bg-gray-400 left-0 right-0 top-1/2 transform -translate-y-1/2"
    roads.appendChild(hRoad)

    // Vertical road
    const vRoad = document.createElement("div")
    vRoad.className = "absolute w-4 bg-gray-400 top-0 bottom-0 left-1/2 transform -translate-x-1/2"
    roads.appendChild(vRoad)

    // Add user marker
    const userMarker = document.createElement("div")
    userMarker.className =
      "absolute w-6 h-6 bg-blue-500 rounded-full border-2 border-white transform -translate-x-1/2 -translate-y-1/2 z-10"
    userMarker.style.left = "50%"
    userMarker.style.top = "50%"

    // Add ambulance marker
    const ambulanceMarker = document.createElement("div")
    ambulanceMarker.className =
      "absolute w-6 h-6 bg-red-500 rounded-full border-2 border-white transform -translate-x-1/2 -translate-y-1/2 animate-pulse z-10"
    ambulanceMarker.style.left = "30%"
    ambulanceMarker.style.top = "30%"

    // Add route line
    const routeLine = document.createElement("div")
    routeLine.className = "absolute h-1 bg-red-400 origin-left transform rotate-45 z-5"
    routeLine.style.width = "28%"
    routeLine.style.left = "30%"
    routeLine.style.top = "30%"

    // Add elements to map
    mapContainer.appendChild(mapImage)
    mapContainer.appendChild(roads)
    mapContainer.appendChild(routeLine)
    mapContainer.appendChild(userMarker)
    mapContainer.appendChild(ambulanceMarker)

    // Add legend
    const legend = document.createElement("div")
    legend.className = "absolute bottom-4 left-4 bg-white p-2 rounded-md shadow-md text-xs"
    legend.innerHTML = `
      <div class="flex items-center mb-1">
        <div class="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
        <span>Your Location</span>
      </div>
      <div class="flex items-center">
        <div class="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
        <span>${ambulanceType}</span>
      </div>
    `
    mapContainer.appendChild(legend)

    mapElement.appendChild(mapContainer)
  }

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center">
          <Loader className="h-8 w-8 animate-spin text-red-500 mb-2" />
          <p className="text-gray-500">Loading map...</p>
        </div>
      </div>
    )
  }

  return <div ref={mapRef} className="h-full w-full"></div>
}
