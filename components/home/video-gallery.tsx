"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { PlayCircle, Loader2, Clock, TrendingUp, History } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Video, getChannelVideos } from "@/lib/services/youtube"

type SortFilter = 'Latest' | 'Popular' | 'Oldest';

export default function VideoGallery() {
  const channelId = process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<SortFilter>('Latest')

  // Sort videos based on current filter
  const sortedVideos = videos.slice().sort((a, b) => {
    switch (filter) {
      case 'Popular':
        return parseInt(b.views.replace(/[KM]/g, '')) - parseInt(a.views.replace(/[KM]/g, ''));
      case 'Oldest':
        return a.id.localeCompare(b.id);
      case 'Latest':
      default:
        return b.id.localeCompare(a.id);
    }
  });

  useEffect(() => {
    async function fetchVideos() {
      try {
        setLoading(true)
        setError(null)

        if (!channelId) {
          throw new Error("YouTube channel ID is not configured");
        }
        
        // Fetch all videos from the channel
        const channelVideos = await getChannelVideos(channelId)
        setVideos(channelVideos)
      } catch (err) {
        console.error('Error fetching video details:', err)
        setError('Failed to load video details. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()
  }, [])

  return (
    <section className="w-full py-8 md:py-16 lg:py-20 bg-[#000] relative overflow-hidden">
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
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-4 tracking-tight">
            Video{" "}
            <span className="text-[#ffd400]">
              Resources
            </span>
          </h1>

          <p className="max-w-[900px] text-[#ffffff] md:text-lg/relaxed lg:text-base/relaxed xl:text-lg/relaxed opacity-90">
            Explore our collection of tutorials and guides to help you get the most out of DATAx.
          </p>
        </div>

        <nav className="flex justify-center mb-8">
          <div className="flex overflow-x-auto justify-start sm:justify-center items-center gap-2 sm:gap-3 p-2.5 rounded-2xl bg-gradient-to-tr from-white/5 via-white/10 to-transparent backdrop-blur-sm shadow-[0_8px_32px_-8px_rgba(255,212,0,0.15)] max-w-full no-scrollbar">
            {([
              { id: 'Latest', icon: Clock },
              { id: 'Popular', icon: TrendingUp },
              { id: 'Oldest', icon: History }
            ] as const).map((option) => {
              const Icon = option.icon
              return (
                <button
                  key={option.id}
                  onClick={() => setFilter(option.id)}
                  className={`
                    relative text-sm sm:text-lg font-bold
                    flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3 px-4 sm:px-6 py-3
                    transition-all duration-300 ease-out rounded-xl w-[130px] sm:w-auto
                    border border-transparent
                    ${filter === option.id 
                      ? "text-black bg-gradient-to-bl from-[#FFD400] via-[#FFD400] to-[#FFE55C] shadow-[0_4px_20px_rgba(255,212,0,0.25)] scale-105 border-[#FFD400]/20" 
                      : "text-white hover:text-[#FFD400] hover:bg-white/5 hover:border-[#FFD400]/10"
                    }
                  `}
                >
                  {filter === option.id && (
                    <div className="absolute inset-0 overflow-hidden rounded-xl">
                      <div
                        className="absolute inset-0 animate-ripple"
                        style={{
                          background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)'
                        }}
                      />
                    </div>
                  )}
                  <Icon className={`w-6 h-6 sm:w-6 sm:h-6 transition-all duration-300 
                    ${filter === option.id 
                      ? 'text-black scale-110' 
                      : 'text-[#FFD400] group-hover:scale-110'
                    }`} 
                  />
                  <span className="relative z-10 tracking-wide">{option.id}</span>
                </button>
              )
            })}
          </div>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 max-w-6xl mx-auto">
          {loading ? (
            <div className="col-span-full flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          ) : error ? (
            <div className="col-span-full text-center py-12">
              <p className="text-red-500">{error}</p>
            </div>
          ) : (
            sortedVideos.map((video) => (
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
                      <div className="flex flex-col items-start">
                        <span className="text-sm text-zinc-500">{video.author}</span>
                        <span className="text-xs text-zinc-400">{video.views} views</span>
                      </div>
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
            ))
          )}
        </div>
      </div>
    </section>
  )
}