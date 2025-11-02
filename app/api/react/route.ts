import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

const REACTION_PRICES = {
  like: BigInt('2000000000000000'), // 0.002 ETH in wei
  comment: BigInt('10000000000000000'), // 0.01 ETH
  quote: BigInt('20000000000000000'), // 0.02 ETH
};

export async function POST(request: NextRequest) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const body = await request.json();
    const { postId, actorId, kind, commentText, amountWei } = body;

    if (!postId || !actorId || !kind) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const expectedAmount =
      REACTION_PRICES[kind as keyof typeof REACTION_PRICES];
    const providedAmount = BigInt(amountWei || '0');

    if (providedAmount < expectedAmount) {
      return NextResponse.json(
        { error: 'Insufficient payment for reaction' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('reactions')
      .insert({
        post_id: postId,
        actor_id: actorId,
        kind,
        comment_text: commentText,
        amount_wei: amountWei,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ reaction: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

