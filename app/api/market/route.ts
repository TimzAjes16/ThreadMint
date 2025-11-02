import { NextRequest, NextResponse } from 'next/server';
import { dummyPosts } from '@/lib/dummy-data';

export async function GET(request: NextRequest) {
  try {
    // Return dummy data if database not configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const { searchParams } = new URL(request.url);
      const listed = searchParams.get('listed');
      const minPrice = searchParams.get('minPrice');
      const maxPrice = searchParams.get('maxPrice');
      const sort = searchParams.get('sort') || 'newest';

      // Only return minted items
      let filtered = dummyPosts.filter((item: any) => item.minted === true);

      // Filter by listed
      if (listed === 'true') {
        filtered = filtered.filter((item: any) => item.price_wei);
      }

      // Filter by price
      if (minPrice) {
        const minWei = parseFloat(minPrice) * 1e18;
        filtered = filtered.filter(
          (item: any) => parseFloat(item.price_wei) >= minWei
        );
      }

      if (maxPrice) {
        const maxWei = parseFloat(maxPrice) * 1e18;
        filtered = filtered.filter(
          (item: any) => parseFloat(item.price_wei) <= maxWei
        );
      }

      // Sort
      if (sort === 'price-low') {
        filtered.sort((a: any, b: any) =>
          parseFloat(a.price_wei) - parseFloat(b.price_wei)
        );
      } else if (sort === 'price-high') {
        filtered.sort((a: any, b: any) =>
          parseFloat(b.price_wei) - parseFloat(a.price_wei)
        );
      } else if (sort === 'newest' || sort === 'new') {
        filtered.sort(
          (a: any, b: any) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      } else if (sort === 'oldest') {
        filtered.sort(
          (a: any, b: any) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      } else if (sort === 'trending') {
        filtered.sort(
          (a: any, b: any) =>
            (b.post_features?.influence_score || 0) -
            (a.post_features?.influence_score || 0)
        );
      }

      // Calculate total supply from editions
      const calculateTotalSupply = (items: any[]) => {
        return items.reduce((total: number, item: any) => {
          if (item.edition_type === '1of1') return total + 1;
          if (item.edition_type === 'open') return total + (item.editions || 1000);
          if (item.edition_type === 'limited') return total + (item.editions || 1);
          return total + 1;
        }, 0);
      };

      return NextResponse.json({ 
        items: filtered,
        stats: {
          totalSupply: calculateTotalSupply(filtered),
          listed: filtered.filter((item: any) => item.price_wei).length,
          owners: new Set(filtered.map((item: any) => item.users?.handle).filter(Boolean)).size,
        }
      });
    }

    // Import Supabase only if needed
    const { supabaseAdmin } = await import('@/lib/supabase');
    
    if (!supabaseAdmin) {
      // Fallback to dummy data with stats
      const { searchParams } = new URL(request.url);
      const listed = searchParams.get('listed');
      const minPrice = searchParams.get('minPrice');
      const maxPrice = searchParams.get('maxPrice');
      const sort = searchParams.get('sort') || 'newest';

      let filtered = [...dummyPosts];

      if (listed === 'true') {
        filtered = filtered.filter((item: any) => item.price_wei);
      }

      if (minPrice) {
        const minWei = parseFloat(minPrice) * 1e18;
        filtered = filtered.filter(
          (item: any) => parseFloat(item.price_wei) >= minWei
        );
      }

      if (maxPrice) {
        const maxWei = parseFloat(maxPrice) * 1e18;
        filtered = filtered.filter(
          (item: any) => parseFloat(item.price_wei) <= maxWei
        );
      }

      // Sort
      if (sort === 'price-low') {
        filtered.sort((a: any, b: any) =>
          parseFloat(a.price_wei) - parseFloat(b.price_wei)
        );
      } else if (sort === 'price-high') {
        filtered.sort((a: any, b: any) =>
          parseFloat(b.price_wei) - parseFloat(a.price_wei)
        );
      } else if (sort === 'newest' || sort === 'new') {
        filtered.sort(
          (a: any, b: any) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      } else if (sort === 'oldest') {
        filtered.sort(
          (a: any, b: any) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      } else if (sort === 'trending') {
        filtered.sort(
          (a: any, b: any) =>
            (b.post_features?.influence_score || 0) -
            (a.post_features?.influence_score || 0)
        );
      }

      return NextResponse.json({
        items: filtered,
        stats: {
          totalSupply: filtered.length,
          listed: filtered.filter((item: any) => item.price_wei).length,
          owners: new Set(filtered.map((item: any) => item.users?.handle).filter(Boolean)).size,
        }
      });
    }

    const { searchParams } = new URL(request.url);
    const emotion = searchParams.get('emotion');
    const creatorId = searchParams.get('creatorId');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const listed = searchParams.get('listed');
    const sort = searchParams.get('sort') || 'new';
    const limit = parseInt(searchParams.get('limit') || '24');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = supabaseAdmin
      .from('posts')
      .select(
        '*, users:author_id(handle, display_name, avatar_url), post_features(emotion, influence_score)'
      )
      .eq('minted', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (listed === 'true') {
      query = query.not('price_wei', 'is', null);
    }

    if (emotion) {
      query = query.contains('post_features.emotion', { tone: emotion });
    }

    if (creatorId) {
      query = query.eq('author_id', creatorId);
    }

    if (minPrice) {
      const minWei = BigInt(parseFloat(minPrice) * 1e18).toString();
      query = query.gte('price_wei', minWei);
    }

    if (maxPrice) {
      const maxWei = BigInt(parseFloat(maxPrice) * 1e18).toString();
      query = query.lte('price_wei', maxWei);
    }

    // Sort handling
    if (sort === 'trending') {
      query = query.order('post_features.influence_score', {
        ascending: false,
      });
    } else if (sort === 'price-low') {
      query = query.order('price_wei', { ascending: true });
    } else if (sort === 'price-high') {
      query = query.order('price_wei', { ascending: false });
    } else if (sort === 'newest') {
      query = query.order('created_at', { ascending: false });
    } else if (sort === 'oldest') {
      query = query.order('created_at', { ascending: true });
    } else if (sort === 'most-collected') {
      // Would need aggregation - for now use created_at
      query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ items: [], error: error.message });
    }

    // Calculate stats
    const allItems = data || [];
    const calculateTotalSupply = (items: any[]) => {
      return items.reduce((total: number, item: any) => {
        if (item.edition_type === '1of1') return total + 1;
        if (item.edition_type === 'open') return total + (item.editions || 1000);
        if (item.edition_type === 'limited') return total + (item.editions || 1);
        return total + 1;
      }, 0);
    };

    const stats = {
      totalSupply: calculateTotalSupply(allItems),
      listed: allItems.filter((item: any) => item.price_wei).length,
      owners: new Set(allItems.map((item: any) => item.users?.handle).filter(Boolean)).size,
    };

    return NextResponse.json({ items: allItems, stats });
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json({ items: [], error: error.message }, { status: 500 });
  }
}

