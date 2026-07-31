import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Eye, EyeOff, Shield } from "lucide-react";
import { ROLES } from "../../constants/roles";


function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [focusedField, setFocusedField] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();
  const handleSubmit = async (e) => {
  e.preventDefault();

  setUsernameError("");
  setPasswordError("");

  let hasError = false;

  if (!username.trim()) {
    setUsernameError("Username is required");
    hasError = true;
  }

  if (!password.trim()) {
    setPasswordError("Password is required");
    hasError = true;
  }

  if (hasError) return;

 try {
  const user = await login(username, password);

  switch (user.role) {
  case ROLES.OWNER:
    navigate("/owner-dashboard");
    break;

  case ROLES.STORE_MANAGER:
    navigate("/manager-dashboard");
    break;

  case ROLES.STAFF:
    navigate("/staff-dashboard");
    break;

  case ROLES.DELIVERY:
    navigate("/delivery");
    break;
}
} catch (error) {
  console.error(error);
  setPasswordError("Invalid username or password");
}  
};

  const isFormValid = username.trim() && password.trim();

  return (
    <div className="min-h-screen bg-[#181b21] flex flex-col lg:flex-row font-sans">

      {/* ── Left panel – branding ── */}
      <div className="lg:w-[40%] bg-[#1c1f27] border-b lg:border-b-0 lg:border-r border-[#252930] relative overflow-hidden flex-shrink-0">

        {/* Subtle grid texture */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              {/* Fine grid */}
              <pattern id="grid-sm" width="24" height="24" patternUnits="userSpaceOnUse">
                <path d="M 24 0 L 0 0 0 24" fill="none" stroke="white" strokeWidth="0.4" opacity="0.035"/>
              </pattern>
              {/* Coarser modular lines */}
              <pattern id="grid-lg" width="96" height="96" patternUnits="userSpaceOnUse">
                <path d="M 96 0 L 0 0 0 96" fill="none" stroke="white" strokeWidth="0.6" opacity="0.04"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-sm)" />
            <rect width="100%" height="100%" fill="url(#grid-lg)" />
          </svg>
        </div>

        <div className="relative z-10 h-full flex flex-col justify-center px-10 lg:px-16 py-16 lg:py-24">

          {/* Logo mark + wordmark */}
          <div className="flex items-center gap-3.5 mb-5">
            {/* Icon – 15% larger than original w-10 → ~w-12 */}
            <div className="w-[52px] h-[52px] bg-[#4a7c9e] rounded-lg flex items-center justify-center flex-shrink-0">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white" fillOpacity="0.92"/>
                <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.92"/>
                <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.92"/>
              </svg>
            </div>
            {/* Wordmark – 25% larger than text-2xl (1.5rem → ~1.875rem), bold */}
            <span className="text-[2.0625rem] font-bold text-white tracking-tight leading-none">
              Suvidha
            </span>
          </div>

          {/* Divider */}
          <div className="h-[1px] w-14 bg-[#4a7c9e] mb-7 opacity-80"></div>

          {/* Tagline – ~15% larger than text-lg, slightly heavier */}
          <h2 className="text-[1.2rem] font-semibold text-[#c2c7d0] mb-4 leading-snug tracking-wide max-w-xs">
            Centralized Multi-Store<br />Pharmacy Operations
          </h2>

          {/* Description – narrowed for readability */}
          <p className="text-[0.875rem] text-[#6e7480] leading-relaxed max-w-[260px]">
            Manage reports, track sales, monitor staff productivity, and control operations across all pharmacy branches.
          </p>
        </div>

        {/* Bottom-left version stamp */}
        <div className="absolute bottom-6 left-10 lg:left-16 z-10">
          <span className="text-[0.7rem] text-[#40444e] tracking-widest uppercase font-medium">
            v4.2.1
          </span>
        </div>
      </div>

      {/* ── Right panel – login ── */}
      <div className="lg:w-[60%] flex items-center justify-center px-6 py-16 lg:px-12 bg-[#181b21]">
        <div className="w-full max-w-[420px]">

          {/* Page heading */}
          <div className="mb-8">
            <h1 className="text-[1.75rem] font-semibold text-white mb-1.5 tracking-tight">
              Welcome back
            </h1>
            <p className="text-[0.875rem] text-[#6e7480]">
              Sign in to your Suvidha account
            </p>
          </div>

          {/* Auth card */}
          <div className="bg-[#1c1f27] border border-[#2d3140] rounded-xl shadow-[0_6px_28px_rgba(0,0,0,0.42)] px-8 py-8">

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Username */}
              <div>
                <label htmlFor="username" className="block text-[0.8125rem] font-medium text-[#a0a5b0] mb-2 tracking-wide">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setUsernameError(''); }}
                  onFocus={() => setFocusedField('username')}
                  onBlur={() => setFocusedField(null)}
                  autoComplete="username"
                  className={`w-full px-3.5 py-2.5 bg-[#14161b] border rounded-lg text-[0.9375rem] text-white placeholder-[#3f4350] transition-all duration-150 outline-none ${
                    usernameError
                      ? 'border-[#c0605f]'
                      : focusedField === 'username'
                      ? 'border-[#4a7c9e] ring-2 ring-[#4a7c9e]/15'
                      : 'border-[#252930] hover:border-[#323740]'
                  }`}
                  placeholder="Enter your username"
                />
                {usernameError && (
                  <p className="mt-1.5 text-[0.8125rem] text-[#c0605f]">{usernameError}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-[0.8125rem] font-medium text-[#a0a5b0] mb-2 tracking-wide">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setPasswordError(''); }}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    autoComplete="current-password"
                    className={`w-full px-3.5 py-2.5 bg-[#14161b] border rounded-lg text-[0.9375rem] text-white placeholder-[#3f4350] pr-11 transition-all duration-150 outline-none ${
                      passwordError
                        ? 'border-[#c0605f]'
                        : focusedField === 'password'
                        ? 'border-[#4a7c9e] ring-2 ring-[#4a7c9e]/15'
                        : 'border-[#252930] hover:border-[#323740]'
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4a4f5c] hover:text-[#8a909e] transition-colors duration-150 p-0.5"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
  <EyeOff className="w-4 h-4" />
) : (
  <Eye className="w-4 h-4" />
)}
                  </button>
                </div>
                {passwordError && (
                  <p className="mt-1.5 text-[0.8125rem] text-[#c0605f]">{passwordError}</p>
                )}
              </div>

              {/* CTA */}
              <div className="pt-1">
                <button
                  type="submit"
                  disabled={!isFormValid}
                  className={`w-full py-2.5 px-4 rounded-lg text-[0.9375rem] font-semibold tracking-wide transition-all duration-150 ${
                    isFormValid
                      ? 'bg-[#4a7c9e] hover:bg-[#3d6d8c] text-white shadow-md shadow-[#4a7c9e]/10 active:scale-[0.99]'
                      : 'bg-[#1e2129] text-[#3a3f4a] cursor-not-allowed border border-[#252930]'
                  }`}
                >
                  Sign In
                </button>
              </div>

              {/* Forgot password */}
              <div className="text-center">
                <button
                  type="button"
                  className="text-[0.8125rem] text-[#4e6f85] hover:text-[#5f84a0] transition-colors duration-150"
                >
                  Forgot password?
                </button>
              </div>
            </form>
          </div>

          {/* Trust signals */}
          <div className="mt-7 flex flex-col items-center gap-1.5">
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[#525a6e]" />
              <p className="text-[0.75rem] text-[#545d72] tracking-wide">
                Authorized access only
              </p>
            </div>
            <p className="text-[0.7rem] text-[#434b5e] tracking-widest uppercase font-medium">
              Owner &amp; Staff Portal
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default LoginScreen;
