import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import QRCode from 'react-qr-code';
import Navbar from '../../components/Navbar';
import Alert from '../../components/Alert';
import LoadingSpinner from '../../components/LoadingSpinner';
import { productAPI, sellerAPI, uploadAPI } from '../../api/axiosInstance';
import useAuth from '../../hooks/useAuth';

const apiMessage = (e) => e.detail?.message ?? e.response?.data?.message ?? e.message ?? 'Something went wrong';
const productsFrom = (payload) => (Array.isArray(payload) ? payload : payload?.products || []);
const emptyForm = { name: '', description: '', price: '', stock: '', category: '', imageUrl: '' };
const productName = (product) => product.name || product.title || 'Product';
const productImage = (product) => product.imageUrl || product.thumbnail || product.image || '';

function SellerDashboard() {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState(emptyForm);
  const [editFile, setEditFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [summary, setSummary] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const { seller } = useAuth();
  const metrics = useMemo(() => ([
    ['Total Revenue', `Rs. ${Number(summary?.totalRevenue || 0).toFixed(2)}`],
    ['Total Orders', summary?.totalOrders || 0],
    ['Total Products', summary?.totalProducts ?? products.length],
    ['Successful Payments', summary?.successfulPayments || 0],
  ]), [products.length, summary]);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const [productRes, revenueRes, orderRes] = await Promise.all([
          productAPI.getAll(),
          sellerAPI.getRevenue().catch(() => ({ data: null })),
          sellerAPI.getOrders().catch(() => ({ data: [] })),
        ]);
        const allProducts = productsFrom(productRes.data);
        setProducts(seller?.id ? allProducts.filter((product) => String(product.sellerId || product.seller?.id || seller.id) === String(seller.id)) : allProducts);
        setSummary(revenueRes.data);
        setRecentOrders((Array.isArray(orderRes.data) ? orderRes.data : orderRes.data?.recentOrders || orderRes.data?.orders || []).slice(0, 5));
      } catch (e) {
        setError(apiMessage(e));
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [seller?.id]);

  const startEdit = useCallback((product) => {
    setEditing(product);
    setEditFile(null);
    setEditForm({
      name: product.name || product.title || '',
      description: product.description || '',
      price: product.price || '',
      stock: product.stock || '',
      category: product.category || '',
      imageUrl: productImage(product),
    });
  }, []);

  const updateEditField = useCallback((field, value) => setEditForm((current) => ({ ...current, [field]: value })), []);

  const handleSave = async (event) => {
    event.preventDefault();
    if (!editing) return;

    setPending(true);
    setError('');
    setSuccess('');
    try {
      let imageUrl = editForm.imageUrl;
      if (editFile) {
        const fd = new FormData();
        fd.append('file', editFile);
        const { data } = await uploadAPI.uploadImage(fd);
        imageUrl = data.url;
      }

      const payload = {
        ...editForm,
        title: editForm.name,
        imageUrl,
        thumbnail: imageUrl,
        price: Number(editForm.price),
        stock: Number(editForm.stock),
      };
      const res = await productAPI.update(editing.id, payload);
      const saved = res.data?.product || res.data || { ...editing, ...payload };
      setProducts((items) => items.map((product) => (product.id === editing.id ? saved : product)));
      setSuccess('Product updated successfully');
      setEditing(null);
    } catch (e) {
      setError(apiMessage(e));
    } finally {
      setPending(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Delete this product?')) return;
    const previousProducts = products;
    setPending(true);
    setError('');
    setSuccess('');
    setProducts((items) => items.filter((product) => product.id !== productId));
    try {
      await productAPI.remove(productId);
      setSuccess('Product deleted successfully');
    } catch (e) {
      setProducts(previousProducts);
      setError(apiMessage(e));
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="min-h-screen surface-shell">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="text-sm font-semibold text-primary">Seller panel</span>
            <h1 className="mt-1 text-2xl font-semibold text-gray-950 sm:text-3xl">Seller dashboard</h1>
            <p className="text-sm text-muted">{seller?.businessName || seller?.name || 'Manage your store'}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/seller/analytics" className="rounded-lg border border-border bg-white px-5 py-2.5 text-sm font-semibold text-gray-950 shadow-sm transition hover:border-primary hover:bg-indigo-50">Analytics</Link>
            <Link to="/seller/add-product" className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition hover:bg-indigo-600">Add new product</Link>
          </div>
        </div>

        <div className="mt-5 grid gap-4">
          {error && <Alert type="error" message={error} />}
          {success && <Alert type="success" message={success} />}
          {pending && <LoadingSpinner size="sm" />}
        </div>

        <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {metrics.map(([label, value]) => (
            <article key={label} className="panel rounded-lg p-5">
              <p className="text-sm text-muted">{label}</p>
              <p className="mt-3 text-2xl font-semibold text-gray-950">{value}</p>
            </article>
          ))}
        </section>

        {loading ? (
          <LoadingSpinner label="Loading dashboard" />
        ) : (
          <section className="panel table-scroll mt-6 rounded-lg">
            {products.length === 0 ? (
              <div className="p-8 text-center text-muted">No products yet</div>
            ) : (
              <table className="w-full min-w-[680px] text-left text-sm">
                <thead className="bg-surface text-muted">
                  <tr>
                    <th className="p-4 font-medium">Thumbnail</th>
                    <th className="p-4 font-medium">Name</th>
                    <th className="p-4 font-medium">Price</th>
                    <th className="p-4 font-medium">Stock</th>
                    <th className="p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-t border-border transition hover:bg-surface/70">
                      <td className="p-4">{productImage(product) ? <img src={productImage(product)} alt={productName(product)} className="h-12 w-12 rounded-lg object-cover" loading="lazy" decoding="async" /> : <div className="h-12 w-12 rounded-lg bg-surface" />}</td>
                      <td className="p-4 font-medium text-gray-950">{productName(product)}</td>
                      <td className="p-4">${Number(product.price || 0).toFixed(2)}</td>
                      <td className="p-4">{product.stock}</td>
                      <td className="p-4">
                        <button type="button" className="rounded-md px-2 py-1 font-medium text-primary transition hover:bg-indigo-50" onClick={() => startEdit(product)}>Edit</button>
                        <span className="mx-2 text-muted">.</span>
                        <button type="button" className="rounded-md px-2 py-1 font-medium text-danger transition hover:bg-red-50" onClick={() => handleDelete(product.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        )}

        <section className="panel mt-6 rounded-lg p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-medium text-gray-950">Recent orders</h2>
            <Link to="/seller/analytics" className="text-sm font-medium text-primary">View analytics</Link>
          </div>
          <div className="mt-4 grid gap-3">
            {recentOrders.length === 0 ? (
              <p className="text-sm text-muted">No successful orders yet</p>
            ) : recentOrders.map((order) => (
              <article key={order.id} className="grid gap-4 rounded-lg border border-border p-4 transition hover:bg-surface/70 sm:grid-cols-[1fr_88px]">
                <div>
                  <p className="font-medium text-gray-950">Order #{order.orderId || order.id}</p>
                  <p className="text-sm text-muted">{order.productName || `${order.itemCount || order.quantity || 0} items`} - Rs. {Number(order.amount || order.totalPrice || 0).toFixed(2)}</p>
                  <p className="mt-1 text-xs text-muted">Payment {order.paymentId || 'pending'}</p>
                </div>
                <QRCode value={order.qrPayload || JSON.stringify(order)} className="h-auto w-full rounded bg-white p-1" />
              </article>
            ))}
          </div>
        </section>

        {editing && (
          <form className="panel mt-6 rounded-lg p-5" onSubmit={handleSave}>
            <h2 className="text-lg font-semibold text-gray-950">Edit product</h2>
            <div className="mt-4 grid gap-4">
              <input className="rounded-lg border border-border px-3.5 py-2.5 text-sm" placeholder="Name" value={editForm.name} onChange={(event) => updateEditField('name', event.target.value)} />
              <textarea className="min-h-24 rounded-lg border border-border px-3.5 py-2.5 text-sm" placeholder="Description" value={editForm.description} onChange={(event) => updateEditField('description', event.target.value)} />
              <div className="grid gap-4 sm:grid-cols-3">
                <input className="rounded-lg border border-border px-3.5 py-2.5 text-sm" placeholder="Price" value={editForm.price} onChange={(event) => updateEditField('price', event.target.value)} />
                <input className="rounded-lg border border-border px-3.5 py-2.5 text-sm" placeholder="Stock" value={editForm.stock} onChange={(event) => updateEditField('stock', event.target.value)} />
                <input className="rounded-lg border border-border px-3.5 py-2.5 text-sm" placeholder="Category" value={editForm.category} onChange={(event) => updateEditField('category', event.target.value)} />
              </div>
              <input className="rounded-lg border border-border px-3.5 py-2.5 text-sm" placeholder="Direct image URL" value={editForm.imageUrl} onChange={(event) => updateEditField('imageUrl', event.target.value)} />
              <input type="file" accept="image/*" className="rounded-lg border border-border px-3.5 py-2.5 text-sm" onChange={(event) => setEditFile(event.target.files?.[0] || null)} />
              <div className="flex gap-3">
                <button className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition hover:bg-indigo-600 disabled:opacity-50" disabled={pending}>Save</button>
                <button type="button" className="rounded-lg border border-border px-5 py-2.5 text-sm font-semibold transition hover:bg-surface" onClick={() => setEditing(null)}>Cancel</button>
              </div>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}

export default SellerDashboard;

