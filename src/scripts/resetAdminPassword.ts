import dbConnect from '../app/api/mongodb';
import User from '../app/models/User';
const bcrypt = require('bcryptjs');

async function resetAdminPassword() {
  await dbConnect();

  const adminEmail = 'admin@local.com';
  const newPassword = 'admin123';

  try {
    let adminUser = await User.findOne({ email: adminEmail });
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    if (!adminUser) {
      // Create admin user if not exists
      adminUser = new User({
        name: 'admin',
        email: adminEmail,
        phone: '0000000000',
        password: hashedPassword,
        approved: true,
        role: 'admin',
      });
      await adminUser.save();
      console.log('Admin user created successfully.');
    } else {
      // Reset password if user exists
      adminUser.password = hashedPassword;
      await adminUser.save();
      console.log('Admin password has been reset successfully.');
    }
  } catch (error) {
    console.error('Error resetting or creating admin user:', error);
  } finally {
    process.exit();
  }
}

resetAdminPassword();
