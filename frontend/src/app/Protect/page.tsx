'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/Components/buttons'
import { Dropzone, FileInputButton, FileMosaic } from "@files-ui/react"
import axios from 'axios'
import Loading from "@/Components/Loading"
import { Sun, Moon } from 'lucide-react'
import Link from 'next/link'

export default function ProtectPage() {
  const [files, setFiles] = useState<any>([])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const [theme, setTheme] = useState('dark')
  const [showNavbar, setShowNavbar] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      setShowNavbar(window.scrollY === 0)
    } 

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    document.body.className = theme
  }, [theme])

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark')
  }

  const updateFiles = (incomingFiles: any) => {
    setFiles(incomingFiles)
  }

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = error => reject(error)
    })
  }

  const uploadFiles = async () => {
    if (files.length === 0) {
      console.error("No file selected.")
      return
    }

    setLoading(true)
    const file = files[0].file
    const fileType = file.type

    try {
      if (fileType.startsWith("image/")) {
        const base64 = await convertToBase64(file)
        const payload = JSON.stringify({ prompt: base64.split("base64,")[1] })
        const response = await axios.post(
          "https://api.cortex.cerebrium.ai/v4/p-5df54339/image-protection/predict",
          payload,
          {
            headers: {
              Authorization:"Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJwcm9qZWN0SWQiOiJwLTVkZjU0MzM5IiwiaWF0IjoxNzI2MjA4NzMzLCJleHAiOjIwNDE3ODQ3MzN9.SumfL0n6IbbaX5j7z4X1l7_w5QBWZnYYxImVcFf4QUlGFmZ3KYJoPY5GcEopAzY04TSb--zg3e_zFZSMxSBBW_Fu0jjQXaNg_MUshkLxPkj9uBPRoRzGMUeX7lzMG7VOKMUhtuKa7neJ7C2q8uVQtkLWNaF65Q4PWNSwa8g5XP8qLzbuL2pmmGZGYH7jVx1jkwoLHh792xuE_wP9DfLqCgDtxwiQH9xYsGTzO5idOecv_ARCSyNK6zAgleelm22UMl8u-LMRumsK8rfDN7KHrEoYxuW1LhikCq3NvWgR9SSGuVSli1RMuSU9bQJqPz8jhm_4r7gAcPBqrfxmqrZVvw",
        Accept: "application/json",

            },
          }
        )
        const imageData = response.data?.result
        downloadFile(imageData, "protected_image.png", "image/png")
      } else {
        const formData = new FormData()
        formData.append("file", file)
        const response = await axios({
          url: "https://jubilant-succotash-wq5r54pjggxcg7r9-5000.app.github.dev/protect_audio",
          method: "POST",
          responseType: "blob",
          data: formData,
        })
        downloadFile(response.data, "protected_audio.mp3", "audio/mpeg")
      }
    } catch (error) {
      console.error("Error uploading file:", error)
    } finally {
      setLoading(false)
    }
    try {
      if (file.type.startsWith("video/")) {
        const formData = new FormData()
        formData.append("file", file)
        const response = await axios.post(
          "https://jubilant-succotash-wq5r54pjggxcg7r9-5000.app.github.dev/protect_video",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        setResult(response.data)
      }
    } catch (error) {
      console.error("Error:", error)
      setResult("Error occurred during Protection")
    } finally {
      setLoading(false)
    }
  }

  const downloadFile = (data: any, fileName: string, fileType: string) => {
    const blob = new Blob([data], { type: fileType })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <header className={`fixed top-0 left-0 right-0 z-50 ${theme === 'dark' ? 'bg-black/50' : 'bg-white/50'} backdrop-blur-md transition-transform duration-300 ${showNavbar ? 'translate-y-0' : '-translate-y-full'}`}>
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/">
            <img src="/images/Logo.png" alt="guard.ai logo" className="h-8" />
          </Link>
          <div className="flex space-x-6 items-center">
            <Link href="/" className="text-sm font-medium hover:text-blue-400 transition-colors">Home</Link>
            <Link href="/Detect" className="text-sm font-medium hover:text-blue-400 transition-colors">Detect</Link>
            <Button variant="ghost" onClick={toggleTheme} className="p-2">
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h1 className="text-4xl font-bold mb-6">AI Protection</h1>
          <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-8`}>
            Drop or paste your image, audio, or video below to protect from deepfake
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`max-w-3xl mx-auto p-8 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}
        >
          <Dropzone
            maxFiles={1}
            onChange={updateFiles}
            value={files}
            className={`w-full h-64 border-2 border-dashed rounded-lg ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'} flex items-center justify-center`}
          >
            {files.map((file: any, idx: number) => (
              <FileMosaic key={idx} {...file} preview />
            ))}
            {files.length === 0 && (
              <p className={`text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Drag and drop files here or click to select
              </p>
            )}
          </Dropzone>
          <div className="flex justify-between mt-4">
            <FileInputButton
              maxFiles={1}
              onChange={updateFiles}
              value={files}
              className={`px-4 py-2 rounded ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-colors`}
            >
              Select File
            </FileInputButton>
            {files.length === 1 && (
              <Button
                onClick={uploadFiles}
                disabled={loading}
                className={`px-4 py-2 rounded ${theme === 'dark' ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white transition-colors`}
              >
                {loading ? <Loading /> : "Protect"}
              </Button>
            )}
          </div>
        </motion.div>
      </main>

      <footer className={`mt-12 py-8 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'} translate-y-[60px]`}>
        <div className="container mx-auto px-4 text-center">
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} `}>&copy; 2024 guard.ai. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
