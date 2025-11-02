import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// This endpoint should be called by Vercel Cron or similar
// Route: /api/cron/reactions
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get unsettled reactions
    const { data: reactions, error: reactionsError } = await supabaseAdmin
      .from('reactions')
      .select('*')
      .is('settled_tx', null);

    if (reactionsError) throw reactionsError;

    // Group by post/actor for batching
    const grouped = reactions?.reduce((acc: any, r) => {
      const key = `${r.post_id}-${r.actor_id}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(r);
      return acc;
    }, {});

    // TODO: Implement settlement logic
    // - Batch payments per post author
    // - Calculate protocol fees
    // - Send transactions (using settlement wallet)
    // - Update settled_tx in database

    return NextResponse.json({
      processed: reactions?.length || 0,
      batches: Object.keys(grouped || {}).length,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

