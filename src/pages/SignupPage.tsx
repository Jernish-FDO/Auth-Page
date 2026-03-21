import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// Added Eye and EyeOff icons here
import { Mail, Lock, User, UserPlus, Shield, Loader2, AlertCircle, Check, Eye, EyeOff } from 'lucide-react';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);
  const [isGithubLoading, setIsGithubLoading] = React.useState(false);

  // State to manage password visibility
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const { loginWithGoogle, loginWithGithub } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormValues) => {
    setError(null);
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Signup attempt:', data);
      throw new Error('Email/Password registration is not configured with Firebase yet. Please use Google Login.');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError(null);
    setIsGoogleLoading(true);
    try {
      await loginWithGoogle();
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Google Sign-Up failed');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleGithubSignup = async () => {
    setError(null);
    setIsGithubLoading(true);
    try {
      await loginWithGithub();
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setError(err.message || 'GitHub Sign-Up failed');
    } finally {
      setIsGithubLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] flex flex-col md:flex-row font-sans selection:bg-luxury-900 selection:text-white dark:selection:bg-luxury-100 dark:selection:text-black">
      {/* ... [Left section remains completely untouched] ... */}
      <div className="hidden md:flex md:w-1/2 bg-luxury-900 dark:bg-luxury-950 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-luxury-500 blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-luxury-800 blur-[120px]" />
        </div>
        
        <Link to="/" className="relative z-10 flex items-center gap-2 text-white animate-fade-in">
          <Shield className="w-6 h-6 stroke-[1.5px]" />
          <span className="font-serif text-2xl tracking-tight">AuthPage</span>
        </Link>

        <div className="relative z-10 max-w-md">
          <h2 className="text-white text-5xl lg:text-7xl font-serif leading-[1.1] mb-6 animate-slide-up">
            Join the elite circle of trust.
          </h2>
          <div className="space-y-4 animate-slide-up stagger-1">
            {[
              "Enterprise-grade security",
              "Thoughtful user experience",
              "Privacy by design"
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-luxury-400">
                <div className="w-5 h-5 rounded-full border border-luxury-700 flex items-center justify-center">
                  <Check className="w-3 h-3" />
                </div>
                <span className="text-lg">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-luxury-500 text-sm font-medium tracking-widest uppercase animate-fade-in stagger-2">
          © 2026 AuthPage Studio
        </div>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 lg:p-24 relative">
        <div className="absolute top-8 left-8 flex items-center gap-2 md:hidden">
          <Shield className="w-5 h-5 text-luxury-900 dark:text-white stroke-[1.5px]" />
          <span className="font-serif text-xl text-luxury-900 dark:text-white">AuthPage</span>
        </div>

        <div className="w-full max-w-[400px] animate-slide-up">
          <header className="mb-10">
            <h1 className="text-4xl lg:text-5xl mb-3 text-luxury-950 dark:text-luxury-50 pt-16">Create Account</h1>
            <p className="text-luxury-500 dark:text-luxury-400">Start your journey with refined security.</p>
          </header>

          {error && (
            <div className="mb-8 p-4 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-lg flex items-start gap-3 animate-fade-in">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 dark:text-red-400 font-medium">{error}</p>
            </div>
          )}

          <div className="space-y-6">
            

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-luxury-400 ml-0.5" htmlFor="name">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-luxury-400 transition-colors group-focus-within:text-luxury-950 dark:group-focus-within:text-white" />
                  <input
                    id="name"
                    type="text"
                    {...register('name')}
                    className={`w-full pl-11 pr-4 py-4 bg-white dark:bg-luxury-950 border ${errors.name ? 'border-red-400' : 'border-luxury-200 dark:border-luxury-800'} rounded-lg focus:ring-0 focus:border-luxury-950 dark:focus:border-white outline-none transition-all duration-300 text-luxury-950 dark:text-white placeholder:text-luxury-300 dark:placeholder:text-luxury-700`}
                    placeholder="John Doe"
                  />
                </div>
                {errors.name && <p className="text-[11px] font-bold text-red-500 mt-1 ml-0.5 italic">{errors.name.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-luxury-400 ml-0.5" htmlFor="email">Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-luxury-400 transition-colors group-focus-within:text-luxury-950 dark:group-focus-within:text-white" />
                  <input
                    id="email"
                    type="email"
                    {...register('email')}
                    className={`w-full pl-11 pr-4 py-4 bg-white dark:bg-luxury-950 border ${errors.email ? 'border-red-400' : 'border-luxury-200 dark:border-luxury-800'} rounded-lg focus:ring-0 focus:border-luxury-950 dark:focus:border-white outline-none transition-all duration-300 text-luxury-950 dark:text-white placeholder:text-luxury-300 dark:placeholder:text-luxury-700`}
                    placeholder="hello@example.com"
                  />
                </div>
                {errors.email && <p className="text-[11px] font-bold text-red-500 mt-1 ml-0.5 italic">{errors.email.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* --- Main Password Field --- */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-luxury-400 ml-0.5" htmlFor="password">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-luxury-400 transition-colors group-focus-within:text-luxury-950 dark:group-focus-within:text-white" />
                    <input
                      id="password"
                      // Changed from "password" to conditional type
                      type={showPassword ? 'text' : 'password'}
                      {...register('password')}
                      // Changed pr-4 to pr-11 so text doesn't hit the toggle icon
                      className={`w-full pl-11 pr-11 py-4 bg-white dark:bg-luxury-950 border ${errors.password ? 'border-red-400' : 'border-luxury-200 dark:border-luxury-800'} rounded-lg focus:ring-0 focus:border-luxury-950 dark:focus:border-white outline-none transition-all duration-300 text-luxury-950 dark:text-white placeholder:text-luxury-300 dark:placeholder:text-luxury-700`}
                      placeholder="••••••••"
                    />
                    {/* Toggle button */}
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
                  <label className="text-xs font-bold uppercase tracking-wider text-luxury-400 ml-0.5" htmlFor="confirmPassword">Confirm</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-luxury-400 transition-colors group-focus-within:text-luxury-950 dark:group-focus-within:text-white" />
                    <input
                      id="confirmPassword"
                      // Changed from "password" to conditional type
                      type={showConfirmPassword ? 'text' : 'password'}
                      {...register('confirmPassword')}
                      // Changed pr-4 to pr-11 so text doesn't hit the toggle icon
                      className={`w-full pl-11 pr-11 py-4 bg-white dark:bg-luxury-950 border ${errors.confirmPassword ? 'border-red-400' : 'border-luxury-200 dark:border-luxury-800'} rounded-lg focus:ring-0 focus:border-luxury-950 dark:focus:border-white outline-none transition-all duration-300 text-luxury-950 dark:text-white placeholder:text-luxury-300 dark:placeholder:text-luxury-700`}
                      placeholder="••••••••"
                    />
                     {/* Toggle button */}
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
              </div>

              <button
                type="submit"
                disabled={isSubmitting || isGoogleLoading || isGithubLoading}
                className="w-full bg-luxury-950 dark:bg-white text-white dark:text-luxury-950 font-bold py-5 rounded-lg active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-70 mt-4"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>Create Account</span>
                    <UserPlus className="w-4 h-4 transition-transform group-hover:scale-110" />
                  </>
                )}
              </button>
              <div className="relative flex items-center">
              <div className="flex-grow border-t border-luxury-100 dark:border-luxury-900"></div>
              <span className="flex-shrink mx-4 text-[10px] uppercase tracking-[0.2em] text-luxury-400 font-bold bg-[#fafafa] dark:bg-[#0a0a0a] px-2">
                Or fill the form
              </span>
              <div className="flex-grow border-t border-luxury-100 dark:border-luxury-900"></div>
            </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleGoogleSignup}
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
                  onClick={handleGithubSignup}
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

          <footer className="mt-12 text-center pb-8">
            <p className="text-sm text-luxury-500">
              Already a member?{' '}
              <Link to="/login" className="text-luxury-950 dark:text-white font-bold hover:underline underline-offset-4">Sign in here</Link>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
