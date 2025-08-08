// app/api/purchase/route.ts

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  const body = await req.json();

  const {
    wallet_address,
    tokens_bought,
    stable_used,
    usd_amount,
    tx_hash
  } = body;

  // Insert purchase
  const { error: insertError } = await supabase.from('purchases').insert({
    wallet_address,
    tokens_bought,
    stable_used,
    usd_amount,
    tx_hash,
  });

  if (insertError) {
    console.error('Insert purchase error:', insertError);
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  // Update stats
  const { data: statsRow, error: fetchError } = await supabase
    .from('presale_stats')
    .select('*')
    .limit(1)
    .single();

  if (fetchError || !statsRow) {
    return NextResponse.json({ error: fetchError?.message || 'Stats not found' }, { status: 500 });
  }

  const newTotal = parseFloat(statsRow.total_tokens_sold) + parseFloat(tokens_bought);
  const remaining = Math.max(parseFloat(statsRow.total_tokens_remaining) - parseFloat(tokens_bought), 0);

  const { error: updateError } = await supabase
    .from('presale_stats')
    .update({
      total_tokens_sold: newTotal,
      total_tokens_remaining: remaining,
      last_updated: new Date().toISOString()
    })
    .eq('id', statsRow.id);

  if (updateError) {
    console.error('Update stats error:', updateError);
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function GET() {
  const { data: stats, error } = await supabase
    .from('presale_stats')
    .select('*')
    .limit(1)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(stats);
}
