import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'users.json');

let users: any[] = [];

async function loadUsers() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    users = JSON.parse(data);
  } catch (error: unknown) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      await fs.writeFile(DATA_FILE, '[]');
      users = [];
    } else {
      console.error('Error loading users:', error);
    }
  }
}

loadUsers();

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({
        success: false,
        error: 'Email and password are required',
      }, { status: 400 });
    }

    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Invalid email or password',
      }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        fullName: user.name,
        phoneNumber: user.phone,
        token: 'mock-token-' + Date.now(),
      },
    });
  } catch (error: unknown) {
    console.error('Error during user login:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
