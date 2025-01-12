import { NextResponse } from 'next/server';

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL_USERS;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, data } = body;

    if (type === 'new-user') {
      const message = {
        username: 'DATAx Bot',
        embeds: [{
          title: '🎉 New User Signup!',
          color: 0x00ff00, // Green color
          fields: [
            {
              name: 'Name',
              value: data.name || 'Not provided',
              inline: true
            },
            {
              name: 'Email',
              value: data.email,
              inline: true
            },
            {
              name: 'Signup Date',
              value: new Date().toLocaleString(),
              inline: true
            }
          ],
          timestamp: new Date().toISOString()
        }]
      };

      const response = await fetch(DISCORD_WEBHOOK_URL!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });

      if (!response.ok) {
        throw new Error(`Discord API responded with ${response.status}`);
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid notification type' }, { status: 400 });
  } catch (error) {
    console.error('Error sending Discord notification:', error);
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    );
  }
} 