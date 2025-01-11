'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export default function ScrapePage() {
  const [messages, setMessages] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleAutomate = async () => {
    setIsLoading(true)
    setMessages([])
    
    try {
      const response = await fetch('/api/grantKey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No reader available');
      }

      // Read the stream
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Convert the chunk to text and split by newlines
        const text = new TextDecoder().decode(value);
        const lines = text.split('\n').filter(line => line.trim());

        // Process each line
        lines.forEach(line => {
          try {
            const data = JSON.parse(line);
            if (data.message) {
              setMessages(prev => [...prev, data.message]);
            }
            if (data.status === 'complete' && data.grantKey) {
              console.log(`Final Grant Key: ${data.grantKey}`);
            }
          } catch (e) {
            console.error('Error parsing line:', e);
          }
        });
      }
    } catch (error) {
      console.error('Automation error:', error);
      setMessages(prev => [...prev, `💥 Error: ${error}`]);
    } finally {
      setIsLoading(false);
    }
  }
//now just add input fields and the button sends to the api and the api sends back the data to the client
  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-4">Automation Control</h1>
      <Input 
        type="email" 
        placeholder="Enter your email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-2"
      />
      <Input 
        type="password" 
        placeholder="Enter your password" 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mb-2"
      />
      <Button 
        onClick={handleAutomate} 
        className="bg-primary mb-4"
        disabled={isLoading}
      >
        {isLoading ? 'Running...' : 'Start Automation'}
      </Button>

      <div className="space-y-2 font-mono text-sm">
        {messages.map((message, i) => (
          <div key={i} className="p-2 bg-gray-100 rounded">
            {message}
          </div>
        ))}
      </div>
    </div>
  )
} 