import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const body = await request.json();
    const {
      postId,
      chainId,
      contract,
      tokenId,
      priceWei,
      editionType,
      editions,
      startAt,
      endAt,
      perWalletCap,
      royaltyBps,
      transferLockUntil,
    } = body;

    if (!postId) {
      return NextResponse.json({ error: 'Missing postId' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('posts')
      .update({
        minted: true,
        chain_id: chainId,
        contract,
        token_id: tokenId,
        price_wei: priceWei,
        edition_type: editionType,
        editions,
        start_at: startAt,
        end_at: endAt,
        per_wallet_cap: perWalletCap,
        royalty_bps: royaltyBps,
        transfer_lock_until: transferLockUntil,
        updated_at: new Date().toISOString(),
      })
      .eq('id', postId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ post: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

