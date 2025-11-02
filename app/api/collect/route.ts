import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const body = await request.json();
    const { collectorId, postId, priceWei, txHash, editionSerial } = body;

    if (!collectorId || !postId || !txHash) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get post to find author
    const { data: post, error: postError } = await supabaseAdmin
      .from('posts')
      .select('author_id')
      .eq('id', postId)
      .single();

    if (postError || !post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Record collection
    const { data: collected, error: collectError } = await supabaseAdmin
      .from('collected_neurons')
      .insert({
        collector_id: collectorId,
        source_post_id: postId,
        source_author_id: post.author_id,
        price_wei: priceWei,
        tx_hash: txHash,
      })
      .select()
      .single();

    if (collectError) throw collectError;

    // Record sale
    const { data: sale, error: saleError } = await supabaseAdmin
      .from('sales')
      .insert({
        post_id: postId,
        buyer_id: collectorId,
        tx_hash: txHash,
        amount_wei: priceWei,
        edition_serial: editionSerial,
      })
      .select()
      .single();

    if (saleError) throw saleError;

    // TODO: Trigger absorption computation async
    // This would recompute mind_state and influence_lineage

    return NextResponse.json({ collected, sale });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

