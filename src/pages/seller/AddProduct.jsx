import { useCallback, useState } from 'react';
import Navbar from '../../components/Navbar';
import Alert from '../../components/Alert';
import LoadingSpinner from '../../components/LoadingSpinner';
import { productAPI, uploadAPI } from '../../api/axiosInstance';
import useAuth from '../../hooks/useAuth';
import { validateRequired } from '../../utils/validators';

const initialForm = { name: '', description: '', price: '', stock: '', category: '', imageUrl: '' };
const apiMessage = (e) => e.detail?.message ?? e.response?.data?.message ?? e.message ?? 'Something went wrong';

function AddProduct() {
  const [form, setForm] = useState(initialForm);
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { seller } = useAuth();

  const updateField = useCallback((field, value) => setForm((current) => ({ ...current, [field]: value })), []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (['name', 'description', 'price', 'stock', 'category'].some((field) => !validateRequired(form[field]))) return setError('All fields are required');

    setLoading(true);
    setError('');
    setSuccess('');
    try {
      let imageUrl = form.imageUrl;
      if (file) {
        const fd = new FormData();
        fd.append('file', file);
        const { data } = await uploadAPI.uploadImage(fd);
        imageUrl = data.url;
      }

      await productAPI.create({
        ...form,
        title: form.name,
        imageUrl,
        thumbnail: imageUrl,
        sellerId: seller?.id,
        price: Number(form.price),
        stock: Number(form.stock),
      });
      setSuccess('Product added successfully');
      setForm(initialForm);
      setFile(null);
      event.target.reset();
    } catch (e) {
      setError(apiMessage(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen surface-shell">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-8 sm:py-10">
        <form className="panel rounded-lg p-5 sm:p-7" onSubmit={handleSubmit}>
          <span className="text-sm font-semibold text-primary">Inventory</span>
          <h1 className="mt-1 text-2xl font-semibold text-gray-950">Add new product</h1>
          <p className="mt-2 text-sm text-muted">Create a polished listing with current stock and product media.</p>
          <div className="mt-5 grid gap-4">
            {error && <Alert type="error" message={error} />}
            {success && <Alert type="success" message={success} />}
            {loading && <LoadingSpinner />}
            <input className="rounded-lg border border-border px-3.5 py-2.5 text-sm" placeholder="Name" value={form.name} onChange={(event) => updateField('name', event.target.value)} />
            <textarea className="min-h-28 rounded-lg border border-border px-3.5 py-2.5 text-sm" placeholder="Description" value={form.description} onChange={(event) => updateField('description', event.target.value)} />
            <div className="grid gap-4 sm:grid-cols-3">
              <input className="rounded-lg border border-border px-3.5 py-2.5 text-sm" placeholder="Price" value={form.price} onChange={(event) => updateField('price', event.target.value)} />
              <input className="rounded-lg border border-border px-3.5 py-2.5 text-sm" placeholder="Stock" value={form.stock} onChange={(event) => updateField('stock', event.target.value)} />
              <input className="rounded-lg border border-border px-3.5 py-2.5 text-sm" placeholder="Category" value={form.category} onChange={(event) => updateField('category', event.target.value)} />
            </div>
            <input className="rounded-lg border border-border px-3.5 py-2.5 text-sm" placeholder="Direct image URL" value={form.imageUrl} onChange={(event) => updateField('imageUrl', event.target.value)} />
            <input type="file" accept="image/*" className="rounded-lg border border-border px-3.5 py-2.5 text-sm" onChange={(event) => setFile(event.target.files?.[0] || null)} />
            <button className="rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition hover:bg-indigo-600 disabled:opacity-50" disabled={loading}>Add Product</button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default AddProduct;

