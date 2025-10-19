import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    // Test Prisma import
    console.log('Health check: Testing Prisma import...');
    const { default: prisma } = await import("../../../lib/db");
    console.log('Health check: Prisma imported successfully');
    
    // Test database connection
    console.log('Health check: Testing database connection...');
    await prisma.$connect();
    console.log('Health check: Database connected');
    
    // Test query
    console.log('Health check: Testing query...');
    const count = await prisma.order.count();
    console.log('Health check: Query successful, order count:', count);
    
    await prisma.$disconnect();
    
    return NextResponse.json({ 
      status: 'ok',
      prisma: 'connected',
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
