import axios from 'axios'
import { NextResponse } from 'next/server'

type JTError = {
  message: string;
  status?: number;
  code?: string;
}

export async function POST(request: Request) {
  console.log('Received request to /api/jtfetch')
  try {
    const body = await request.json()
    console.log('Request body:', JSON.stringify(body, null, 2))

    const response = await axios.post('https://api.jobtread.com/pave', body, {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    console.log('Response status:', response.status)
    return NextResponse.json(response.data)
  } catch (error) {
    console.error('Error connecting to JobTread:', (error as JTError).message)
    return NextResponse.json(
      { error: 'Error fetching data' }, 
      { status: 500 }
    )
  }
}