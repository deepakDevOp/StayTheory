import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Mail, Lock, ArrowRight, RotateCcw, ShieldCheck, Loader2, Eye, EyeOff } from "lucide-react";
import { publicService } from "../services/publicService";

type Step = "email" | "otp" | "success";

const SESSION_KEY = "st_otp_session";

function saveSession(email: string, sentAt: number) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({ email, sentAt }));
}
function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
}
function loadSession(): { email: string; sentAt: number } | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Discard if OTP has already expired (10 min)
    if (Date.now() - parsed.sentAt > 10 * 60 * 1000) {
      clearSession();
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export default function AdminLogin() {
  const navigate = useNavigate();

  // Restore OTP step if page was reloaded mid-flow
  const restored = loadSession();
  const [step, setStep] = useState<Step>(restored ? "otp" : "email");
  const [email, setEmail] = useState(restored?.email ?? "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(false);
  // Remaining cooldown from when OTP was originally sent
  const [resendCooldown, setResendCooldown] = useState(() => {
    if (!restored) return 0;
    const elapsed = Math.floor((Date.now() - restored.sentAt) / 1000);
    return Math.max(0, 60 - elapsed);
  });
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Lock body scroll while login page is mounted
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("staytheory_token");
    if (token) navigate("/admin", { replace: true });
  }, [navigate]);

  // Resend countdown
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  // Auto-focus first OTP box when step changes
  useEffect(() => {
    if (step === "otp") {
      setTimeout(() => otpRefs.current[0]?.focus(), 350);
    }
  }, [step]);

  const handleEmailSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await publicService.requestOtp(email.trim().toLowerCase(), password);
      setStep("otp");
      setResendCooldown(60);
      saveSession(email.trim().toLowerCase(), Date.now());
    } catch (err: any) {
      const msg = err.response?.data?.detail;
      setError(typeof msg === "string" ? msg : "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (idx: number, val: string) => {
    const digit = val.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[idx] = digit;
    setOtp(next);
    setError("");
    if (digit && idx < 5) otpRefs.current[idx + 1]?.focus();
    if (next.every((d) => d !== "")) {
      submitOtp(next.join(""));
    }
  };

  const handleOtpKeyDown = (idx: number, e: { key: string }) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      otpRefs.current[idx - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && idx > 0) otpRefs.current[idx - 1]?.focus();
    if (e.key === "ArrowRight" && idx < 5) otpRefs.current[idx + 1]?.focus();
  };

  const handleOtpPaste = (e: { clipboardData: { getData(type: string): string } }) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      const digits = pasted.split("");
      setOtp(digits);
      submitOtp(pasted);
    }
  };

  const submitOtp = async (code: string) => {
    setError("");
    setLoading(true);
    try {
      const data = await publicService.verifyOtp(email.trim().toLowerCase(), code);
      localStorage.setItem("staytheory_token", data.access_token);
      localStorage.setItem("staytheory_refresh_token", data.refresh_token);
      clearSession();
      setStep("success");
      setTimeout(() => navigate("/admin", { replace: true }), 1200);
    } catch (err: any) {
      const msg = err.response?.data?.detail;
      clearSession();
      setOtp(["", "", "", "", "", ""]);
      setStep("email");
      setError("");
      const errMsg = typeof msg === "string" ? msg : "Invalid or expired OTP. Please sign in again.";
      setToast(errMsg);
      setTimeout(() => setToast(""), 4000);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setError("");
    setOtp(["", "", "", "", "", ""]);
    setLoading(true);
    try {
      await publicService.requestOtp(email.trim().toLowerCase(), password);
      setResendCooldown(60);
      saveSession(email.trim().toLowerCase(), Date.now());
    } catch {
      setError("Failed to resend OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="h-[100dvh] overflow-hidden flex items-center justify-center px-4"
      style={{
        background: "linear-gradient(135deg, #fdf8f5 0%, #f5ede6 50%, #fdf8f5 100%)",
      }}
    >
      {/* Background decorative circles */}
      <div className="fixed top-1/4 -left-24 w-72 h-72 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
      <div className="fixed bottom-1/4 -right-24 w-96 h-96 bg-accent/4 rounded-full blur-[100px] pointer-events-none" />

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-red-500 text-white text-xs font-semibold px-5 py-3 rounded-2xl shadow-xl whitespace-nowrap"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-sm relative">
        {/* Logo / Brand */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-5"
        >
          <p className="text-[9px] uppercase tracking-[0.5em] font-bold text-primary/50 mb-1">
            Admin Portal
          </p>
          <h1 className="text-2xl font-serif italic text-accent">Stay Theory</h1>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-[2rem] shadow-2xl shadow-stone-900/8 border border-stone-100 overflow-hidden"
        >
          <AnimatePresence mode="wait">
            {/* ── Step 1: Email ── */}
            {step === "email" && (
              <motion.div
                key="email"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.3 }}
                className="p-6"
              >
                <div className="w-10 h-10 rounded-2xl bg-primary/8 flex items-center justify-center mb-4">
                  <Mail className="w-4 h-4 text-primary" />
                </div>

                <h2 className="text-xl font-serif italic text-on-surface mb-0.5">Sign In</h2>
                <p className="text-sm text-stone-400 mb-5">
                  Verify your credentials, then confirm with an OTP.
                </p>

                <form onSubmit={handleEmailSubmit} className="space-y-3">
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.3em] font-bold text-stone-400 mb-2">
                      Email address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300 pointer-events-none" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setError(""); }}
                        placeholder="admin@staytheory.com"
                        className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-stone-200 bg-stone-50 text-sm text-on-surface placeholder-stone-300 outline-none focus:border-primary focus:bg-white transition-all"
                        required
                        autoComplete="email"
                        autoFocus
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.3em] font-bold text-stone-400 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300 pointer-events-none" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setError(""); }}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-11 py-3.5 rounded-xl border border-stone-200 bg-stone-50 text-sm text-on-surface placeholder-stone-300 outline-none focus:border-primary focus:bg-white transition-all"
                        required
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-300 hover:text-stone-500 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-xs"
                    >
                      {error}
                    </motion.p>
                  )}

                  <button
                    type="submit"
                    disabled={loading || !email || !password}
                    className="w-full py-3.5 rounded-xl bg-primary text-white font-bold text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-accent transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>Continue <ArrowRight className="w-3.5 h-3.5" /></>
                    )}
                  </button>
                </form>
              </motion.div>
            )}

            {/* ── Step 2: OTP ── */}
            {step === "otp" && (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.3 }}
                className="p-6"
              >
                <div className="w-10 h-10 rounded-2xl bg-primary/8 flex items-center justify-center mb-4">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                </div>

                <h2 className="text-xl font-serif italic text-on-surface mb-0.5">Enter Code</h2>
                <p className="text-sm text-stone-400 mb-0.5">
                  We sent a 6-digit code to
                </p>
                <p className="text-sm font-semibold text-accent mb-5 truncate">{email}</p>

                {/* OTP inputs */}
                <div className="flex gap-2 justify-between mb-5" onPaste={handleOtpPaste}>
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => { otpRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      disabled={loading}
                      className={`w-11 h-14 text-center text-xl font-bold rounded-xl border outline-none transition-all disabled:opacity-50
                        ${digit ? "border-primary bg-primary/5 text-primary" : "border-stone-200 bg-stone-50 text-on-surface"}
                        focus:border-primary focus:bg-white focus:shadow-[0_0_0_3px_rgba(138,62,34,0.1)]`}
                    />
                  ))}
                </div>

                {loading && (
                  <div className="flex items-center justify-center gap-2 text-stone-400 text-xs mb-4">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Verifying…
                  </div>
                )}

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-xs text-center mb-4"
                  >
                    {error}
                  </motion.p>
                )}

                {/* Resend + back */}
                <div className="flex items-center justify-between text-xs text-stone-400">
                  <button
                    onClick={() => { clearSession(); setStep("email"); setError(""); setOtp(["","","","","",""]); }}
                    className="flex items-center gap-1 hover:text-accent transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" /> Change email
                  </button>

                  <button
                    onClick={handleResend}
                    disabled={resendCooldown > 0 || loading}
                    className="hover:text-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend OTP"}
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── Step 3: Success ── */}
            {step === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="p-8 flex flex-col items-center text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
                  className="w-16 h-16 rounded-full bg-green-50 border border-green-100 flex items-center justify-center mb-5"
                >
                  <ShieldCheck className="w-7 h-7 text-green-500" />
                </motion.div>
                <h2 className="text-2xl font-serif italic text-on-surface mb-2">Welcome back</h2>
                <p className="text-sm text-stone-400">Redirecting to your dashboard…</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-[9px] text-stone-300 uppercase tracking-widest mt-4"
        >
          &copy; {new Date().getFullYear()} Stay Theory — Secure Admin Access
        </motion.p>
      </div>
    </div>
  );
}
