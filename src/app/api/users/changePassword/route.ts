import { NextResponse } from 'next/server';
import dbConnect from '../../mongodb';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';

await dbConnect();

export async function POST(request: Request) {
  try {
    const { id, oldPassword, newPassword } = await request.json();

    console.log('ChangePassword API called with:', { id, oldPassword, newPassword });

    if (!id || !oldPassword || !newPassword) {
      console.log('Missing required fields');
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const user = await User.findById(id);
    if (!user) {
      console.log('User not found');
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      console.log('Old password is incorrect');
      return NextResponse.json({ success: false, error: 'Old password is incorrect' }, { status: 401 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    console.log('Password changed successfully for user:', id);

    return NextResponse.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing user password:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
