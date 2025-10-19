import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { toast } from "sonner";
import { LogoutApi } from "../API/authApi";
import { getUser, resetPassword } from "../API/profileApi";
import axios from "axios";

type UserProps = {
  id?: string;
  phone: string;
  email: string;
};

export default function ProfilePage() {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] =
    useState(false);
  const [user, setUser] = useState<UserProps | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const token = localStorage.getItem("accessToken");
  const fetchUser = async () => {
    try {
      const response = await getUser();
      if (response?.status === 200) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error(error);
      toast.error("Cannot find user");
    }
  };

  useEffect(() => {
    fetchUser();
  }, [token]);

  const handleLogout = () => {
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = async () => {
    try {
      const token = localStorage.getItem("accessToken") || "";
      const response = await LogoutApi(token);

      if (response && response.status === 200) {
        localStorage.removeItem("accessToken");
        toast.success(response.data.message || "Logout successful!");
        window.location.href = "/register";
      } else {
        toast.error(response?.data?.error || "Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed");
    }
  };

  const handleResetPassword = () => {
    setIsResetPasswordModalOpen(true);
  };

  const confirmResetPassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    try {
      const response = await resetPassword(
        currentPassword,
        newPassword,
        user?.id
      );

      if (response?.status === 200) {
        toast.success("Password reset successful!");
        setIsResetPasswordModalOpen(false);
        resetPasswordForm();
      } else {
        // toast.error(
        //   "Unexpected response: " +
        //     (response?.data?.message || "No message available")
        // );

        toast.error('Your Current Password is Incorrect')
      }
    } catch (error) {
      console.error("Caught Error in confirmResetPassword:", error);
      if (axios.isAxiosError(error)) {
        const errorMsg =
          error.response?.data?.message ||
          error.response?.statusText ||
          error.message ||
          "Password reset failed";
        toast.error(errorMsg);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  const resetPasswordForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const closeLogoutModal = () => {
    setIsLogoutModalOpen(false);
  };

  const closeResetPasswordModal = () => {
    setIsResetPasswordModalOpen(false);
    resetPasswordForm();
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-lg p-8 w-full max-w-md border border-gray-700">
          <h1 className="text-2xl font-bold text-white mb-6">Profile</h1>

          <div className="space-y-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">Email</p>
              <p className="text-white">{user?.email}</p>
            </div>

            <div>
              <p className="text-gray-400 text-sm mb-1">Phone</p>
              <p className="text-white">{user?.phone}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              className="mt-6 w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
              onClick={handleResetPassword}
            >
              Reset Password
            </button>

            <button
              className="mt-6 w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Logout Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-sm border border-gray-700">
            <p className="text-gray-300 mb-4">
              Are you sure you want to Logout?
            </p>

            <div className="flex justify-end gap-3">
              <button
                className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg"
                onClick={closeLogoutModal}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
                onClick={() => {
                  confirmLogout();
                  closeLogoutModal();
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {isResetPasswordModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4">
              Reset Password
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="Enter new password"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg"
                onClick={closeResetPasswordModal}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
                onClick={confirmResetPassword}
              >
                Reset Password
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
