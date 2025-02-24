"use client";

import { useEffect } from 'react'
import { quotes } from '@/lib/quotes'
import { useAppStore } from '@/lib/stores/app-store'

const textShadowStyle = {
  textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
};

export function InspirationQuote() {
  const { quote: storedQuote, setQuote } = useAppStore();

  useEffect(() => {
    const getRandomQuote = () => {
      const randomIndex = Math.floor(Math.random() * quotes.length)
      return quotes[randomIndex]
    }

    const setNewQuote = () => {
      const newQuote = getRandomQuote()
      const twoWeeksFromNow = Date.now() + 14 * 24 * 60 * 60 * 1000
      setQuote({
        ...newQuote,
        expirationDate: twoWeeksFromNow
      })
    }

    if (!storedQuote || storedQuote.expirationDate <= Date.now()) {
      setNewQuote()
    }

    const interval = setInterval(() => {
      if (!storedQuote || storedQuote.expirationDate <= Date.now()) {
        setNewQuote()
      }
    }, 24 * 60 * 60 * 1000)

    return () => clearInterval(interval)
  }, [storedQuote, setQuote])

  if (!storedQuote) {
    return null
  }

  return (
    <div className="bg-gradient-to-r from-[#000] to-[#ffd400] p-6 rounded-lg shadow-md">
      <blockquote className="text-xl font-semibold mb-2 text-white" style={textShadowStyle}>&ldquo;{storedQuote.text}&rdquo;</blockquote>
      <cite className="block text-sm text-white" style={textShadowStyle}>- {storedQuote.author}</cite>
    </div>
  )
}

