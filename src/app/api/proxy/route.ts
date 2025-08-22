import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get('endpoint');

    if (!endpoint) {
        return NextResponse.json({ error: 'Endpoint parameter is required' }, { status: 400 });
    }

    try {
        // Map endpoint parameters to actual URLs from Env.Local file
        const urlMap: Record<string, string> = {
            'unanalyzed-images': process.env.NEXT_PUBLIC_API_UNANALYZED_IMAGES as string,
            'categories': process.env.NEXT_PUBLIC_API_CATEGORIES as string,
            'annotations': process.env.NEXT_PUBLIC_API_ANNOTATIONS as string
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
        const targetUrl = process.env.NEXT_PUBLIC_API_ANNOTATIONS as string;
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