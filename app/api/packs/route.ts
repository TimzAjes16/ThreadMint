import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ownerId = searchParams.get('ownerId');

    let query = supabaseAdmin
      .from('packs')
      .select('*, pack_items(*, posts(*))')
      .order('created_at', { ascending: false });

    if (ownerId) {
      query = query.eq('owner_id', ownerId);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ packs: data || [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ownerId, title, description, priceWei, postIds } = body;

    if (!ownerId || !title || !postIds || postIds.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create pack
    const { data: pack, error: packError } = await supabaseAdmin
      .from('packs')
      .insert({
        owner_id: ownerId,
        title,
        description,
        price_wei: priceWei,
      })
      .select()
      .single();

    if (packError) throw packError;

    // Add items
    const items = postIds.map((postId: string) => ({
      pack_id: pack.id,
      post_id: postId,
    }));

    const { error: itemsError } = await supabaseAdmin
      .from('pack_items')
      .insert(items);

    if (itemsError) throw itemsError;

    return NextResponse.json({ pack });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

