import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getUserID } from '../sign-in/auth';

interface UserDetails {
  name: string;
  email: string;
  phone: string;
  approved: boolean;
  role: string;
  createdAt: string;
  fullname?: string;
}

const Profile = () => {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const userId = getUserID();

  useEffect(() => {
    if (userId) {
      fetch(`/api/users/${userId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setUserDetails(data.data);
          }
        })
        .catch((error) => {
          console.error('Error fetching user details:', error);
        });
    }
  }, [userId]);

  if (!userDetails) {
    return <div>Loading user details...</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex flex-col justify-center items-center gap-8">
        <div className="md:w-1/2 w-full">
          <div className="bg-white rounded-lg shadow-lg py-6 px-6">
            <div className="text-center mb-6">
              <h3 className="text-3xl text-gray-900 font-semibold">{userDetails.name || "User"}</h3>
            </div>
            <table className="w-full text-xl">
              <tbody>
                 <tr>
                  <td className="px-4 py-3 text-left text-gray-500 font-semibold border-b border-gray-200">Full Name</td>
                  <td className="px-4 py-3 text-left border-b border-gray-200">{userDetails.name || userDetails.name}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-left text-gray-500 font-semibold border-b border-gray-200">Email</td>
                  <td className="px-4 py-3 text-left border-b border-gray-200">{userDetails.email}</td>
                </tr>
               
                <tr>
                  <td className="px-4 py-3 text-left text-gray-500 font-semibold border-b border-gray-200">Phone</td>
                  <td className="px-4 py-3 text-left border-b border-gray-200">{userDetails.phone}</td>
                </tr>
              </tbody>
            </table>
            <div className="mt-6 flex justify-center">
              <Link href="/profile/change-password">
                <button className="bg-emerald-600 text-white px-6 py-3 rounded hover:bg-emerald-700">
                  Change Password
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
