import { NextRequest, NextResponse } from 'next/server';
import { dummyPosts } from '@/lib/dummy-data';

export async function GET(request: NextRequest) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const { searchParams } = new URL(request.url);
      const authorId = searchParams.get('authorId');
      const limit = parseInt(searchParams.get('limit') || '20');
      const offset = parseInt(searchParams.get('offset') || '0');

      let filtered = [...dummyPosts];

      if (authorId) {
        filtered = filtered.filter((post: any) => post.users?.handle === authorId);
      }

      // Apply pagination
      const paginated = filtered.slice(offset, offset + limit);

      return NextResponse.json({ posts: paginated });
    }

    // Import Supabase only if needed
    const { supabaseAdmin } = await import('@/lib/supabase');
    
    if (!supabaseAdmin) {
      // Fallback to dummy data
      const { searchParams } = new URL(request.url);
      const authorId = searchParams.get('authorId');
      const limit = parseInt(searchParams.get('limit') || '20');
      const offset = parseInt(searchParams.get('offset') || '0');

      let filtered = [...dummyPosts];
      if (authorId) {
        filtered = filtered.filter((post: any) => post.users?.handle === authorId);
      }
      const paginated = filtered.slice(offset, offset + limit);
      return NextResponse.json({ posts: paginated });
    }

    const { searchParams } = new URL(request.url);
    const authorId = searchParams.get('authorId');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = supabaseAdmin
      .from('posts')
      .select('*, users:author_id(handle, display_name, avatar_url)')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (authorId) {
      query = query.eq('author_id', authorId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ posts: [], error: error.message });
    }

    return NextResponse.json({ posts: data || [] });
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json({ posts: [], error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    // Import Supabase only if needed
    const { supabaseAdmin } = await import('@/lib/supabase');
    
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const body = await request.json();
    const { authorId, kind, body: postBody, mediaUrl } = body;

    if (!authorId || !kind) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('posts')
      .insert({
        author_id: authorId,
        kind,
        body: postBody,
        media_url: mediaUrl,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    return NextResponse.json({ post: data });
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

