import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPassword, signUpWithPassword, signInWithGoogle } from '../lib/auth.js';
import { usersApi } from '../lib/shopApi.js';
import useCurrentUser from '../hooks/useCurrentUser.js';

const Login = () => {
  const { user, loading } = useCurrentUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState('');
  const navigate = useNavigate();
  // form state

  useEffect(() => {
    if (!loading && user) {
      navigate(user.role === 'admin' ? '/admin' : '/');
    }
  }, [loading, user, navigate]);
  // redirect

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    if (!name.trim() || !phone.trim() || !address.trim()) {
      setError('Full name, mobile, and address are required.');
      setSubmitting(false);
      return;
    }

    const response = await (isSignUp
      ? signUpWithPassword(email, password, {
          data: {
            name: name.trim(),
            mobile: phone.trim(),
            address: address.trim(),
          },
        })
      : signInWithPassword(email, password, {
          name: name.trim(),
          phone: phone.trim(),
          address: address.trim(),
        }));

    if (response.error) {
      setError(response.error.message || 'Unable to sign in.');
      setSubmitting(false);
      return;
    }

    await usersApi.upsert({
      email: email.trim().toLowerCase(),
      name: name.trim(),
      mobile: phone.trim(),
      address: address.trim(),
    });

    const currentRole = response.data?.user?.role;
    navigate(currentRole === 'admin' ? '/admin' : '/');
  };
  const handleGoogleLogin = async () => {
    setError('');
    setSubmitting(true);
    const response = await signInWithGoogle();
    setSubmitting(false);
    if (response.error) {
      setError(response.error.message || 'Google login failed.');
      return;
    }
    if (response.data?.user) {
      navigate(response.data.user.role === 'admin' ? '/admin' : '/');
    }
  };

  const handleUseLocation = () => {
    setLocationError('');
    setLocationLoading(true);

    if (!navigator.geolocation) {
      setLocationError('Location is not supported in this browser.');
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
          );
          const data = await response.json();
          if (data?.display_name) {
            setAddress(data.display_name);
          } else {
            setAddress(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          }
        } catch {
          setLocationError('Unable to fetch location address.');
        } finally {
          setLocationLoading(false);
        }
      },
      (error) => {
        setLocationError('Location access denied or unavailable.');
        setLocationLoading(false);
      },
      { timeout: 10000 },
    );
  };

  // submit

  return (
    <div className="min-h-screen bg-white py-16">
      <div className="mx-auto w-full max-w-md px-4 sm:px-6">
        <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-slate-900">{isSignUp ? 'Create Account' : 'Login'}</h1>
              <p className="mt-2 text-sm text-slate-500">{isSignUp ? 'Sign up for a professional kirana experience.' : 'Sign in with your delivery details.'}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsSignUp((current) => !current);
                setError('');
              }}
              className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200"
            >
              {isSignUp ? 'Already have an account?' : 'New user? Sign up'}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <label className="block text-sm font-medium text-slate-700">
              Full name
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                placeholder="Your full name"
                required
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Mobile number
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                placeholder="Mobile number"
                required
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Delivery address
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                rows="3"
                placeholder="Street, city, and pin code"
                required
              />
            </label>
            <div className="mt-3 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={handleUseLocation}
                disabled={locationLoading}
                className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
              >
                {locationLoading ? 'Detecting location...' : 'Use current location'}
              </button>
              <span className="text-xs text-slate-400">Free map via OpenStreetMap</span>
            </div>
            {locationError && <p className="mt-2 text-sm text-red-500">{locationError}</p>}

            <label className="block text-sm font-medium text-slate-700">
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                placeholder="you@example.com"
                required
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                placeholder="Enter password"
                required
              />
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white"
            >
              {submitting ? (isSignUp ? 'Creating account...' : 'Signing in...') : isSignUp ? 'Create Account' : 'Sign In'}
            </button>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={submitting}
              className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
            >
              Continue with Google
            </button>

            {error && <p className="text-sm text-red-500">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};
// page

export default Login;
