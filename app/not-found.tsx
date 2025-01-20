"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"

interface Star {
  x: number
  y: number
  size: number
  opacity: number
  speed: number
}

export default function NotFound() {
  const router = useRouter()
  const [stars, setStars] = useState<Star[]>([])
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [countdown, setCountdown] = useState(15)

  const generateStar = useCallback(
    (): Star => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      opacity: Math.random(),
      speed: Math.random() * 0.5 + 0.1,
    }),
    [],
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/")
    }, 15000)

    const countdownInterval = setInterval(() => {
      setCountdown((prevCount) => prevCount - 1)
    }, 1000)

    const generateStars = () => {
      const newStars = Array.from({ length: 100 }, generateStar)
      setStars(newStars)
    }

    generateStars()

    const animateStars = () => {
      setStars((prevStars) =>
        prevStars.map((star) => ({
          ...star,
          x: (star.x + star.speed) % 100,
          opacity: Math.sin(Date.now() * star.speed * 0.01) * 0.5 + 0.5,
        })),
      )
    }

    const starInterval = setInterval(animateStars, 50)

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      clearTimeout(timer)
      clearInterval(starInterval)
      clearInterval(countdownInterval)
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [router, generateStar])

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden flex flex-col justify-center items-center px-4">
      {stars.map((star, index) => (
        <div
          key={index}
          className="absolute bg-white rounded-full transition-opacity duration-1000 ease-in-out"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            boxShadow: `0 0 ${star.size}px #fff`,
          }}
        />
      ))}
      <div
        className="absolute bg-yellow-400 rounded-full blur-3xl"
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
          width: "300px",
          height: "300px",
          opacity: 0.1,
          transform: "translate(-50%, -50%)",
          transition: "all 0.1s ease",
        }}
      />
      <div className="text-center z-10">
        <div className="mb-8">
          <Image
            src="/assets/logos/9.png"
            alt="DataX Logo"
            width={150}
            height={150}
            className="mx-auto animate-float"
          />
        </div>
        <h1
          className="text-9xl font-bold mb-4 animate-pulse"
          style={{ textShadow: "0 0 10px #FFD400, 0 0 20px #FFD400, 0 0 30px #FFD400" }}
        >
          404
        </h1>
        <h2 className="text-4xl font-semibold mb-4 animate-bounce">Lost in Space</h2>
        <p className="text-xl mb-8 max-w-2xl">
          Houston, we have a problem. The page you&apos;re looking for has drifted off into the cosmic void.
        </p>
        <Link
          href="/"
          className="px-8 py-4 bg-yellow-400 text-black rounded-full text-xl font-bold hover:bg-white hover:text-black transition-all duration-300 animate-pulse"
          style={{ boxShadow: "0 0 10px #FFD400, 0 0 20px #FFD400" }}
        >
          Return to Earth
        </Link>
      </div>
      <div className="mt-12 text-lg animate-fade-in-up">
        <p>Initiating emergency protocol...</p>
        <p className="font-mono">
          Redirecting to home base in T-
          <span className="inline-block w-12 text-center">{countdown.toString().padStart(2, "0")}</span>
          seconds
        </p>
      </div>
      <div className="absolute bottom-4 left-4 text-sm">Mission Control: {new Date().toLocaleTimeString()}</div>
      <style jsx global>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 2s ease-out;
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

