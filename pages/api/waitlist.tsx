// pages/api/waitlist.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

type Data = {
  success?: boolean;
  user?: any;
  referralCode?: string;
  error?: string;
};

async function generateUniqueCode(
  supabase: SupabaseClient<any, "public", any>,
  email: string,
  maxRetries = 10
): Promise<string> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const timestamp = Date.now().toString(36).slice(-4).toUpperCase();
    const emailHash = Buffer.from(email).toString('base64').replace(/[^A-Za-z0-9]/g, '').substring(0, 4).toUpperCase();
    const randomChars = Math.random().toString(36).substring(2, 4).toUpperCase();
    const code = `${emailHash}${timestamp}${randomChars}`.substring(0, 8);
    const { data: existingCode, error } = await supabase
      .from('referral_codes')
      .select('code')
      .eq('code', code)
      .single();
    if (error && error.code === 'PGRST116') {
      return code;
    }
    if (error && error.code !== 'PGRST116') {
      throw error;
    }
  }
  throw new Error('Unable to generate unique referral code after multiple attempts');
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'content-type, authorization, x-client-info, apikey');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { email, code } = req.body;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );

  try {
    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('waitlist')
      .select('email')
      .eq('email', email);

    if (checkError) throw checkError;

    if (existingUser && existingUser.length > 0) {
      res.status(400).json({ error: 'user already exists' });
      return;
    }

    if (code) {
      const { data: codeData, error: codeError } = await supabase
        .from('referral_codes')
        .select('uses')
        .eq('code', code)
        .single();
      if (codeError || !codeData) {
        res.status(400).json({ error: 'Invalid referral code' });
        return;
      }
      const { error: updateError } = await supabase
        .from('referral_codes')
        .update({ uses: (codeData.uses || 0) + 1 })
        .eq('code', code);
      if (updateError) throw updateError;
    }

    const newUser = {
      email: email,
      used_code: code || null,
    };
    const { data: createdUser, error: insertError } = await supabase
      .from('waitlist')
      .insert(newUser)
      .select()
      .single();
    if (insertError) throw insertError;

    const newCode = await generateUniqueCode(supabase, createdUser.email);
    const { error: referralError } = await supabase
      .from('referral_codes')
      .insert({
        code: newCode,
        owner_waitlist_id: createdUser.id,
        uses: 0,
      })
      .select();
    if (referralError) throw referralError;

    res.status(200).json({
      success: true,
      user: createdUser,
      referralCode: newCode,
    });
  } catch (err: any) {
    res.status(500).json({ error: err?.message ?? String(err) });
  }
} 
