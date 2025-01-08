import { NextResponse } from 'next/server'
import { db, auth } from '@/lib/firebase'
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore'

export async function GET() {
  try {
    const currentUser = auth.currentUser
    if (!currentUser?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const logsRef = collection(db, 'coverphotoLogs')
    const q = query(
      logsRef,
      where('email', '==', currentUser.email),
      orderBy('date', 'desc'),
      limit(10)
    )

    const querySnapshot = await getDocs(q)
    const logs = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    return NextResponse.json(logs)
  } catch (error) {
    console.error('Error fetching logs:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 