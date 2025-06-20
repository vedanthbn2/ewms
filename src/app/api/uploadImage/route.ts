import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

/**
 * Deprecated page config removed.
 * Please refer to https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config
 * for updated configuration.
 */

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.startsWith('multipart/form-data')) {
      return NextResponse.json({ success: false, error: 'Invalid content type' }, { status: 400 });
    }

    // Parse multipart form data
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
    }

    // Generate unique filename
    const extension = file.name.split('.').pop();
    const filename = `${uuidv4()}.${extension}`;

    // Define upload directory
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Save file to disk
    const arrayBuffer = await file.arrayBuffer();
    // Fix type error by using Uint8Array directly
    const uint8Array = new Uint8Array(arrayBuffer);
    const filePath = path.join(uploadDir, filename);
    fs.writeFileSync(filePath, uint8Array);

    // Return public URL
    const fileUrl = `/uploads/${filename}`;

    return NextResponse.json({ success: true, url: fileUrl });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ success: false, error: 'Error uploading file' }, { status: 500 });
  }
}
