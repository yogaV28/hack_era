"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { Sidebar } from "@/components/sidebar"
import { Upload, AlertCircle, MapPin, Ambulance, ArrowLeft } from "lucide-react"
import WebcamCapture from "@/components/webcam-capture"
import EmergencyMap from "@/components/emergency-map"

export default function Emergency() {
  const router = useRouter()
  const { toast } = useToast()
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const [result, setResult] = useState<{
    emergency_type: string
    confidence: number
    inference_time: number
  } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [ambulanceType, setAmbulanceType] = useState<string>("")
  const [ambulanceETA, setAmbulanceETA] = useState<number>(0)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    setResult(null)
    setShowMap(false)

    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    // Check if file is an image
    if (!selectedFile.type.startsWith("image/")) {
      setError("Please select an image file")
      return
    }

    setFile(selectedFile)

    // Create preview
    const reader = new FileReader()
    reader.onload = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(selectedFile)
  }

  const handleWebcamCapture = (imageSrc: string) => {
    setError(null)
    setResult(null)
    setShowMap(false)
    setPreview(imageSrc)

    // Convert base64 to blob
    fetch(imageSrc)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], "webcam-capture.jpg", { type: "image/jpeg" })
        setFile(file)
      })
  }

  const handleAnalyze = async () => {
    if (!file) {
      setError("Please select or capture an image first")
      return
    }

    setAnalyzing(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("image", file)

      // Replace with your Flask backend URL
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`)
      }

      const data = await response.json()
      setResult(data)

      // Determine ambulance type based on emergency
      let ambulanceType = "Basic Ambulance"

      switch (data.emergency_type) {
        case "blood-loss":
          ambulanceType = "Advanced Life Support Ambulance"
          setAmbulanceETA(5)
          break
        case "fire-burn":
          ambulanceType = "Burn Specialty Ambulance"
          setAmbulanceETA(7)
          break
        case "poison":
          ambulanceType = "Medical Emergency Ambulance"
          setAmbulanceETA(6)
          break
        case "normal-faint":
          ambulanceType = "Basic Life Support Ambulance"
          setAmbulanceETA(4)
          break
        default:
          setAmbulanceETA(8)
      }

      setAmbulanceType(ambulanceType)

      toast({
        title: "Analysis Complete",
        description: `Detected: ${formatEmergencyType(data.emergency_type)}`,
      })

      // Show loading animation before showing map
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
        setShowMap(true)
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to analyze image",
      })
    } finally {
      setAnalyzing(false)
    }
  }

  const formatEmergencyType = (type: string) => {
    return type
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  const getEmergencyColor = (type: string) => {
    switch (type) {
      case "blood-loss":
        return "bg-red-500"
      case "fire-burn":
        return "bg-orange-500"
      case "poison":
        return "bg-green-500"
      case "normal-faint":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

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
                <h1 className="text-2xl font-bold text-gray-900">Emergency Assistance</h1>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {!showMap ? (
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Upload Emergency Image</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="upload">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="upload">Upload</TabsTrigger>
                        <TabsTrigger value="camera">Camera</TabsTrigger>
                      </TabsList>

                      <TabsContent value="upload">
                        <div className="space-y-4">
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                            <input
                              type="file"
                              id="image-upload"
                              accept="image/*"
                              onChange={handleFileChange}
                              className="hidden"
                            />
                            <label htmlFor="image-upload" className="cursor-pointer block">
                              <Upload className="mx-auto h-12 w-12 text-gray-400" />
                              <p className="mt-2 text-sm text-gray-500">Click to upload or drag and drop</p>
                              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                            </label>
                          </div>

                          <Button
                            onClick={handleAnalyze}
                            className="w-full"
                            disabled={!file || analyzing}
                            variant="destructive"
                          >
                            {analyzing ? "Analyzing..." : "Analyze Emergency"}
                          </Button>
                        </div>
                      </TabsContent>

                      <TabsContent value="camera">
                        <WebcamCapture onCapture={handleWebcamCapture} />
                        <Button
                          onClick={handleAnalyze}
                          className="w-full mt-4"
                          disabled={!file || analyzing}
                          variant="destructive"
                        >
                          {analyzing ? "Analyzing..." : "Analyze Emergency"}
                        </Button>
                      </TabsContent>
                    </Tabs>

                    {analyzing && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-500 mb-2">Analyzing emergency situation...</p>
                        <Progress value={50} className="h-2" />
                      </div>
                    )}

                    {error && (
                      <Alert variant="destructive" className="mt-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Preview & Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {preview ? (
                        <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-gray-200">
                          <img
                            src={preview || "/placeholder.svg"}
                            alt="Preview"
                            className="object-contain w-full h-full"
                          />
                        </div>
                      ) : (
                        <div className="aspect-video w-full bg-gray-100 rounded-lg flex items-center justify-center">
                          <p className="text-gray-400">No image selected</p>
                        </div>
                      )}

                      {result && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">Emergency Type:</h3>
                            <span
                              className={`px-3 py-1 rounded-full text-white ${getEmergencyColor(result.emergency_type)}`}
                            >
                              {formatEmergencyType(result.emergency_type)}
                            </span>
                          </div>

                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Confidence:</span>
                              <span className="text-sm font-medium">{(result.confidence * 100).toFixed(2)}%</span>
                            </div>
                            <Progress value={result.confidence * 100} className="h-2" />
                          </div>

                          <p className="text-sm text-gray-500">
                            Inference time: {result.inference_time.toFixed(3)} seconds
                          </p>

                          <div className="pt-2 border-t border-gray-200">
                            <h3 className="font-medium mb-2">Recommended Response:</h3>
                            <p className="text-sm font-medium">{ambulanceType}</p>

                            {loading ? (
                              <div className="mt-4">
                                <p className="text-sm text-gray-500 mb-2">Locating nearest ambulance...</p>
                                <Progress value={75} className="h-2" />
                              </div>
                            ) : (
                              <Button className="w-full mt-4" variant="destructive" onClick={() => setShowMap(true)}>
                                Request Emergency Assistance
                              </Button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="w-full">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Emergency Response</CardTitle>
                    <Button variant="outline" size="sm" onClick={() => setShowMap(false)}>
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div
                          className={`w-3 h-3 rounded-full ${getEmergencyColor(result?.emergency_type || "")} mr-2`}
                        ></div>
                        <h3 className="font-medium">{formatEmergencyType(result?.emergency_type || "")}</h3>
                      </div>
                      <span className="text-sm bg-red-100 text-red-800 px-2 py-1 rounded-full">
                        ETA: {ambulanceETA} min
                      </span>
                    </div>

                    <div className="h-[400px] w-full rounded-lg overflow-hidden border border-gray-200">
                      <EmergencyMap emergencyType={result?.emergency_type || ""} ambulanceType={ambulanceType} />
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-start space-x-4">
                        <div className="p-2 bg-red-100 rounded-full">
                          <Ambulance className="h-6 w-6 text-red-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">{ambulanceType}</h4>
                          <p className="text-sm text-gray-500">License: TN 01 AB 1234</p>
                          <p className="text-sm text-gray-500">Driver: Rajesh K. | Contact: +91 98765 43210</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-start space-x-4">
                        <div className="p-2 bg-blue-100 rounded-full">
                          <MapPin className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">Your Location</h4>
                          <p className="text-sm text-gray-500">123 Main Street, Chennai, Tamil Nadu</p>
                          <p className="text-sm text-gray-500">Landmark: Near Central Park</p>
                        </div>
                      </div>
                    </div>

                    <Button className="w-full" variant="destructive">
                      Call Emergency Helpline (108)
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
