import { NextResponse, type NextRequest } from 'next/server';
import { getPosts } from '@/lib/posts';
import { createSupabaseServerClient } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const cookieStore = cookies();
  const supabase = createSupabaseServerClient(cookieStore, true);
  
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase client could not be initialized.' }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const searchTerm = searchParams.get('q') || '';
  const page = Number(searchParams.get('page')) || 1;

  try {
    const { posts, totalPosts } = await getPosts(supabase, { searchTerm, page });

    return NextResponse.json({ posts, totalPosts }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch posts', details: error.message }, { status: 500 });
  }
}

// Optional: Handle OPTIONS requests for CORS preflight
export async function OPTIONS(request: NextRequest) {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
