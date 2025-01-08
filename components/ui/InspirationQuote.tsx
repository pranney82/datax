"use client";

import { useEffect, useState } from 'react'

const quotes = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "The only limit to our realization of tomorrow will be our doubts of today.", author: "Franklin D. Roosevelt" },
  { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" },
]

const textShadowStyle = {
  textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
};

interface StoredQuote {
  text: string;
  author: string;
  expirationDate: number;
}

export function InspirationQuote() {
  const [quote, setQuote] = useState<StoredQuote | null>(null)

  useEffect(() => {
    const getRandomQuote = () => {
      const randomIndex = Math.floor(Math.random() * quotes.length)
      return quotes[randomIndex]
    }

    const getStoredQuote = (): StoredQuote | null => {
      const storedQuote = localStorage.getItem('inspirationQuote')
      return storedQuote ? JSON.parse(storedQuote) : null
    }

    const setNewQuote = () => {
      const newQuote = getRandomQuote()
      const twoWeeksFromNow = Date.now() + 14 * 24 * 60 * 60 * 1000
      const storedQuote: StoredQuote = {
        ...newQuote,
        expirationDate: twoWeeksFromNow
      }
      localStorage.setItem('inspirationQuote', JSON.stringify(storedQuote))
      setQuote(storedQuote)
    }

    const storedQuote = getStoredQuote()
    if (storedQuote && storedQuote.expirationDate > Date.now()) {
      setQuote(storedQuote)
    } else {
      setNewQuote()
    }

    const checkAndUpdateQuote = () => {
      const currentStoredQuote = getStoredQuote()
      if (!currentStoredQuote || currentStoredQuote.expirationDate <= Date.now()) {
        setNewQuote()
      }
    }

    const interval = setInterval(checkAndUpdateQuote, 24 * 60 * 60 * 1000) // Check daily

    return () => clearInterval(interval)
  }, [])

  if (!quote) {
    return null // or a loading state
  }

  return (
    <div className="bg-gradient-to-r from-[#000] to-[#ffd400] p-6 rounded-lg shadow-md">
      <blockquote className="text-xl font-semibold mb-2 text-white" style={textShadowStyle}>&ldquo;{quote.text}&rdquo;</blockquote>
      <cite className="block text-sm text-white" style={textShadowStyle}>- {quote.author}</cite>
    </div>
  )
}

