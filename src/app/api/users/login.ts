import { NextResponse } from 'next/server';
import dbConnect from '../mongodb';
import User from '../../models/User';
import Receiver from '../../models/Receiver';
import bcrypt from 'bcryptjs';

await dbConnect();

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    console.log('Login attempt with email:', email);
    console.log('Login attempt with password:', password);

    if (!email || !password) {
      return NextResponse.json({
        success: false,
        error: 'Email and password are required',
      }, { status: 400 });
    }

    const emailTrimmed = email.trim().toLowerCase();
    const passwordTrimmed = password.trim();

    // Find user by email only
    const user = await User.findOne({ email: emailTrimmed });
    console.log('User found by email:', user);

    if (user) {
      const isMatch = await bcrypt.compare(passwordTrimmed, user.password);
      console.log('User password match:', isMatch);
      if (isMatch) {
        return NextResponse.json({
          success: true,
          data: {
            id: user._id,
            email: user.email,
            fullName: user.name,
            phoneNumber: user.phone,
            token: 'mock-token-' + Date.now(),
            role: 'user',
          },
        });
      }
    }

    // Find receiver by email only
    const receiver = await Receiver.findOne({ email: emailTrimmed });
    console.log('Receiver found by email:', receiver);

    if (receiver) {
      const isMatch = await bcrypt.compare(passwordTrimmed, receiver.password);
      console.log('Receiver password match:', isMatch);
      if (isMatch) {
        return NextResponse.json({
          success: true,
          data: {
            id: receiver._id,
            email: receiver.email,
            fullName: receiver.name,
            phoneNumber: receiver.phone,
            token: 'mock-token-' + Date.now(),
            role: 'receiver',
          },
        });
      }
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid email or password',
    }, { status: 401 });
  } catch (error: unknown) {
    console.error('Error during login:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
