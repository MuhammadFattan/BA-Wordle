import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";

export default function LoginPage() {
  const { loginWithGoogle, isLoggedIn, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && isLoggedIn) navigate("/game");
  }, [isLoggedIn, loading, navigate]);

  const searchParams = new URLSearchParams(window.location.search);
  const error = searchParams.get("error");

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm flex flex-col items-center gap-6">
        {/* Logo / Title */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">Blue Archive</h1>
          <p className="text-lg text-blue-500 font-semibold">Wordle</p>
        </div>

        <p className="text-sm text-gray-500 text-center">
          Login untuk menyimpan statistik dan bersaing di leaderboard!
        </p>

        {/* Error message */}
        {error === "auth_failed" && (
          <div className="w-full px-4 py-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 text-center">
            Login gagal. Coba lagi.
          </div>
        )}

        {/* Google login button */}
        <button
          onClick={loginWithGoogle}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition shadow-sm"
        >
          {/* Google icon */}
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
            />
            <path
              fill="#4285F4"
              d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
            />
            <path
              fill="#FBBC05"
              d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
            />
            <path
              fill="#34A853"
              d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.35-8.16 2.35-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
            />
          </svg>
          <span className="text-sm font-medium text-gray-700">
            Masuk dengan Google
          </span>
        </button>

        {/* Guest mode */}
        <button
          onClick={() => navigate("/game")}
          className="text-sm text-gray-400 hover:text-gray-600 transition"
        >
          Lanjut tanpa login →
        </button>
      </div>
    </div>
  );
}

export function AuthCallbackPage() {
  const { handleCallback } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      handleCallback(token);
      navigate("/game", { replace: true });
    } else {
      navigate("/login?error=auth_failed", { replace: true });
    }
  }, [handleCallback, navigate]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500 text-sm">Memproses login...</p>
      </div>
    </div>
  )
}