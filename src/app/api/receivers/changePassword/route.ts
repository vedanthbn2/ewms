import { NextResponse } from 'next/server';
import dbConnect from '../../mongodb';
import Receiver from '../../../models/Receiver';
import bcrypt from 'bcryptjs';

await dbConnect();

export async function POST(request: Request) {
  try {
    const { id, oldPassword, newPassword } = await request.json();

    if (!id || !oldPassword || !newPassword) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const receiver = await Receiver.findById(id);
    if (!receiver) {
      return NextResponse.json({ success: false, error: 'Receiver not found' }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(oldPassword, receiver.password);
    if (!isMatch) {
      return NextResponse.json({ success: false, error: 'Old password is incorrect' }, { status: 401 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    receiver.password = hashedPassword;
    await receiver.save();

    return NextResponse.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing receiver password:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
