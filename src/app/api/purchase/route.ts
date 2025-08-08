// app/api/purchase/route.ts

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// ✅ Hardcoded for Free Plan
const SUPABASE_URL = 'https://iwshxkqeqidrlkvraekj.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3c2h4a3FlcWlkcmxrdnJhZWtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MzQzNTMsImV4cCI6MjA3MDAxMDM1M30.4GwNDe1iAbWhTOhkEjGpBz4vGHbz0yP6sWOYMa6bsOs';

// ✅ Create client safely inside function
function getSupabaseClient() {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

export async function POST(req: Request) {
  const supabase = getSupabaseClient();
  const body = await req.json();

  const {
    wallet_address,
    tokens_bought,
    stable_used,
    usd_amount,
    tx_hash
  } = body;

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
  const supabase = getSupabaseClient();

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
