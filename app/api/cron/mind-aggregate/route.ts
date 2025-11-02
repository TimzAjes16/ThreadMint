import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// This endpoint should be called by Vercel Cron
// Route: /api/cron/mind-aggregate
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get users who need recomputation
    // - Users with new collected neurons since last_recomputed
    // - Users with N new nodes threshold (e.g., 5)
    const threshold = 5;

    const { data: users, error: usersError } = await supabaseAdmin
      .from('mind_state')
      .select('user_id, node_count, last_recomputed')
      .or(
        `last_recomputed.is.null,last_recomputed.lt.${new Date(
          Date.now() - 24 * 60 * 60 * 1000
        ).toISOString()}`
      );

    if (usersError) throw usersError;

    let processed = 0;

    for (const user of users || []) {
      // Check if user has new collections
      const { data: newCollections, error: collectionsError } =
        await supabaseAdmin
          .from('collected_neurons')
          .select('id')
          .eq('collector_id', user.user_id)
          .gt('collected_at', user.last_recomputed || '1970-01-01');

      if (collectionsError) continue;

      if (
        (newCollections?.length || 0) >= threshold ||
        !user.last_recomputed
      ) {
        // Trigger recomputation
        await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/mind/recompute`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.user_id }),
        });
        processed++;
      }
    }

    return NextResponse.json({
      processed,
      total: users?.length || 0,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

