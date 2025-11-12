import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useContext } from "react";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";
import googelLogo from "../../assets/images/icons8-google-logo-48.png";
import { AuthContext } from "../../context/AuthContext";

export default function Login() {
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("example@gmail.com");

  const { loginUser, signupWithGoogle } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  // Login with email & password
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    setLoading(true);

    try {
      const userCredential = await loginUser(email, password);
      const user = userCredential.user;
      const token = await user.getIdToken();

      // Send user info to backend
      await fetch(`${import.meta.env.VITE_BACKEND_DOMAIN}/api/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: user.displayName || "Anonymous",
          email: user.email,
        }),
      });

      toast.success("Login successful ");
      setLoading(false);
      navigate(from, { replace: true });
    } catch (error) {
      console.error(error);
      toast.error("Invalid Email or Password ");
      setLoading(false);
    }
  };

  // Login with Google
  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signupWithGoogle();
      const user = result.user;
      const token = await user.getIdToken();

      await fetch(`${import.meta.env.VITE_BACKEND_DOMAIN}/api/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: user.displayName,
          email: user.email,
        }),
      });

      toast.success("Google Login successful ");
      setLoading(false);
      navigate(from, { replace: true });
    } catch (error) {
      console.error(error);
      toast.error("Google Sign-In Failed ");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-custom-wave px-4">
      <div className="rounded-3xl shadow-2xl border-t-8 border-green-500/80 transition-all duration-300 login-card w-full max-w-md bg-white  p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Login to EcoTrack
        </h1>

        <form onSubmit={handleFormSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="input input-bordered w-full bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              name="password"
              type={showPass ? "text" : "password"}
              placeholder="Enter your password"
              className="input input-bordered w-full rounded-md"
              required
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-8 cursor-pointer"
            >
              {showPass ? <Eye /> : <EyeOff />}
            </button>
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <Link
              to={`/forgot-password/${email}`}
              className="text-sm text-green-600 hover:underline hover:text-green-700 transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="btn w-full bg-green-600 hover:bg-green-700 text-white font-semibold transition-all"
            disabled={loading}
          >
            {loading ? (
              <span className="loading loading-spinner text-neutral"></span>
            ) : (
              "Login"
            )}
          </button>
        </form>

        {/* Google Login */}
        <button
          onClick={handleGoogleLogin}
          className="btn w-full text-black font-semibold transition-all mt-4"
          disabled={loading}
        >
          <span>
            <img className="h-7 inline" src={googelLogo} alt="Google logo" />
          </span>{" "}
          <span>Google</span>
        </button>

        <div className="divider text-gray-400">or</div>

        {/* Signup Link */}
        <p className="text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-green-600 font-medium hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
