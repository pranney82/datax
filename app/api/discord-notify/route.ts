import { NextResponse } from 'next/server';

// Different webhook URLs for different types of notifications
const DISCORD_WEBHOOK_URL_USERS = process.env.DISCORD_WEBHOOK_URL_USERS;
const DISCORD_WEBHOOK_URL_FEATURES = process.env.DISCORD_WEBHOOK_URL_FEATURES;
const DISCORD_WEBHOOK_URL_SUPPORT = process.env.DISCORD_WEBHOOK_URL_SUPPORT;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, data } = body;

    const message = {
      username: 'DATAx Bot',
      embeds: [{}]
    };

    // Determine which webhook URL to use
    let webhookUrl: string | undefined;

    switch (type) {
      case 'new-user':
        webhookUrl = DISCORD_WEBHOOK_URL_USERS;
        message.embeds[0] = {
          title: '🎉 New User Signup!',
          color: 0x00ff00, // Green
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
        };
        break;

      case 'feature-request':
        webhookUrl = DISCORD_WEBHOOK_URL_FEATURES;
        message.embeds[0] = {
          title: '💡 New Feature Request',
          color: 0x0099ff, // Blue
          fields: [
            {
              name: 'Feature Title',
              value: data.title,
              inline: false
            },
            {
              name: 'Description',
              value: data.description,
              inline: false
            },
            {
              name: 'Requested By',
              value: data.email,
              inline: true
            },
            {
              name: 'Status',
              value: data.status,
              inline: true
            }
          ],
          timestamp: new Date().toISOString()
        };
        break;

      case 'support-request':
        webhookUrl = DISCORD_WEBHOOK_URL_SUPPORT;
        message.embeds[0] = {
          title: '🆘 New Support Request',
          color: 0xff0000, // Red
          fields: [
            {
              name: 'Issue Title',
              value: data.title,
              inline: false
            },
            {
              name: 'Description',
              value: data.description,
              inline: false
            },
            {
              name: 'Submitted By',
              value: data.email,
              inline: true
            },
            {
              name: 'Status',
              value: data.status,
              inline: true
            }
          ],
          timestamp: new Date().toISOString()
        };
        break;

      default:
        return NextResponse.json({ error: 'Invalid notification type' }, { status: 400 });
    }

    if (!webhookUrl) {
      throw new Error('No webhook URL configured for this notification type');
    }

    const response = await fetch(webhookUrl, {
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
  } catch (error) {
    console.error('Error sending Discord notification:', error);
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    );
  }
} 