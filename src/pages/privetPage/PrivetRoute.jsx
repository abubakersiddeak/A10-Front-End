import React, { use } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Navigate, useLocation } from "react-router";

export default function PrivetRoute({ children }) {
  const { currentUser, loading } = use(AuthContext);
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-green-50">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-t-blue-600 border-gray-200 animate-spin"></div>
          <div className="absolute inset-3 rounded-full bg-white"></div>
        </div>

        <p className="mt-6 text-gray-700 font-semibold text-lg animate-pulse">
          Checking authentication...
        </p>

        <div className="mt-4 w-40 h-2 bg-blue-200 rounded-full overflow-hidden relative">
          <div className="absolute inset-0 bg-blue-500/70 animate-[progress_2s_infinite]" />
        </div>

        <style jsx>{`
          @keyframes progress {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }
        `}</style>
      </div>
    );
  }

  if (currentUser && currentUser?.email) {
    return children;
  }
  return <Navigate to="/login" state={{ from: location }} replace></Navigate>;
}
