import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const API_BASE = `${process.env.BACKEND_URL}/api/${process.env.API_VERSION}`;

async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get('access_token')?.value;
}

export async function GET(request: NextRequest) {
  const token = await getToken();
  if (!token) return NextResponse.json({ detail: 'Not authenticated' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const queryString = searchParams.toString();

  const response = await fetch(
    `${API_BASE}/users/${queryString ? `?${queryString}` : ''}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}

export async function POST(request: NextRequest) {
  const token = await getToken();
  if (!token) return NextResponse.json({ detail: 'Not authenticated' }, { status: 401 });

  const body = await request.json();

  const response = await fetch(`${API_BASE}/users/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}