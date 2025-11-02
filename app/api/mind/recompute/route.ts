import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    // Get collected neurons
    const { data: collected, error: collectedError } = await supabaseAdmin
      .from('collected_neurons')
      .select('*, posts!inner(post_features(embedding, emotion))')
      .eq('collector_id', userId);

    if (collectedError) throw collectedError;

    // Get user's own posts
    const { data: ownPosts, error: ownError } = await supabaseAdmin
      .from('posts')
      .select('post_features(embedding, emotion)')
      .eq('author_id', userId);

    if (ownError) throw ownError;

    // Compute centroids
    // TODO: Implement proper centroid calculation with absorption weights
    const nodes: any[] = [];
    const edges: any[] = [];

    // Generate graph structure
    // This is simplified - real implementation would use UMAP/t-SNE for layout
    collected?.forEach((item, i) => {
      const pos: [number, number, number] = [
        Math.cos((i / collected.length) * Math.PI * 2) * 2,
        Math.sin((i / collected.length) * Math.PI * 2) * 2,
        (Math.random() - 0.5) * 0.5,
      ];

      nodes.push({
        id: item.id,
        kind: 'absorbed',
        pos,
        color: [0.3, 0.5, 1.0],
        size: 0.15,
        label: 'Absorbed thought',
        emotion: item.posts?.post_features?.emotion?.tone || 'curiosity',
      });
    });

    // Update mind state
    await supabaseAdmin.from('mind_state').upsert({
      user_id: userId,
      node_count: nodes.length,
      coherence: 0.7, // TODO: Calculate from embeddings
      diversity: 0.6, // TODO: Calculate entropy
      last_recomputed: new Date().toISOString(),
    });

    // Cache graph
    const { data: cache, error: cacheError } = await supabaseAdmin
      .from('mind_graph_cache')
      .insert({
        user_id: userId,
        nodes,
        edges,
        version: 1,
      })
      .select()
      .single();

    if (cacheError) throw cacheError;

    return NextResponse.json({ graph: cache });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

