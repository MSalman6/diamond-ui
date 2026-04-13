/**
 * Next.js API Route - External API Proxy
 * Proxies requests to external backend API with Bearer token
 * This runs on the server and never exposes the API token to the client
 */

import { NextRequest, NextResponse } from 'next/server';
import { makeApiRequest } from '@/lib/serverApiClient';
import logger from '@/utils/logger';

/**
 * Handle GET requests
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    // Await params before accessing properties (Next.js 15+ requirement)
    const { path: pathSegments } = await params;
    const path = pathSegments.join('/');
    
    logger.log(`[API Route] GET request for path: ${path}`);
    
    // Extract query parameters from the URL
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    
    // Construct the full endpoint with query parameters
    const endpoint = queryString ? `${path}?${queryString}` : path;
    
    logger.log(`[API Route] Full endpoint: ${endpoint}`);
    
    // Make request to external API with Bearer token
    const response = await makeApiRequest(endpoint, {
      method: 'GET',
    });
    
    logger.log(`[API Route] Response: ${response.ok ? 'OK' : 'ERROR'}, Status: ${response.status}`);
    
    // Return the response to the client (without exposing token)
    if (response.ok) {
      return NextResponse.json(response.data, { status: response.status });
    } else {
      return NextResponse.json(
        { error: 'External API request failed', details: response.data },
        { status: response.status }
      );
    }
  } catch (error) {
    logger.error('API route error:', error);
    
    // Return error without leaking sensitive information
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * Handle POST requests
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    // Await params before accessing properties (Next.js 15+ requirement)
    const { path: pathSegments } = await params;
    const path = pathSegments.join('/');
    const body = await request.json().catch(() => null);
    
    const response = await makeApiRequest(path, {
      method: 'POST',
      body,
    });
    
    if (response.ok) {
      return NextResponse.json(response.data, { status: response.status });
    } else {
      return NextResponse.json(
        { error: 'External API request failed', details: response.data },
        { status: response.status }
      );
    }
  } catch (error) {
    logger.error('API route error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * Handle PUT requests
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    // Await params before accessing properties (Next.js 15+ requirement)
    const { path: pathSegments } = await params;
    const path = pathSegments.join('/');
    const body = await request.json().catch(() => null);
    
    const response = await makeApiRequest(path, {
      method: 'PUT',
      body,
    });
    
    if (response.ok) {
      return NextResponse.json(response.data, { status: response.status });
    } else {
      return NextResponse.json(
        { error: 'External API request failed', details: response.data },
        { status: response.status }
      );
    }
  } catch (error) {
    logger.error('API route error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * Handle DELETE requests
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    // Await params before accessing properties (Next.js 15+ requirement)
    const { path: pathSegments } = await params;
    const path = pathSegments.join('/');
    
    const response = await makeApiRequest(path, {
      method: 'DELETE',
    });
    
    if (response.ok) {
      return NextResponse.json(response.data, { status: response.status });
    } else {
      return NextResponse.json(
        { error: 'External API request failed', details: response.data },
        { status: response.status }
      );
    }
  } catch (error) {
    logger.error('API route error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
