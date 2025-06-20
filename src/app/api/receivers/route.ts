
import { NextResponse } from 'next/server';
import dbConnect from '../mongodb';
import Receiver from '../../models/Receiver';
import bcrypt from 'bcryptjs';

await dbConnect();

async function cleanSampleReceivers() {
  try {
    await Receiver.deleteMany({ name: { $in: ['Sample Receiver One', 'Sample Receiver Two'] } });
  } catch (error) {
    console.error('Error cleaning sample receivers:', error);
  }
}

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

    // Check for duplicate email
    const emailExists = await Receiver.findOne({ email: data.email.toLowerCase() });
    if (emailExists) {
      return NextResponse.json({
        success: false,
        error: 'Email already exists',
      }, { status: 400 });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newReceiver = new Receiver({
      name: data.name,
      email: data.email.toLowerCase(),
      phone: data.phone,
      password: hashedPassword,
      approved: false,
    });

    await newReceiver.save();

    return NextResponse.json({
      success: true,
      data: newReceiver,
    });
  } catch (error: unknown) {
    console.error('Error saving receiver:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await Receiver.deleteMany({});
    return NextResponse.json({ success: true, message: 'All receivers removed' });
  } catch (error: unknown) {
    console.error('Error deleting receivers:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

export async function GET() {
  await cleanSampleReceivers();
  try {
    const receivers = await Receiver.find().sort({ createdAt: -1 });
    if (receivers.length === 0) {
      return NextResponse.json({ success: true, data: [], message: 'No receivers found' });
    }
    return NextResponse.json({ success: true, data: receivers });
  } catch (error: unknown) {
    console.error('Error fetching receivers:', error);
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

    const updatedReceiver = await Receiver.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedReceiver) {
      return NextResponse.json({ success: false, error: 'Receiver not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedReceiver });
  } catch (error: unknown) {
    console.error('Error updating receiver:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
