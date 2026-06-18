import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

/**
 * Serves character GLB files from public/characters/.
 * URL: /api/character/character-1.glb
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: { name: string } }
) {
  const filename = decodeURIComponent(params.name);

  if (!filename.endsWith('.glb') || filename.includes('..')) {
    return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });
  }

  const filePath = path.join(process.cwd(), 'public', 'characters', filename);

  try {
    const buffer = await readFile(filePath);
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'model/gltf-binary',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch {
    return NextResponse.json(
      {
        error: `Character not found: ${filename}`,
        hint: 'Place your GLB at public/characters/' + filename,
      },
      { status: 404 }
    );
  }
}
