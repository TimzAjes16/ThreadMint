import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Top creators by revenue
    const { data: creators, error: creatorsError } = await supabaseAdmin
      .from('sales')
      .select('posts!inner(author_id, users!posts_author_id_fkey(handle, display_name, avatar_url))')
      .then((result) => {
        if (result.error) throw result.error;
        // Aggregate by author
        // TODO: Implement proper aggregation
        return { data: [], error: null };
      });

    // Top collectors by count
    const { data: collectors, error: collectorsError } = await supabaseAdmin
      .from('collected_neurons')
      .select('collector_id, users!collected_neurons_collector_id_fkey(handle, display_name, avatar_url)')
      .then((result) => {
        if (result.error) throw result.error;
        // Aggregate by collector
        // TODO: Implement proper aggregation
        return { data: [], error: null };
      });

    return NextResponse.json({
      creators: [],
      collectors: [],
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

