import { NextResponse } from 'next/server';
import { execSync } from 'child_process';

export async function GET() {
  try {
    const result = execSync('git show HEAD:src/app/imoveis/[slug]/page.tsx').toString();
    return NextResponse.json({ content: result });
  } catch (e: any) {
    return NextResponse.json({ error: e.message, stack: e.stack }, { status: 200 });
  }
}
