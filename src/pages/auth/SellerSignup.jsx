import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Alert from '../../components/Alert';
import LoadingSpinner from '../../components/LoadingSpinner';
import { authAPI } from '../../api/axiosInstance';
import useAuth from '../../hooks/useAuth';
import { validateEmail, validateRequired } from '../../utils/validators';

const initialForm = {
  sellerName: '',
  businessName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  address: '',
};
const apiMessage = (e) => e.detail?.message ?? e.response?.data?.message ?? e.message ?? 'Something went wrong';

function SellerSignup() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginSeller } = useAuth();
  const navigate = useNavigate();

  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const validateForm = () => {
    if (Object.values(form).some((value) => !validateRequired(value))) return 'All fields are required';
    if (!validateEmail(form.email)) return 'Enter a valid email address';
    if (!/^\d{10}$/.test(form.phone)) return 'Phone number must be 10 digits';
    if (form.password !== form.confirmPassword) return 'Passwords must match';
    return '';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationError = validateForm();
    if (validationError) return setError(validationError);

    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await authAPI.sellerSignup({
        sellerName: form.sellerName,
        businessName: form.businessName,
        email: form.email,
        phone: form.phone,
        password: form.password,
        address: form.address,
      });
      if (res.data?.token) {
        loginSeller(res.data);
        navigate('/seller/dashboard', { replace: true });
        return;
      }

      setSuccess('Seller account created successfully. Please login.');
      navigate('/seller/login', { replace: true });
    } catch (e) {
      setError(apiMessage(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center surface-shell px-4 py-10">
      <form className="panel w-full max-w-md rounded-lg p-8" onSubmit={handleSubmit}>
        <h1 className="text-2xl font-semibold text-gray-950">Become a seller</h1>
        <p className="mt-1 text-sm text-muted">Create your seller profile and start listing products.</p>
        <div className="mt-6 grid gap-4">
          {error && <Alert type="error" message={error} />}
          {success && <Alert type="success" message={success} />}
          {loading && <LoadingSpinner />}
          <input className="rounded-lg border border-border px-3.5 py-2.5 text-sm" placeholder="Your name" value={form.sellerName} onChange={(event) => updateField('sellerName', event.target.value)} />
          <input className="rounded-lg border border-border px-3.5 py-2.5 text-sm" placeholder="Business name" value={form.businessName} onChange={(event) => updateField('businessName', event.target.value)} />
          <input className="rounded-lg border border-border px-3.5 py-2.5 text-sm" placeholder="Email" value={form.email} onChange={(event) => updateField('email', event.target.value)} />
          <input className="rounded-lg border border-border px-3.5 py-2.5 text-sm" placeholder="Phone" value={form.phone} onChange={(event) => updateField('phone', event.target.value)} />
          <input type="password" className="rounded-lg border border-border px-3.5 py-2.5 text-sm" placeholder="Password" value={form.password} onChange={(event) => updateField('password', event.target.value)} />
          <input type="password" className="rounded-lg border border-border px-3.5 py-2.5 text-sm" placeholder="Confirm password" value={form.confirmPassword} onChange={(event) => updateField('confirmPassword', event.target.value)} />
          <textarea className="min-h-24 rounded-lg border border-border px-3.5 py-2.5 text-sm" placeholder="Business address" value={form.address} onChange={(event) => updateField('address', event.target.value)} />
          <button className="rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition hover:bg-indigo-600 disabled:opacity-50" disabled={loading}>Create Seller Account</button>
        </div>
        <p className="mt-5 text-center text-sm text-muted">
          Already registered? <Link className="font-medium text-primary" to="/seller/login">Seller Login</Link>
        </p>
      </form>
    </main>
  );
}

export default SellerSignup;

