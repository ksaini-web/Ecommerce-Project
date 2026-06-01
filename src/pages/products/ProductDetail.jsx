import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Alert from '../../components/Alert';
import LoadingSpinner from '../../components/LoadingSpinner';
import { cartAPI, productAPI } from '../../api/axiosInstance';
import useAuth from '../../hooks/useAuth';

const apiMessage = (e) => e.detail?.message ?? e.response?.data?.message ?? e.message ?? 'Something went wrong';
const productName = (product) => product.name || product.title || 'Product';
const productImage = (product) => product.imageUrl || product.thumbnail || product.image || '';

function ProductDetail() {
  const params = useParams();
  const productId = params.productId || params.id;
  const { user, isUserLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await productAPI.getById(productId);
        setProduct(res.data?.product || res.data);
      } catch (e) {
        setError(apiMessage(e));
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  const handleAddToCart = async () => {
    if (!isUserLoggedIn || !user?.id) {
      navigate('/login');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');
    try {
      await cartAPI.add({ userId: user.id, productId, quantity: 1 });
      setSuccess('Product added to cart');
    } catch (e) {
      setError(apiMessage(e));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen surface-shell">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
        {loading ? (
          <LoadingSpinner label="Loading product" />
        ) : (
          <section className="panel grid gap-8 rounded-lg p-5 md:grid-cols-2 md:p-7">
            {product && (
              <>
                <div className="grid min-h-[320px] place-items-center rounded-lg bg-surface p-6">
                  {productImage(product) ? (
                    <img
                      src={productImage(product)}
                      alt={productName(product)}
                      className="max-h-[420px] object-contain"
                      loading="eager"
                      decoding="async"
                    />
                  ) : <span className="text-sm text-muted">No image</span>}
                </div>
                <div className="flex flex-col gap-5">
                  <div>
                    <Link to="/products" className="text-sm font-semibold text-primary transition hover:text-indigo-700">Back to products</Link>
                    <h1 className="mt-2 text-3xl font-semibold text-gray-950">{productName(product)}</h1>
                    <p className="mt-2 inline-flex rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-muted">{product.category}</p>
                  </div>
                  {error && <Alert type="error" message={error} />}
                  {success && <Alert type="success" message={success} />}
                  <p className="text-sm leading-6 text-gray-700">{product.description}</p>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-3xl font-medium text-gray-950">${Number(product.price || 0).toFixed(2)}</span>
                    <span className={`rounded-full px-3 py-1 text-sm font-medium ${Number(product.stock || 0) > 0 ? 'bg-green-50 text-success' : 'bg-red-50 text-danger'}`}>
                      {Number(product.stock || 0) > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </span>
                  </div>
                  {submitting && <LoadingSpinner size="sm" />}
                  <button type="button" className="rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition hover:bg-indigo-600 disabled:opacity-50" onClick={handleAddToCart} disabled={submitting || Number(product.stock || 0) <= 0}>
                    Add to cart
                  </button>
                </div>
              </>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

export default ProductDetail;

