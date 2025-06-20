import dbConnect from '../app/api/mongodb';
import User from '../app/models/User';

async function removeTestUsers() {
  await dbConnect();

  const testUsersEmails = [
    "varun@123",
    "user1@123",
    "shetty@123",
    "vedanthbn2@gmail.com",
    "vedanthshetty2@gmail.com",
    "vedanthshetty@gmail.com",
    "vedanth@gmail.com"
  ];

  const testUsersNames = [
    "varun",
    "user1",
    "VEDANTH SHETTY",
    "vedanth shetty",
    "VEDANTH SHETTY B N"
  ];

  try {
    // Delete users by email
    await User.deleteMany({ email: { $in: testUsersEmails } });
    // Delete users by name
    await User.deleteMany({ name: { $in: testUsersNames } });

    console.log('Removed specified test users from the database.');
  } catch (error) {
    console.error('Error removing test users:', error);
  } finally {
    process.exit();
  }
}

removeTestUsers();
