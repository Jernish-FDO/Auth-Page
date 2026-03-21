import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
// Added Eye and EyeOff icons here
import { Mail, Lock, Shield, Loader2, ArrowRight, Eye, EyeOff } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);
  const [isGithubLoading, setIsGithubLoading] = React.useState(false);
  const [isResetLoading, setIsResetLoading] = React.useState(false);
  const [isMagicLinkLoading, setIsMagicLinkLoading] = React.useState(false);

  // State to manage password visibility
  const [showPassword, setShowPassword] = React.useState(false);

  const { loginWithGoogle, loginWithGithub, loginWithEmail, sendPasswordReset, sendMagicLink } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);

    try {
      await loginWithEmail(data.email, data.password);
      navigate(from, { replace: true });
    } catch (err: any) {
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        toast.error('Invalid email or password');
      } else if (err.code === 'auth/too-many-requests') {
        toast.error('Too many unsuccessful login attempts. Please try again later or reset your password.');
      } else if (err.code === 'auth/network-request-failed') {
        toast.error('Network error. Please check your internet connection.');
      } else {
        toast.error(err.message || 'Login failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      await loginWithGoogle();
      navigate(from, { replace: true });
    } catch (err: any) {
      if (err.code === 'auth/account-exists-with-different-credential') {
        toast.error('An account with this email already exists. Please sign in with the provider you originally used (e.g., Email, GitHub).');
      } else if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
        // User intentionally closed the popup, don't show an error
      } else if (err.code === 'auth/network-request-failed') {
        toast.error('Network error. Please check your internet connection.');
      } else {
        toast.error(err.message || 'Google Sign-In failed');
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    setIsGithubLoading(true);
    try {
      await loginWithGithub();
      navigate(from, { replace: true });
    } catch (err: any) {
      if (err.code === 'auth/account-exists-with-different-credential') {
        toast.error('An account with this email already exists. Please sign in with the provider you originally used (e.g., Email, Google).');
      } else if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
        // User intentionally closed the popup
      } else if (err.code === 'auth/network-request-failed') {
        toast.error('Network error. Please check your internet connection.');
      } else {
        toast.error(err.message || 'GitHub Sign-In failed');
      }
    } finally {
      setIsGithubLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.MouseEvent) => {
    e.preventDefault();
    const email = getValues('email');
    if (!email) {
      toast.error('Please enter your email address first to reset password');
      return;
    }
    setIsResetLoading(true);
    try {
      await sendPasswordReset(email);
      toast.success('Password reset link sent to your email.');
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') {
        toast.error('No account found with this email address.');
      } else if (err.code === 'auth/invalid-email') {
        toast.error('Please enter a valid email address.');
      } else {
        toast.error(err.message || 'Failed to send reset email');
      }
    } finally {
      setIsResetLoading(false);
    }
  };

  const handleMagicLink = async (e: React.MouseEvent) => {
    e.preventDefault();
    const email = getValues('email');
    if (!email) {
      toast.error('Please enter your email address first for magic link login');
      return;
    }
    setIsMagicLinkLoading(true);
    try {
      await sendMagicLink(email);
      toast.success('Magic link sent! Check your inbox to sign in.');
    } catch (err: any) {
      if (err.code === 'auth/invalid-email') {
        toast.error('Please enter a valid email address.');
      } else if (err.code === 'auth/too-many-requests') {
        toast.error('You have requested too many links recently. Please try again later.');
      } else {
        toast.error(err.message || 'Failed to send magic link');
      }
    } finally {
      setIsMagicLinkLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] flex flex-col md:flex-row font-sans selection:bg-luxury-900 selection:text-white dark:selection:bg-luxury-100 dark:selection:text-black">
      {/* --- Left Branding Panel --- */}
      <div className="hidden md:flex md:w-1/2 bg-luxury-900 dark:bg-luxury-950 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-luxury-500 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-luxury-800 blur-[120px]" />
        </div>
        
        <Link to="/" className="relative z-10 flex items-center gap-2 text-white animate-fade-in">
          <Shield className="w-6 h-6 stroke-[1.5px]" />
          <span className="font-serif text-2xl tracking-tight">AuthPage</span>
        </Link>

        <div className="relative z-10 max-w-md">
          <h2 className="text-white text-5xl lg:text-7xl font-serif leading-[1.1] mb-6 animate-slide-up">
            Refined security for the digital age.
          </h2>
          <p className="text-luxury-400 text-lg leading-relaxed animate-slide-up stagger-1">
            Experience authentication as it should be. Seamless, secure, and thoughtfully designed for every interaction.
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

        <div className="w-full max-w-[400px] animate-slide-up ">
          <header className="mb-10">
            <h1 className="text-4xl lg:text-5xl mb-3 text-luxury-950 dark:text-luxury-50 pt-16">Welcome Back</h1>
            <p className="text-luxury-500 dark:text-luxury-400">Enter your credentials to access your workspace.</p>
          </header>

          <div className="space-y-6">
            

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* --- Email Field --- */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-luxury-400 ml-0.5" htmlFor="email">Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-luxury-400 transition-colors group-focus-within:text-luxury-950 dark:group-focus-within:text-white" />
                  <input
                    id="email"
                    type="email"
                    {...register('email')}
                    className={`w-full pl-11 pr-4 py-4 bg-white dark:bg-luxury-950 border ${errors.email ? 'border-red-400' : 'border-luxury-200 dark:border-luxury-800'} rounded-lg focus:ring-0 focus:border-luxury-950 dark:focus:border-white outline-none transition-all duration-300 text-luxury-950 dark:text-white placeholder:text-luxury-300 dark:placeholder:text-luxury-700`}
                    placeholder="e.g. hello@example.com"
                  />
                </div>
                {errors.email && <p className="text-[11px] font-bold text-red-500 mt-1 ml-0.5 italic">{errors.email.message}</p>}
              </div>

              {/* --- Password Field --- */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between ml-0.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-luxury-400" htmlFor="password">Password</label>
                  <button onClick={handlePasswordReset} type="button" disabled={isResetLoading} className="text-[10px] font-bold uppercase tracking-widest text-luxury-500 hover:text-luxury-950 dark:hover:text-white transition-colors disabled:opacity-50">
                    {isResetLoading ? 'Sending...' : 'Reset?'}
                  </button>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-luxury-400 transition-colors group-focus-within:text-luxury-950 dark:group-focus-within:text-white" />
                  <input
                    id="password"
                    // Toggle type based on state
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                    // Increased pr-4 to pr-11 so text avoids overlapping the icon
                    className={`w-full pl-11 pr-11 py-4 bg-white dark:bg-luxury-950 border ${errors.password ? 'border-red-400' : 'border-luxury-200 dark:border-luxury-800'} rounded-lg focus:ring-0 focus:border-luxury-950 dark:focus:border-white outline-none transition-all duration-300 text-luxury-950 dark:text-white placeholder:text-luxury-300 dark:placeholder:text-luxury-700`}
                    placeholder="••••••••"
                  />
                  {/* Eye Toggle Button */}
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
              

              <button
                type="submit"
                disabled={isSubmitting || isGoogleLoading || isGithubLoading || isMagicLinkLoading}
                className="w-full bg-luxury-950 dark:bg-white text-white dark:text-luxury-950 font-bold py-5 rounded-lg active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-70"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleMagicLink}
                disabled={isSubmitting || isGoogleLoading || isGithubLoading || isMagicLinkLoading}
                className="w-full bg-white dark:bg-luxury-950 text-luxury-950 dark:text-white border border-luxury-200 dark:border-luxury-800 font-bold py-5 rounded-lg active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-70"
              >
                {isMagicLinkLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    <span>Send Magic Link</span>
                  </>
                )}
              </button>
              <div className="relative flex items-center">
              <div className="flex-grow border-t border-luxury-100 dark:border-luxury-900"></div>
              <span className="flex-shrink mx-4 text-[10px] uppercase tracking-[0.2em] text-luxury-400 font-bold bg-[#fafafa] dark:bg-[#0a0a0a] px-2">
                Or enter details
              </span>
              <div className="flex-grow border-t border-luxury-100 dark:border-luxury-900"></div>
            </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isGoogleLoading || isGithubLoading || isSubmitting}
                  className="flex-1 flex items-center justify-center gap-3 px-6 py-4 border border-luxury-200 dark:border-luxury-800 rounded-lg bg-white dark:bg-luxury-900 hover:bg-luxury-50 dark:hover:bg-luxury-800/50 transition-all duration-300 group disabled:opacity-50"
                >
                  {isGoogleLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-luxury-400" />
                  ) : (
                    <svg className="w-5 h-5 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                  )}
                  <span className="font-medium text-luxury-700 dark:text-luxury-200">Google</span>
                </button>

                <button
                  type="button"
                  onClick={handleGithubLogin}
                  disabled={isGithubLoading || isGoogleLoading || isSubmitting}
                  className="flex-1 flex items-center justify-center gap-3 px-6 py-4 border border-luxury-200 dark:border-luxury-800 rounded-lg bg-white dark:bg-luxury-900 hover:bg-luxury-50 dark:hover:bg-luxury-800/50 transition-all duration-300 group disabled:opacity-50"
                >
                  {isGithubLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-luxury-400" />
                  ) : (
                    <svg className="w-5 h-5 transition-transform group-hover:scale-110 text-[#24292F] dark:text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span className="font-medium text-luxury-700 dark:text-luxury-200">GitHub</span>
                </button>
              </div>
            
            
            </form>
          </div>

          <footer className="mt-12 text-center">
            <p className="text-sm text-luxury-500">
              New here?{' '}
              <Link to="/signup" className="text-luxury-950 dark:text-white font-bold hover:underline underline-offset-4">Create an account</Link>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
