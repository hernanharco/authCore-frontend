import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const API_BASE = `${process.env.BACKEND_URL}/api/${process.env.API_VERSION}`;

async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get('access_token')?.value;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = await getToken();
  if (!token) return NextResponse.json({ detail: 'Not authenticated' }, { status: 401 });

  const { id } = await params;

  const response = await fetch(`${API_BASE}/users/${id}`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = await getToken();
  if (!token) return NextResponse.json({ detail: 'Not authenticated' }, { status: 401 });

  const { id } = await params;
  const body = await request.json();

  const response = await fetch(`${API_BASE}/users/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = await getToken();
  if (!token) return NextResponse.json({ detail: 'Not authenticated' }, { status: 401 });

  const { id } = await params;

  const response = await fetch(`${API_BASE}/users/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}