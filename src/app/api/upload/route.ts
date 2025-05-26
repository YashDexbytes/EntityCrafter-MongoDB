import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files');

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No files provided' },
        { status: 400 }
      );
    }

    const uploadDir = join(process.cwd(), 'public', 'uploads');
    
    // Create uploads directory if it doesn't exist
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      // Directory already exists
    }

    const uploadedFiles = await Promise.all(
      files.map(async (file: any) => {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Generate unique filename
        const timestamp = Date.now();
        const uniqueFilename = `${timestamp}-${file.name}`;
        const filePath = join(uploadDir, uniqueFilename);

        // Save file
        await writeFile(filePath, buffer);

        // Return relative path for database storage
        return `/uploads/${uniqueFilename}`;
      })
    );

    return NextResponse.json({
      success: true,
      filePath: uploadedFiles.length === 1 ? uploadedFiles[0] : uploadedFiles
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { success: false, error: 'Error uploading file' },
      { status: 500 }
    );
  }
} 