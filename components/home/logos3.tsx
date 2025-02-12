"use client"

import React, { useState, useEffect } from "react"
import { useSpring, animated, config } from "@react-spring/web"
import { Heart, Hammer, Paintbrush, Drill } from "lucide-react"
import Image from "next/image"

const logos = [
  {
    id: "logo-1",
    description: "Built with Love",
    image: "/assets/lovedlogos/love.png",
  },
  {
    id: "logo-2",
    description: "Ranney Blair Weidmann",
    image: "/assets/lovedlogos/rbw.png",
  },
  {
    id: "logo-3",
    description: "???",
    image: "/assets/lovedlogos/soard.png",
  },
  {
    id: "logo-4",
    description: "React",
    image: "/assets/lovedlogos/eidson.png",
  },
  {
    id: "logo-5",
    description: "shadcn/ui",
    image: "/assets/lovedlogos/love.png",
  },
  {
    id: "Sunshine on a Ranney Day",
    description: "Supabase",
    image: "/assets/lovedlogos/rbw.png",
  },
  {
    id: "logo-7",
    description: "Tailwind CSS",
    image: "/assets/lovedlogos/soard.png",
  },
  {
    id: "logo-8",
    description: "Vercel",
    image: "/assets/lovedlogos/0.png",
  },
]

const toolIcons = [Hammer, Paintbrush, Drill]

const EpicLogoShowcase = () => {
  const [stars, setStars] = useState<{ x: number; y: number; size: number; isIcon: boolean; iconIndex: number }[]>([])
  //const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const generateStars = () => {
      const newStars = Array.from({ length: 100 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        isIcon: Math.random() > 0.95,
        iconIndex: Math.floor(Math.random() * toolIcons.length),
      }))
      setStars(newStars)
    }

    //const handleResize = () => {
    //  setIsMobile(window.innerWidth < 768)
    //}

    generateStars()
    //handleResize()

    const starInterval = setInterval(generateStars, 10000)
    //window.addEventListener("resize", handleResize)

    return () => {
      clearInterval(starInterval)
      //window.removeEventListener("resize", handleResize)
    }
  }, [])

  const titleProps = useSpring({
    from: { opacity: 0, transform: "translateY(-50px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    config: config.molasses,
  })

  return (
    <section className="relative py-16 overflow-hidden bg-black">
      {stars.map((star, index) =>
        star.isIcon ? (
          <div
            key={index}
            className="absolute text-white opacity-30"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              animation: `twinkle ${Math.random() * 4 + 2}s infinite`,
            }}
          >
            {React.createElement(toolIcons[star.iconIndex], { size: 12 })}
          </div>
        ) : (
          <div
            key={index}
            className="absolute bg-white rounded-full"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: Math.random() * 0.8 + 0.2,
              animation: `twinkle ${Math.random() * 4 + 2}s infinite`,
            }}
          />
        ),
      )}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <animated.h1 style={titleProps} className="mb-12 text-center text-4xl font-bold text-white lg:text-6xl">
          <Heart className="inline-block w-12 h-12 text-ffd400 fill-ffd400 mr-2" />
          by these companies
        </animated.h1>
        <div className="relative overflow-hidden mb-4">
          <div className="logos-container">
            <div className="logos-scroll">
              {[...logos, ...logos].map((logo, index) => (
                <div key={`${logo.id}-${index}`} className="logo-item">
                  <div className="relative w-32 h-32">
                    <Image
                      src={logo.image || "/placeholder.svg"}
                      alt={logo.description}
                      layout="fill"
                      objectFit="contain"
                      className="filter brightness-0 invert"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style jsx global>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 1; }
        }
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .logos-container {
          overflow: hidden;
          padding: 60px 0;
          background: linear-gradient(90deg, #000 0%, transparent 30%, transparent 70%, #000 100%);
          -webkit-mask-image: linear-gradient(90deg, transparent 0%, #000 20%, #000 80%, transparent 100%);
          mask-image: linear-gradient(90deg, transparent 0%, #000 20%, #000 80%, transparent 100%);
        }
        .logos-scroll {
          display: flex;
          animation: scroll 30s linear infinite;
          width: fit-content;
        }
        .logo-item {
          flex: 0 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background-color: rgba(31, 41, 55, 0.8);
          border-radius: 0.5rem;
          margin-right: 2rem;
          backdrop-filter: blur(4px);
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px -1px rgba(255, 212, 0, 0.1), 0 2px 4px -1px rgba(255, 212, 0, 0.06);
        }
        .logo-item:hover {
          transform: scale(1.05);
          box-shadow: 0 10px 15px -3px rgba(255, 212, 0, 0.1), 0 4px 6px -2px rgba(255, 212, 0, 0.05);
        }
        .text-ffd400 {
          color: #ffd400;
        }
        .fill-ffd400 {
          fill: #ffd400;
        }
      `}</style>
    </section>
  )
}

export default EpicLogoShowcase

