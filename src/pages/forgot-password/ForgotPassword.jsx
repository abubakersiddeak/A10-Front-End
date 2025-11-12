import React, { useState, useContext } from "react";

import { toast } from "react-toastify";
import { useParams } from "react-router";
import { AuthContext } from "../../context/AuthContext";

export default function ForgotPassword() {
  const { resetPassword } = useContext(AuthContext);
  const { email } = useParams();

  const [nemail, setEmail] = useState(email || "");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await resetPassword(nemail);
      toast.success("Password reset email sent!");
      window.open("https://mail.google.com/", "_blank");
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-center mb-6">Forgot Password</h1>
        <form onSubmit={handleReset} className="space-y-5">
          <div>
            <input
              type="email"
              placeholder="Enter your email"
              value={nemail}
              onChange={(e) => setEmail(e.target.value)}
              className="input input-bordered w-full"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn w-full bg-blue-600 text-white"
          >
            {loading ? "Sending..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
