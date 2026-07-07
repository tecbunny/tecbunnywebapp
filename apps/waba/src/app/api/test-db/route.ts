import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const messageId = crypto.randomUUID();
    const senderNumber = '919604136010';

    const { data, error } = await supabase
      .from('Message')
      .insert({
        id: crypto.randomUUID(),
        message_id: messageId,
        sender_number: senderNumber,
        direction: 'INBOUND',
        message_content: 'Test message for debugging',
        timestamp: new Date().toISOString()
      })
      .select();

    if (error) {
      return NextResponse.json({ success: false, error: error });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ success: false, exception: err.message });
  }
}
