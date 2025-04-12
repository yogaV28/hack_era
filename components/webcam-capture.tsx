"use client"

import { useState, useRef, useCallback } from "react"
import Webcam from "react-webcam"
import { Button } from "@/components/ui/button"
import { Camera, RefreshCw } from "lucide-react"

interface WebcamCaptureProps {
  onCapture: (imageSrc: string) => void
}

export default function WebcamCapture({ onCapture }: WebcamCaptureProps) {
  const webcamRef = useRef<Webcam>(null)
  const [isCaptured, setIsCaptured] = useState(false)

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot()
      if (imageSrc) {
        onCapture(imageSrc)
        setIsCaptured(true)
      }
    }
  }, [onCapture])

  const retake = useCallback(() => {
    setIsCaptured(false)
  }, [])

  const videoConstraints = {
    width: 720,
    height: 480,
    facingMode: "user",
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-gray-200 bg-black">
        {!isCaptured ? (
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            className="w-full h-full object-contain"
          />
        ) : (
          <img src={webcamRef.current?.getScreenshot() || ""} alt="Captured" className="w-full h-full object-contain" />
        )}
      </div>

      <div className="flex justify-center">
        {!isCaptured ? (
          <Button onClick={capture} className="flex items-center gap-2">
            <Camera className="h-4 w-4" />
            Capture Photo
          </Button>
        ) : (
          <Button onClick={retake} variant="outline" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Retake Photo
          </Button>
        )}
      </div>
    </div>
  )
}
