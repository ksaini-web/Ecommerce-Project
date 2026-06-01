import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Alert from '../../components/Alert';
import LoadingSpinner from '../../components/LoadingSpinner';
import { authAPI } from '../../api/axiosInstance';
import useAuth from '../../hooks/useAuth';
import { validateEmail, validateRequired } from '../../utils/validators';

const apiMessage = (e) => e.detail?.message ?? e.response?.data?.message ?? e.message ?? 'Something went wrong';

function UserLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateRequired(form.email) || !validateRequired(form.password)) return setError('Email and password are required');
    if (!validateEmail(form.email)) return setError('Enter a valid email address');

    setLoading(true);
    setError('');
    try {
      const res = await authAPI.userLogin(form);
      login(res.data);
      navigate('/', { replace: true });
    } catch (e) {
      setError(e.response?.status === 401 ? 'Invalid email or password' : apiMessage(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center surface-shell px-4 py-10">
      <form className="panel w-full max-w-md rounded-lg p-8" onSubmit={handleSubmit}>
        <h1 className="text-2xl font-semibold text-gray-950">Welcome back</h1>
        <p className="mt-1 text-sm text-muted">Login to continue shopping.</p>
        <div className="mt-6 grid gap-4">
          {error && <Alert type="error" message={error} />}
          {loading && <LoadingSpinner />}
          <input className="w-full rounded-lg border border-border bg-white px-3.5 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Email" value={form.email} onChange={(event) => updateField('email', event.target.value)} />
          <input type="password" className="w-full rounded-lg border border-border bg-white px-3.5 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Password" value={form.password} onChange={(event) => updateField('password', event.target.value)} />
          <button className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition hover:bg-indigo-600 disabled:opacity-50" disabled={loading}>
            Login
          </button>
        </div>
        <p className="mt-5 text-center text-sm text-muted">
          New user? <Link className="font-medium text-primary" to="/signup">Create account</Link>
        </p>
      </form>
    </main>
  );
}

export default UserLogin;
