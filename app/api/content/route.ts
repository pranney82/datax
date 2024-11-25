import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'app', 'content', 'home.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(fileContent);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading content:', error);
    return NextResponse.json(
      { error: 'Failed to load content' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const url = new URL(request.url);
    const section = url.searchParams.get('section');
    
    if (!section) {
      throw new Error('No section specified');
    }

    const filePath = path.join(process.cwd(), 'components', 'home', `${section}.json`);
    console.log('Attempting to write to:', filePath);
    console.log('Content to write:', JSON.stringify(data, null, 2));

    try {
      await fs.access(filePath);
      console.log('File exists and is accessible');
    } catch (e) {
      console.log('File does not exist or is not accessible:', e);
    }

    const dirPath = path.dirname(filePath);
    await fs.mkdir(dirPath, { recursive: true });

    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
    
    try {
      const verification = await fs.readFile(filePath, 'utf8');
      console.log('File was written successfully. Content:', verification);
    } catch (e) {
      console.log('Failed to verify file write:', e);
    }

    return NextResponse.json({ 
      success: true, 
      path: filePath,
      section: section,
      message: 'Content saved successfully'
    });
  } catch (error) {
    console.error('Error saving content:', error);
    return NextResponse.json(
      { 
        error: `Failed to save content: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: error
      },
      { status: 500 }
    );
  }
} 