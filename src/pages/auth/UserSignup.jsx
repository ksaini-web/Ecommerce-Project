import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Alert from '../../components/Alert';
import LoadingSpinner from '../../components/LoadingSpinner';
import { authAPI } from '../../api/axiosInstance';
import useAuth from '../../hooks/useAuth';
import { validateEmail, validateRequired } from '../../utils/validators';

const initialForm = {
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
};

const apiMessage = (e) =>
  e.detail?.message ??
  e.response?.data?.message ??
  e.message ??
  'Something went wrong';

const validatePhone = (phone) => /^[0-9]{10}$/.test(phone);

function UserSignup() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const updateField = (field, value) =>
    setForm((current) => ({ ...current, [field]: value }));

  const validateForm = () => {
    if (Object.values(form).some((value) => !validateRequired(value))) {
      return 'All fields are required';
    }

    if (!validateEmail(form.email)) {
      return 'Enter a valid email address';
    }

    if (!validatePhone(form.phone)) {
      return 'Phone number must be 10 digits';
    }

    if (form.password !== form.confirmPassword) {
      return 'Passwords must match';
    }

    return '';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await authAPI.userSignup({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });

      if (res.data?.token) {
        loginUser(res.data);
        navigate('/', { replace: true });
        return;
      }

      setSuccess('Account created successfully. Please login.');
      navigate('/login', { replace: true });
    } catch (e) {
      setError(apiMessage(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center surface-shell px-4 py-10">
      <form
        className="panel w-full max-w-md rounded-lg p-8"
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl font-semibold text-gray-950">Create account</h1>

        <p className="mt-1 text-sm text-muted">
          Start shopping with your Shopcart account.
        </p>

        <div className="mt-6 grid gap-4">
          {error && <Alert type="error" message={error} />}
          {success && <Alert type="success" message={success} />}
          {loading && <LoadingSpinner />}

          <input
            className="w-full rounded-lg border border-border px-3.5 py-2.5 text-sm"
            placeholder="Full name"
            value={form.name}
            onChange={(event) => updateField('name', event.target.value)}
          />

          <input
            className="w-full rounded-lg border border-border px-3.5 py-2.5 text-sm"
            placeholder="Email"
            value={form.email}
            onChange={(event) => updateField('email', event.target.value)}
          />

          <input
            className="w-full rounded-lg border border-border px-3.5 py-2.5 text-sm"
            placeholder="Phone number"
            value={form.phone}
            onChange={(event) => updateField('phone', event.target.value)}
          />

          <input
            type="password"
            className="w-full rounded-lg border border-border px-3.5 py-2.5 text-sm"
            placeholder="Password"
            value={form.password}
            onChange={(event) => updateField('password', event.target.value)}
          />

          <input
            type="password"
            className="w-full rounded-lg border border-border px-3.5 py-2.5 text-sm"
            placeholder="Confirm password"
            value={form.confirmPassword}
            onChange={(event) =>
              updateField('confirmPassword', event.target.value)
            }
          />

          <button
            className="rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition hover:bg-indigo-600 disabled:opacity-50"
            disabled={loading}
          >
            Sign Up
          </button>
        </div>

        <p className="mt-5 text-center text-sm text-muted">
          Already have an account?{' '}
          <Link className="font-medium text-primary" to="/login">
            Login
          </Link>
        </p>
      </form>
    </main>
  );
}

export default UserSignup;
