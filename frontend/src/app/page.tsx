'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '../Components/buttons'
import { ChevronDown, Sun, Moon } from 'lucide-react'
import Particles from './Particles'
import Link from 'next/link'


export default function Home() {
  const [showMore, setShowMore] = useState(false)
  const [showNavbar, setShowNavbar] = useState(true)
  const [answer, setAnswer] = useState('')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [shuffledImgs, setShuffledImgs] = useState<{ src: string; alt: string; answer: string; style: React.CSSProperties }[]>([])
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  const imgs = [
    { src: '/images/image1.jpg', alt: 'Game Image1', answer: 'Real' },
    { src: '/images/image2.jpg', alt: 'Game Image2', answer: 'Fake' },
    { src: '/images/image3.jpg', alt: 'Game Image3', answer: 'Fake' },
    { src: '/images/image4.png', alt: 'Game Image4', answer: 'Real' },
    { src: '/images/image5.jpg', alt: 'Game Image5', answer: 'Fake' },
    { src: '/images/image6.png', alt: 'Game Image6', answer: 'Real' },
    { src: '/images/image7.png', alt: 'Game Image7', answer: 'Fake' },
    { src: '/images/image8.jpg', alt: 'Game Image8', answer: 'Real' },
    { src: '/images/image9.jpg', alt: 'Game Image9', answer: 'Fake' },
    { src: '/images/image10.jpeg', alt: 'Game Image10', answer: 'Real' },
    { src: '/images/image11.jpeg', alt: 'Game Image11', answer: 'Real' },
    { src: '/images/image12.jpg', alt: 'Game Image12', answer: 'Fake' },
    { src: '/images/image13.jpeg', alt: 'Game Image13', answer: 'Real' },
    { src: '/images/image14.png', alt: 'Game Image14', answer: 'Fake' },
    { src: '/images/image15.jpeg', alt: 'Game Image15', answer: 'Real' },
    { src: '/images/image16.jpeg', alt: 'Game Image16', answer: 'Fake' },
    { src: '/images/image17.jpeg', alt: 'Game Image17', answer: 'Fake' },
    { src: '/images/image18.jpeg', alt: 'Game Image18', answer: 'Real' },
    { src: '/images/image19.png', alt: 'Game Image19', answer: 'Real' },
    { src: '/images/image20.jpeg', alt: 'Game Image20', answer: 'Real' }
  ].map(img => ({...img, style: { width: '400px', height: '400px' }}))

  const shuffleArray = (array: { src: string; alt: string; answer: string; style: React.CSSProperties }[]) => {
    let shuffledArray = [...array]
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]
    }
    return shuffledArray
  }

  useEffect(() => {
    setShuffledImgs(shuffleArray(imgs))
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setShowNavbar(window.scrollY === 0)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null
    if (savedTheme) {
      setTheme(savedTheme)
    }
  }, [])

  useEffect(() => {
    // Save theme to localStorage whenever it changes
    localStorage.setItem('theme', theme)
    document.body.className = theme
  }, [theme])

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark')
  }

  const handleNext = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % shuffledImgs.length)
    setAnswer('')
  }

  const handleSelect = (selectedAnswer: string) => {
    setAnswer(selectedAnswer)
    if (selectedAnswer === shuffledImgs[currentImageIndex].answer) {
      alert('Correct!')
    } else {
      alert('Incorrect!')
    }
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'} overflow-hidden relative`}>
      <header className={`fixed top-0 left-0 right-0 z-50 ${theme === 'dark' ? 'bg-black/50' : 'bg-white/50'} backdrop-blur-md transition-transform duration-300 ${showNavbar ? 'translate-y-0' : '-translate-y-full'}`}>
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <img src="/images/Logo.png" alt="guard.ai logo" className="h-8" />
          <div className="flex space-x-6 items-center">
            <Link href="#home" className="text-sm font-medium hover:text-blue-400 transition-colors">Home</Link>
            <Link href="#playground" className="text-sm font-medium hover:text-blue-400 transition-colors">Playground</Link>
            <Button variant="ghost" onClick={toggleTheme} className="p-2">
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </nav>
      </header>
      
      <main className="container mx-auto px-4 pt-24 relative z-10">
        <section id="home" className="py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent transform -translate-y-[35px]">
              Guard.ai
            </h1>
            <p className="text-2xl font-black mb-4">Using AI to stop AI.</p>
            <p className={`text-lg ${theme === 'dark' ? 'text-white' : 'text-black'} mb-8`}>
              Protecting user media from AI exploitation through content immunization and accurate AI detection, 
              ensuring your digital assets remain secure and authentic on social media.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
                <Link href="/Protect">
                <Button variant="outline" className="w-36 hover:bg-neutral-500">Protect</Button>
                </Link>
                <Link href="/Detect">
              <Button variant="outline" className="w-36 hover:bg-neutral-500" >Detect</Button></Link>
            </div>
          </motion.div>
        </section>

        <section className="py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-6 text-center">How It Works</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="bg-slate-400/50 backdrop-blur-sm p-6 rounded-lg">
                <h3 className="text-xl font-black text-center mb-2">Content Immunization</h3>
                <p className={`${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                  Our advanced algorithms apply subtle modifications to your media, making it resistant to AI exploitation 
                  without affecting its visual quality.
                </p>
              </div>
              <div className="bg-slate-400/50 backdrop-blur-sm p-6 rounded-lg">
                <h3 className="text-xl font-black text-center mb-2">AI Detection</h3>
                <p className={`${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                  Utilize cutting-edge AI detection techniques to identify potentially manipulated or AI-generated content 
                  across various social media platforms.
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {showMore && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="py-20"
          >
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-6 text-center">Why Choose guard.ai?</h2>
              <ul className={`list-disc list-inside ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} space-y-2`}>
                <li>Cutting-edge AI technology for robust protection</li>
                <li>User-friendly browser extension for seamless integration</li>
                <li>Continuous updates to stay ahead of emerging AI threats</li>
                <li>Privacy-focused approach with no data collection</li>
                <li>Compatible with major social media platforms</li>
              </ul>
            </div>
          </motion.section>
        )}

        <div className="text-center py-10">
          <Button
            variant="ghost"
            onClick={() => setShowMore(!showMore)}
            className="text-blue-400 hover:text-blue-300"
          >
            {showMore ? 'Show Less' : 'Show More'}
            <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${showMore ? 'rotate-180' : ''}`} />
          </Button>
        </div>

        <motion.section id="playground" 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 0.6 }}
          className="py-20"
        >
          <div className="flex flex-col justify-center items-center">
            <motion.h2 className="text-5xl font-bold mb-8">Real or Fake?</motion.h2>
            <motion.div className={`w-full max-w-md ${theme === 'dark' ? 'bg-slate-800 border-slate-600' : 'bg-slate-200 border-slate-300'} border-2 rounded-lg p-8 flex flex-col items-center`}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {shuffledImgs.length > 0 && (
                <img
                  src={shuffledImgs[currentImageIndex].src}
                  className="w-64 h-64 object-cover rounded-lg mb-6"
                  alt={shuffledImgs[currentImageIndex].alt}
                />
              )}
              <div className="flex space-x-4 mb-4">
                <Button
                  variant="outline"
                  className="w-24 bg-green-500 hover:bg-green-600 text-white"
                  onClick={() => handleSelect('Real')}
                >
                  Real
                </Button>
                <Button
                  variant="outline"
                  className="w-24 bg-red-500 hover:bg-red-600 text-white"
                  onClick={() => handleSelect('Fake')}
                >
                  Fake
                </Button>
              </div>
              {answer && (
                <p className="text-2xl mb-4">You selected: {answer}</p>
              )}
              <Button
                className="w-full"
                onClick={handleNext}
              >
                Next
              </Button>
            </motion.div>
          </div>
        </motion.section>
      </main>

      <footer className={`${theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-100/50'} backdrop-blur-sm py-8 relative z-10`}>
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>&copy; 2024 guard.ai. All rights reserved.</p>
        </div>
      </footer>

      <div className="fixed inset-0 z-0 flex items-center justify-center">
        <div className="w-full h-full">
        <Particles />
        </div>
      </div>
    </div>
  )
}