import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return NextResponse.json({
        nodes: [],
        edges: [],
        version: 1,
        error: 'Database not configured',
      });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    // Get latest cached graph
    const { data: cache, error: cacheError } = await supabaseAdmin
      .from('mind_graph_cache')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (cacheError || !cache) {
      // Generate graph on the fly
      // TODO: Implement graph generation logic
      return NextResponse.json({
        nodes: [],
        edges: [],
        version: 1,
      });
    }

    return NextResponse.json({
      nodes: cache.nodes,
      edges: cache.edges,
      glb_url: cache.glb_url,
      version: cache.version,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

