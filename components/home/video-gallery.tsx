import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { PlayCircle } from 'lucide-react'

interface Video {
  id: string
  title: string
  description: string
  duration: string
  author: string
  thumbnailUrl: string
  videoUrl: string
}

const sampleVideos: Video[] = [
  {
    id: "1",
    title: "Getting Started with DATAx",
    description: "DATAx Software Walkthrough",
    duration: "4:31",
    author: "DATAx Team",
    thumbnailUrl: "/assets/thumbnails/dataxwork.png",
    videoUrl: "https://www.youtube.com/embed/FiAXjvgV0Zc",
  },
  {
    id: "2",
    title: "Unlocking JobTread's Full Potential: A Beginner's Guide to Automations and Integrations",
    description: "Dominic Eidson and Elliott Wittstruck present their talk again through video from JobTread Connect User Conference 2025 in Dallas, TX.",
    duration: "32:25",
    author: "DATAx Team",
    thumbnailUrl: "/assets/thumbnails/automationbeginner.png",
    videoUrl: "https://www.youtube.com/embed/w7DycsGRJmQ",
  },
  {
    id: "3",
    title: "Cash Flow Calendar",
    description: "Complete guide to integrating DataX with your existing tools.",
    duration: "4:32",
    author: "DATAx Team",
    thumbnailUrl: "/assets/thumbnails/cashcal.png",
    videoUrl: "https://www.youtube.com/embed/FEptwBb7IrM",
  },
  {
    id: "4",
    title: "Automation Kickstart - Course 1 - Intro",
    description: "This is an intro video to our beginner course for automating your construction business. Start with the basics and work your way up to intermediate workflows with weekly classes, hands-on building, and a community to support you. ",
    duration: "3:39",
    author: "DATAx Team",
    thumbnailUrl: "/assets/thumbnails/course1.png",
    videoUrl: "https://www.youtube.com/embed/-N1rk-aY4tU",
  },
  {
    id: "5",
    title: "Introducing DATAx for Job Tread Users! 🚀",
    description: "Introduction to DATAx for JOBTREAD users.",
    duration: "0:18",
    author: "DATAx Team",
    thumbnailUrl: "/assets/thumbnails/dataxwhat.png",
    videoUrl: "https://www.youtube.com/embed/54J9jKafVMc",
  },
  {
    id: "6",
    title: "Integration Guide",
    description: "Complete guide to integrating DataX with your existing tools.",
    duration: "4:99",
    author: "DATAx Team",
    thumbnailUrl: "/assets/thumbnails/3.png",
    videoUrl: "https://www.youtube.com/embed/SxHCTr0IWSc",
  },  {
    id: "7",
    title: "Integration Guide",
    description: "Complete guide to integrating DataX with your existing tools.",
    duration: "4:99",
    author: "DATAx Team",
    thumbnailUrl: "/assets/thumbnails/3.png",
    videoUrl: "https://www.youtube.com/embed/SxHCTr0IWSc",
  },  {
    id: "8",
    title: "Integration Guide",
    description: "Complete guide to integrating DataX with your existing tools.",
    duration: "4:99",
    author: "DATAx Team",
    thumbnailUrl: "/assets/thumbnails/3.png",
    videoUrl: "https://www.youtube.com/embed/SxHCTr0IWSc",
  },  {
    id: "9",
    title: "Integration Guide",
    description: "Complete guide to integrating DataX with your existing tools.",
    duration: "4:99",
    author: "DATAx Team",
    thumbnailUrl: "/assets/thumbnails/3.png",
    videoUrl: "https://www.youtube.com/embed/SxHCTr0IWSc",
  },  {
    id: "10",
    title: "Integration Guide",
    description: "Complete guide to integrating DataX with your existing tools.",
    duration: "4:99",
    author: "DATAx Team",
    thumbnailUrl: "/assets/thumbnails/3.png",
    videoUrl: "https://www.youtube.com/embed/SxHCTr0IWSc",
  },  {
    id: "11",
    title: "Integration Guide",
    description: "Complete guide to integrating DataX with your existing tools.",
    duration: "4:99",
    author: "DATAx Team",
    thumbnailUrl: "/assets/thumbnails/3.png",
    videoUrl: "https://www.youtube.com/embed/SxHCTr0IWSc",
  },  {
    id: "12",
    title: "Integration Guide",
    description: "Complete guide to integrating DataX with your existing tools.",
    duration: "4:99",
    author: "DATAx Team",
    thumbnailUrl: "/assets/thumbnails/3.png",
    videoUrl: "https://www.youtube.com/embed/SxHCTr0IWSc",
  },  {
    id: "13",
    title: "Integration Guide",
    description: "Complete guide to integrating DataX with your existing tools.",
    duration: "4:99",
    author: "DATAx Team",
    thumbnailUrl: "/assets/thumbnails/3.png",
    videoUrl: "https://www.youtube.com/embed/SxHCTr0IWSc",
  },  {
    id: "14",
    title: "Integration Guide",
    description: "Complete guide to integrating DataX with your existing tools.",
    duration: "4:99",
    author: "DATAx Team",
    thumbnailUrl: "/assets/thumbnails/3.png",
    videoUrl: "https://www.youtube.com/embed/SxHCTr0IWSc",
  },
]

export default function VideoGallery() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-[#000] relative overflow-hidden">
      <div className="absolute inset-0 bg-[#000]">
        {[...Array(300)].map((_, i) => {
          const size = Math.random() * 3 + 1
          return (
            <div
              key={i}
              className="absolute bg-white rounded-full animate-twinkle"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${size}px`,
                height: `${size}px`,
                animationDelay: `${Math.random() * 15}s`,
                opacity: Math.random() * 0.5 + 0.5,
                filter: `blur(${size * 0.15}px) brightness(${Math.random() * 150 + 200}%)`,
                boxShadow: `0 0 ${size * 4}px rgba(255, 255, 255, 0.${Math.floor(Math.random() * 7 + 3)})`,
                transform: `scale(${Math.random() * 0.8 + 0.7})`,
              }}
            />
          )
        })}
      </div>
      <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          {/* EXISTING CODE: Original h1 element */}
          {/*
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-4">
            Video <span className="text-[#ffd400]">Resources</span>
          </h1>
          */}

          {/* UPDATED CODE: Improved h1 element with brand colors */}
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold text-white mb-6 tracking-tight">
            Video{" "}
            <span className="text-[#ffd400]">
              Resources
            </span>
          </h1>

          <p className="max-w-[900px] text-[#ffffff] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed opacity-80">
            Explore our collection of tutorials and guides to help you get the most out of DATAx.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 max-w-6xl mx-auto">
          {sampleVideos.map((video) => (
            <Dialog key={video.id}>
              <DialogTrigger asChild>
                <Card className="cursor-pointer hover:shadow-lg transition-shadow flex flex-col h-full">
                  <CardHeader className="p-0">
                    <div className="relative aspect-video w-full overflow-hidden rounded-t-xl">
                      <img
                        src={video.thumbnailUrl || "/placeholder.svg"}
                        alt={video.title}
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                        <PlayCircle className="w-16 h-16 text-white opacity-90" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 flex-grow">
                    <CardTitle className="line-clamp-1">{video.title}</CardTitle>
                    <CardDescription className="line-clamp-2 mt-2">{video.description}</CardDescription>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 justify-between mt-auto">
                    <span className="text-sm text-zinc-500">{video.author}</span>
                    <span className="text-sm text-zinc-500">{video.duration}</span>
                  </CardFooter>
                </Card>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[900px]">
                <div className="aspect-video w-full">
                  <iframe
                    src={`${video.videoUrl}?autoplay=1`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full rounded-lg"
                  />
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </div>
    </section>
  )
}