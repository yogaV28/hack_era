"use client"

import type React from "react"

import { useState } from "react"
import { Upload, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import WebcamCapture from "@/components/webcam-capture"

export default function Home() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    emergency_type: string
    confidence: number
    inference_time: number
  } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    setResult(null)

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
    setPreview(imageSrc)

    // Convert base64 to blob
    fetch(imageSrc)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], "webcam-capture.jpg", { type: "image/jpeg" })
        setFile(file)
      })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      setError("Please select an image first")
      return
    }

    setLoading(true)
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

      toast({
        title: "Analysis Complete",
        description: `Detected: ${formatEmergencyType(data.emergency_type)}`,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to analyze image",
      })
    } finally {
      setLoading(false)
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
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Emergency Situation Classifier</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Upload Image</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="upload">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload">Upload</TabsTrigger>
                <TabsTrigger value="camera">Camera</TabsTrigger>
              </TabsList>

              <TabsContent value="upload">
                <form onSubmit={handleSubmit} className="space-y-4">
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

                  <Button type="submit" className="w-full" disabled={!file || loading}>
                    {loading ? "Analyzing..." : "Analyze Image"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="camera">
                <WebcamCapture onCapture={handleWebcamCapture} />
                <Button onClick={handleSubmit} className="w-full mt-4" disabled={!file || loading}>
                  {loading ? "Analyzing..." : "Analyze Image"}
                </Button>
              </TabsContent>
            </Tabs>

            {loading && (
              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-2">Analyzing image...</p>
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

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Preview & Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {preview ? (
                <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-gray-200">
                  <img src={preview || "/placeholder.svg"} alt="Preview" className="object-contain w-full h-full" />
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
                    <span className={`px-3 py-1 rounded-full text-white ${getEmergencyColor(result.emergency_type)}`}>
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

                  <p className="text-sm text-gray-500">Inference time: {result.inference_time.toFixed(3)} seconds</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>About This Tool</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              This emergency situation classifier uses machine learning to identify potential emergency situations from
              images. The system can detect four types of emergencies:
            </p>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                <span>Blood Loss</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                <span>Normal Faint</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                <span>Poison</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                <span>Fire Burn</span>
              </li>
            </ul>
            <p className="mt-4 text-gray-600">
              <strong>Note:</strong> This tool is for demonstration purposes only and should not replace professional
              medical advice or emergency services. In case of a real emergency, please call your local emergency number
              immediately.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
