import dbConnect from './mongodb';
import User from '../models/User';
import Receiver from '../models/Receiver';

async function clearData() {
  await dbConnect();

  // Define admin email or criteria here
  const adminEmail = 'admin@example.com'; // Replace with actual admin email

  try {
    // Delete all users except admin
    await User.deleteMany({ email: { $ne: adminEmail } });
    // Delete all receivers
    await Receiver.deleteMany({});

    console.log('Cleared all users except admin and all receivers.');
  } catch (error) {
    console.error('Error clearing data:', error);
  } finally {
    process.exit();
  }
}

clearData();
