import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { supabaseAdmin } from '@/lib/supabase';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { postId, text } = body;

    if (!postId || !text) {
      return NextResponse.json(
        { error: 'Missing postId or text' },
        { status: 400 }
      );
    }

    // Generate summary
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are a concise thought summarizer. Create a 1-2 sentence summary that captures the essence and emotion of the thought.',
        },
        {
          role: 'user',
          content: text,
        },
      ],
      max_tokens: 100,
    });

    const summary = completion.choices[0]?.message?.content || '';

    // Generate TTS
    const ttsResponse = await openai.audio.speech.create({
      model: 'tts-1',
      voice: (process.env.TTS_VOICE_ID as any) || 'alloy',
      input: summary,
    });

    const audioBuffer = Buffer.from(await ttsResponse.arrayBuffer());
    // TODO: Upload to Supabase Storage or IPFS
    // For now, return summary

    // Update post_features
    const { error } = await supabaseAdmin
      .from('post_features')
      .upsert({
        post_id: postId,
        summary,
        // audio_url will be set after upload
      });

    if (error) throw error;

    return NextResponse.json({
      summary,
      // audio_url: uploadedUrl,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

