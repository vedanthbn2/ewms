import { NextResponse } from 'next/server';
import dbConnect from '../mongodb';
import User from '../../models/User';
import bcrypt from 'bcryptjs';

await dbConnect();

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Validate required fields
    const requiredFields = ['name', 'email', 'phone', 'password'];
    for (const field of requiredFields) {
      if (!data[field] || typeof data[field] !== 'string' || data[field].trim() === '') {
        return NextResponse.json({
          success: false,
          error: `Missing or invalid field: ${field}`,
        }, { status: 400 });
      }
    }

    const emailTrimmed = data.email.trim().toLowerCase();
    const passwordTrimmed = data.password.trim();

    // Check if user with same email already exists
    const existingUser = await User.findOne({ email: emailTrimmed });
    if (existingUser) {
      return NextResponse.json({
        success: false,
        error: 'already signup',
      }, { status: 409 });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(passwordTrimmed, 10);

    const newUser = new User({
      name: data.name.trim(),
      email: emailTrimmed,
      phone: data.phone.trim(),
      password: hashedPassword,
      approved: false,
    });

    await newUser.save();

    return NextResponse.json({
      success: true,
      data: newUser,
    });
  } catch (error: unknown) {
    console.error('Error saving user:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    if (users.length === 0) {
      return NextResponse.json({ success: true, data: [], message: 'No users found' });
    }
    return NextResponse.json({ success: true, data: users });
  } catch (error: unknown) {
    console.error('Error fetching users:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, updates } = await request.json();

    if (!id || !updates) {
      return NextResponse.json({ success: false, error: 'Missing id or updates' }, { status: 400 });
    }

    const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedUser) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedUser });
  } catch (error: unknown) {
    console.error('Error updating user:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
