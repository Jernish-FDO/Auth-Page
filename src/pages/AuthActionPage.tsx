import { useEffect, useState, useRef } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { verifyPasswordResetCode, confirmPasswordReset, auth, isSignInWithEmailLink, signInWithEmailLink } from '../lib/firebase';
import { Shield, Lock, Loader2, Eye, EyeOff, ArrowRight } from 'lucide-react';

const newPasswordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type NewPasswordFormValues = z.infer<typeof newPasswordSchema>;

export default function AuthActionPage() {
  const [mode, setMode] = useState<string | null>(null);
  const [oobCode, setOobCode] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const isProcessing = useRef(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewPasswordFormValues>({
    resolver: zodResolver(newPasswordSchema),
  });

  useEffect(() => {
    // Prevent double-execution in React StrictMode
    if (isProcessing.current) return;
    isProcessing.current = true;

    // Check if it's a magic link login first
    if (isSignInWithEmailLink(auth, window.location.href)) {
      setMode('signIn');
      let savedEmail = window.localStorage.getItem('emailForSignIn');
      if (!savedEmail) {
        savedEmail = window.prompt('Please provide your email for confirmation');
      }

      if (savedEmail) {
        signInWithEmailLink(auth, savedEmail, window.location.href)
          .then(() => {
            window.localStorage.removeItem('emailForSignIn');
            const successMsg = 'Successfully signed in! Redirecting to dashboard...';
            setSuccess(successMsg);
            toast.success(successMsg);
            setTimeout(() => {
              navigate('/dashboard', { replace: true });
            }, 1000);
          })
          .catch((err) => {
            let errorMsg = 'Error signing in with magic link.';
            if (err.code === 'auth/email-already-in-use' || err.code === 'auth/credential-already-in-use') {
              errorMsg = 'This email is already associated with a different sign-in method (like Google or GitHub). Please go back and sign in using that method.';
            } else if (err.code === 'auth/invalid-action-code') {
              errorMsg = 'This magic link is invalid. It may have already been used.';
            } else if (err.code === 'auth/expired-action-code') {
              errorMsg = 'This magic link has expired. Please request a new one from the login page.';
            } else if (err.code === 'auth/user-disabled') {
              errorMsg = 'This user account has been disabled.';
            } else if (err.message) {
              errorMsg = err.message;
            }
            setError(errorMsg);
            toast.error(errorMsg);
            setIsVerifying(false);
          });
      } else {
        const errorMsg = 'Email confirmation is required to sign in with this link.';
        setError(errorMsg);
        toast.error(errorMsg);
        setIsVerifying(false);
      }
      return;
    }

    // Parse query parameters for password reset
    const queryParams = new URLSearchParams(location.search);
    const actionMode = queryParams.get('mode');
    const actionCode = queryParams.get('oobCode');

    if (!actionMode || !actionCode) {
      const errorMsg = 'Invalid request. Missing parameters.';
      setError(errorMsg);
      toast.error(errorMsg);
      setIsVerifying(false);
      return;
    }

    setMode(actionMode);
    setOobCode(actionCode);

    if (actionMode === 'resetPassword') {
      verifyPasswordResetCode(auth, actionCode)
        .then((userEmail) => {
          setEmail(userEmail);
          setIsVerifying(false);
        })
        .catch((err) => {
          let errorMsg = 'Invalid or expired action code.';
          if (err.code === 'auth/invalid-action-code') {
            errorMsg = 'This password reset link is invalid. It may have already been used.';
          } else if (err.code === 'auth/expired-action-code') {
            errorMsg = 'This password reset link has expired. Please request a new one.';
          } else if (err.message) {
            errorMsg = err.message;
          }
          setError(errorMsg);
          toast.error(errorMsg);
          setIsVerifying(false);
        });
    } else {
      const errorMsg = `Unsupported action mode: ${actionMode}`;
      setError(errorMsg);
      toast.error(errorMsg);
      setIsVerifying(false);
    }
  }, [location, navigate]);

  const onSubmit = async (data: NewPasswordFormValues) => {
    if (!oobCode) return;
    setError(null);
    setIsSubmitting(true);

    try {
      await confirmPasswordReset(auth, oobCode, data.password);
      const successMsg = 'Your password has been successfully reset! You can now sign in with your new password.';
      setSuccess(successMsg);
      toast.success(successMsg);
    } catch (err: any) {
      let errorMsg = 'Failed to reset password. Please try again.';
      if (err.code === 'auth/weak-password') {
        errorMsg = 'The password provided is too weak.';
      } else if (err.code === 'auth/expired-action-code') {
        errorMsg = 'This reset link has expired. Please request a new one from the login page.';
      } else if (err.code === 'auth/invalid-action-code') {
        errorMsg = 'This reset link is invalid. It may have been used already.';
      } else if (err.code === 'auth/user-disabled') {
        errorMsg = 'This user account has been disabled.';
      } else if (err.code === 'auth/user-not-found') {
        errorMsg = 'No account found for this reset link.';
      } else if (err.message) {
        errorMsg = err.message;
      }
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] flex items-center justify-center font-sans">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-luxury-500" />
          <p className="text-luxury-500 dark:text-luxury-400 font-medium">Verifying link...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] flex flex-col md:flex-row font-sans selection:bg-luxury-900 selection:text-white dark:selection:bg-luxury-100 dark:selection:text-black">
      {/* --- Left Branding Panel --- */}
      <div className="hidden md:flex md:w-1/2 bg-luxury-900 dark:bg-luxury-950 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-luxury-500 blur-[120px]" />
          <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-luxury-800 blur-[120px]" />
        </div>

        <Link to="/" className="relative z-10 flex items-center gap-2 text-white animate-fade-in">
          <Shield className="w-6 h-6 stroke-[1.5px]" />
          <span className="font-serif text-2xl tracking-tight">AuthPage</span>
        </Link>

        <div className="relative z-10 max-w-md">
          <h2 className="text-white text-5xl lg:text-7xl font-serif leading-[1.1] mb-6 animate-slide-up">
            Secure Recovery.
          </h2>
          <p className="text-luxury-400 text-lg leading-relaxed animate-slide-up stagger-1">
            Safely reset your credentials and regain access to your workspace.
          </p>
        </div>

        <div className="relative z-10 text-luxury-500 text-sm font-medium tracking-widest uppercase animate-fade-in stagger-2">
          © 2026 AuthPage Studio
        </div>
      </div>

      {/* --- Right Form Panel --- */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 lg:p-24 relative">
        <div className="absolute top-8 left-8 flex items-center gap-2 md:hidden">
          <Shield className="w-5 h-5 text-luxury-900 dark:text-white stroke-[1.5px]" />
          <span className="font-serif text-xl text-luxury-900 dark:text-white">AuthPage</span>
        </div>

        <div className="w-full max-w-[400px] animate-slide-up">
          <header className="mb-10">
            <h1 className="text-4xl lg:text-5xl mb-3 text-luxury-950 dark:text-luxury-50 pt-16">
              {mode === 'resetPassword' ? 'Reset Password' : 'Action Required'}
            </h1>
            <p className="text-luxury-500 dark:text-luxury-400">
              {error
                ? 'An error occurred during verification.'
                : success
                  ? 'Action completed successfully.'
                  : email
                    ? `Updating credentials for ${email}`
                    : 'Please complete the action below.'}
            </p>
          </header>

          {error && (
            <div className="mb-8 animate-fade-in">
              <Link
                to="/login"
                className="w-full bg-luxury-950 dark:bg-white text-white dark:text-luxury-950 font-bold py-5 rounded-lg active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                <span>Return to Sign In</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          )}

          {!error && !success && mode === 'resetPassword' && (
            <div className="space-y-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                {/* --- New Password Field --- */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-luxury-400 ml-0.5" htmlFor="password">New Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-luxury-400 transition-colors group-focus-within:text-luxury-950 dark:group-focus-within:text-white" />
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      {...register('password')}
                      className={`w-full pl-11 pr-11 py-4 bg-white dark:bg-luxury-950 border ${errors.password ? 'border-red-400' : 'border-luxury-200 dark:border-luxury-800'} rounded-lg focus:ring-0 focus:border-luxury-950 dark:focus:border-white outline-none transition-all duration-300 text-luxury-950 dark:text-white placeholder:text-luxury-300 dark:placeholder:text-luxury-700`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-luxury-400 hover:text-luxury-950 dark:hover:text-white transition-colors focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-[11px] font-bold text-red-500 mt-1 ml-0.5 italic">{errors.password.message}</p>}
                </div>

                {/* --- Confirm Password Field --- */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-luxury-400 ml-0.5" htmlFor="confirmPassword">Confirm Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-luxury-400 transition-colors group-focus-within:text-luxury-950 dark:group-focus-within:text-white" />
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      {...register('confirmPassword')}
                      className={`w-full pl-11 pr-11 py-4 bg-white dark:bg-luxury-950 border ${errors.confirmPassword ? 'border-red-400' : 'border-luxury-200 dark:border-luxury-800'} rounded-lg focus:ring-0 focus:border-luxury-950 dark:focus:border-white outline-none transition-all duration-300 text-luxury-950 dark:text-white placeholder:text-luxury-300 dark:placeholder:text-luxury-700`}
                      placeholder="••••••••"
                    />
                     <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-luxury-400 hover:text-luxury-950 dark:hover:text-white transition-colors focus:outline-none"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-[11px] font-bold text-red-500 mt-1 ml-0.5 italic">{errors.confirmPassword.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-luxury-950 dark:bg-white text-white dark:text-luxury-950 font-bold py-5 rounded-lg active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-70 mt-4"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span>Reset Password</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {success && (
            <Link
              to="/login"
              className="w-full bg-luxury-950 dark:bg-white text-white dark:text-luxury-950 font-bold py-5 rounded-lg active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-2 group mt-8"
            >
              <span>Back to Sign In</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          )}

        </div>
      </div>
    </div>
  );
}