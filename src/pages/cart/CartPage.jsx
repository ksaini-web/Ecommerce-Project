import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Alert from '../../components/Alert';
import LoadingSpinner from '../../components/LoadingSpinner';
import { cartAPI } from '../../api/axiosInstance';
import useAuth from '../../hooks/useAuth';
import { handlePayment } from '../../assets/payment/payment';

const apiMessage = (e) => e.detail?.message ?? e.response?.data?.message ?? e.message ?? 'Something went wrong';
const itemsFrom = (payload) => (Array.isArray(payload) ? payload : payload?.items || payload?.cartItems || []);
const itemId = (item) => item.cartItemId || item.cartId || item.id;
const itemProduct = (item) => item.product || item;
const productName = (product) => product.name || product.title || 'Product';
const productImage = (product, item) => product.imageUrl || product.thumbnail || product.image || item.imageUrl || item.thumbnail || '';

function CartPage() {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadCart = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');
      try {
        const res = await cartAPI.getByUser(user.id);
        setCartItems(itemsFrom(res.data));
      } catch (e) {
        setError(apiMessage(e));
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [user?.id]);

  const total = useMemo(
    () => cartItems.reduce((sum, item) => {
      const product = itemProduct(item);
      return sum + Number(product.price || item.price || 0) * Number(item.quantity || 0);
    }, 0),
    [cartItems]
  );

  const handleUpdate = useCallback(async (cartItemId, quantity) => {
    if (quantity < 1) return;
    const previousItems = cartItems;
    setPending(true);
    setError('');
    setSuccess('');
    setCartItems((items) => items.map((item) => (itemId(item) === cartItemId ? { ...item, quantity } : item)));
    try {
      await cartAPI.update(cartItemId, { quantity });
      setSuccess('Cart updated');
    } catch (e) {
      setCartItems(previousItems);
      setError(apiMessage(e));
    } finally {
      setPending(false);
    }
  }, [cartItems]);

  const handleRemove = useCallback(async (cartItemId) => {
    const previousItems = cartItems;
    setPending(true);
    setError('');
    setSuccess('');
    setCartItems((items) => items.filter((item) => itemId(item) !== cartItemId));
    try {
      await cartAPI.remove(cartItemId);
      setSuccess('Item removed from cart');
    } catch (e) {
      setCartItems(previousItems);
      setError(apiMessage(e));
    } finally {
      setPending(false);
    }
  }, [cartItems]);

  const handleCheckout = useCallback(async () => {
    if (!cartItems.length) return;

    setPending(true);
    setError('');
    setSuccess('');
    try {
      await handlePayment({
        cartItems,
        user,
        onSuccess: (order) => {
          setPending(false);
          navigate(`/orders/success/${order.id || order.orderId}`, { state: { order } });
        },
        onError: (paymentError) => {
          setPending(false);
          setError(apiMessage(paymentError));
        },
      });
    } catch (e) {
      setPending(false);
      setError(apiMessage(e));
    }
  }, [cartItems, navigate, user]);

  return (
    <div className="min-h-screen surface-shell">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:py-10">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-sm font-semibold text-primary">Checkout</span>
            <h1 className="mt-1 text-2xl font-semibold text-gray-950 sm:text-3xl">Shopping cart</h1>
          </div>
          {!loading && cartItems.length > 0 && (
            <p className="rounded-full border border-border bg-white px-3 py-1 text-sm font-medium text-muted shadow-sm">{cartItems.length} items</p>
          )}
        </div>
        <div className="mt-5 grid gap-4">
          {error && <Alert type="error" message={error} />}
          {success && <Alert type="success" message={success} />}
          {pending && <LoadingSpinner size="sm" />}
        </div>

        {loading ? (
          <LoadingSpinner label="Loading cart" />
        ) : cartItems.length === 0 ? (
          <section className="panel mt-8 rounded-lg p-10 text-center">
            <h2 className="text-xl font-semibold text-gray-950">Your cart is empty</h2>
            <p className="mt-2 text-sm text-muted">Add products you like and they will appear here.</p>
            <Link to="/products" className="mt-5 inline-flex rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition hover:bg-indigo-600">Start shopping</Link>
          </section>
        ) : (
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
            <section className="grid gap-4">
              {cartItems.map((item) => {
                const product = itemProduct(item);
                const cartItemId = itemId(item);
                const quantity = Number(item.quantity || 1);
                const price = Number(product.price || item.price || 0);

                return (
                  <article key={cartItemId} className="panel grid gap-4 rounded-lg p-5 sm:grid-cols-[96px_1fr_auto]">
                    {productImage(product, item) ? (
                      <img src={productImage(product, item)} alt={productName(product)} className="h-24 w-24 rounded-lg object-cover" loading="lazy" decoding="async" />
                    ) : <div className="h-24 w-24 rounded-lg bg-surface" />}
                    <div>
                      <h2 className="text-base font-semibold text-gray-950">{productName(product)}</h2>
                      <p className="mt-1 text-sm text-muted">${price.toFixed(2)}</p>
                      <div className="mt-4 flex items-center gap-2">
                        <button type="button" className="h-9 w-9 rounded-lg border border-border transition hover:border-primary hover:bg-indigo-50 disabled:opacity-50" onClick={() => handleUpdate(cartItemId, quantity - 1)} disabled={pending}>-</button>
                        <span className="w-8 text-center text-sm">{quantity}</span>
                        <button type="button" className="h-9 w-9 rounded-lg border border-border transition hover:border-primary hover:bg-indigo-50 disabled:opacity-50" onClick={() => handleUpdate(cartItemId, quantity + 1)} disabled={pending}>+</button>
                        <button type="button" className="ml-3 rounded-md px-2 py-1 text-sm font-medium text-danger transition hover:bg-red-50 disabled:opacity-50" onClick={() => handleRemove(cartItemId)} disabled={pending}>Remove</button>
                      </div>
                    </div>
                    <p className="text-right text-base font-medium text-gray-950">${(price * quantity).toFixed(2)}</p>
                  </article>
                );
              })}
            </section>

            <aside className="panel h-fit rounded-lg p-5 lg:sticky lg:top-24">
              <h2 className="text-lg font-semibold text-gray-950">Order summary</h2>
              <div className="mt-5 grid gap-3 text-sm">
                <div className="flex justify-between text-muted"><span>Subtotal</span><span>${total.toFixed(2)}</span></div>
                <div className="flex justify-between border-t border-border pt-3 text-base font-semibold text-gray-950"><span>Total</span><span>${total.toFixed(2)}</span></div>
              </div>
              <button type="button" className="mt-5 w-full rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition hover:bg-indigo-600 disabled:opacity-50" disabled={pending} onClick={handleCheckout}>
                Pay with Razorpay
              </button>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}

export default CartPage;

