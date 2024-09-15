'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/Components/buttons'
import { Dropzone, FileInputButton, FileMosaic } from "@files-ui/react"
import axios from 'axios'
import Loading from "@/Components/Loading"
import { Sun, Moon } from 'lucide-react'
import Link from 'next/link'

export default function DetectPage() {
  const [files, setFiles] = useState<any>([])
  const [result, setResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
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
    setResult(null)
  }

  const uploadFiles = async () => {
    if (files.length === 0) {
      console.error("No file selected.")
      return
    }

    setLoading(true)
    const formData = new FormData()
    const file = files[0].file
    formData.append("file", file)

    try {
      let response;
      if (file.type.startsWith("image/")) {
        response = await axios.post("https://jubilant-succotash-wq5r54pjggxcg7r9-5000.app.github.dev/detect_image", formData)
      } else if (file.type.startsWith("audio/")) {
        response = await axios.post("https://jubilant-succotash-wq5r54pjggxcg7r9-5000.app.github.dev/detect_audio", formData)
      } else if (file.type.startsWith("video/")) {
        response = await axios.post("https://jubilant-succotash-wq5r54pjggxcg7r9-5000.app.github.dev/detect_video", formData)
      } else {
        response = await axios.post("https://7t6qwzmb-5000.inc1.devtunnels.ms/detect", formData)
      }
      setResult(response.data)
    } catch (error) {
      console.error("Error:", error)
      setResult("Error occurred during detection")
    } finally {
      setLoading(false)
    }
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
            <Link href="/Protect" className="text-sm font-medium hover:text-blue-400 transition-colors">Protect</Link>
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
          <h1 className="text-4xl font-bold mb-6">AI Generated Detection</h1>
          <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-8`}>
            Drop or paste your image or audio below to check for deepfake
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
          <div className="flex flex-wrap justify-between items-center mt-4">
            <FileInputButton
              maxFiles={1}
              onChange={updateFiles}
              value={files}
              className={`px-4 py-2 rounded ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-colors mb-2 sm:mb-0`}
            >
              Select File
            </FileInputButton>
            {files.length === 1 && (
              <Button
                onClick={uploadFiles}
                disabled={loading}
                className={`px-4 py-2 rounded ${theme === 'dark' ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white transition-colors`}
              >
                {loading ? <Loading /> : "Detect"}
              </Button>
            )}
          </div>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`mt-6 p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}
            >
              <h3 className="text-lg font-semibold mb-2">Result</h3>
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{result}</p>
            </motion.div>
          )}
        </motion.div>
      </main>

      <footer className={`mt-12 py-8 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'} translate-y-[60px]`}>
        <div className="container mx-auto px-4 text-center">
          <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>&copy; 2024 guard.ai. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}