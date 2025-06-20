import { NextResponse } from 'next/server';
import dbConnect from '../../mongodb';
import User from '../../../models/User';

await dbConnect();

export async function GET() {
  try {
    const users = await User.find().select('email name phone password').lean();
    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch users' }, { status: 500 });
  }
}
