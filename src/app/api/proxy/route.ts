import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get('endpoint');

    if (!endpoint) {
        return NextResponse.json({ error: 'Endpoint parameter is required' }, { status: 400 });
    }

    try {
        // Map endpoint parameters to actual URLs
        const urlMap: Record<string, string> = {
            'unanalyzed-images': 'https://5f2f729312b1481b9b1b4eb9d00bc455.api.mockbin.io/unanalyzed-images',
            'categories': 'https://f6fe9241e02b404689f62c585d0bd967.api.mockbin.io/categories',
            'annotations': 'https://eb1b6f8bfab448df91c68bd442d6a968.api.mockbin.io/annotations'
        };

        const targetUrl = urlMap[endpoint];

        if (!targetUrl) {
            return NextResponse.json({ error: 'Invalid endpoint' }, { status: 400 });
        }

        const response = await fetch(targetUrl, {
            method: request.method,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Proxy error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch data' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get('endpoint');

    if (!endpoint || endpoint !== 'annotations') {
        return NextResponse.json({ error: 'Invalid endpoint for POST' }, { status: 400 });
    }

    try {
        const targetUrl = 'https://eb1b6f8bfab448df91c68bd442d6a968.api.mockbin.io/annotations';
        const body = await request.json();

        const response = await fetch(targetUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Proxy error:', error);
        return NextResponse.json(
            { error: 'Failed to submit data' },
            { status: 500 }
        );
    }
}