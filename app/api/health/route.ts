import { NextResponse } from 'next/server';
import { countOrders } from '../../../lib/order-store';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    console.log('Health check: Counting orders...');
    const { count, source } = await countOrders();
    console.log('Health check: Order count retrieved from', source, 'store:', count);
    
    return NextResponse.json({ 
      status: 'ok',
      storage: source,
      orderCount: count,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json({ 
      status: 'error',
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
