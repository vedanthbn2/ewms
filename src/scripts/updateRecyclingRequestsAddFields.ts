import mongoose from 'mongoose';
import RecyclingRequest from '../app/models/RecyclingRequest';
import dbConnect from '../app/api/mongodb';

async function updateRecyclingRequests() {
  try {
    await dbConnect();

    const result = await RecyclingRequest.updateMany(
      {
        $or: [
          { model: { $exists: false } },
          { specialInstructions: { $exists: false } },
          { accessories: { $exists: false } },
        ],
      },
      {
        $set: {
          model: '',
          specialInstructions: '',
          accessories: [],
        },
      }
    );

    console.log(`Updated ${result.modifiedCount} recycling request documents.`);
    process.exit(0);
  } catch (error) {
    console.error('Error updating recycling requests:', error);
    process.exit(1);
  }
}

updateRecyclingRequests();
