import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import QRCode from 'react-qr-code';
import Navbar from '../../components/Navbar';
import Alert from '../../components/Alert';
import LoadingSpinner from '../../components/LoadingSpinner';
import { orderAPI } from '../../api/axiosInstance';

const apiMessage = (e) => e.detail?.message ?? e.response?.data?.message ?? e.message ?? 'Something went wrong';
const orderItems = (order) => order?.items || order?.orderItems || [];

function OrderSuccess() {
  const { id } = useParams();
  const { state } = useLocation();
  const [order, setOrder] = useState(state?.order || null);
  const [loading, setLoading] = useState(!state?.order);
  const [error, setError] = useState('');

  useEffect(() => {
    if (order) return;

    const loadOrder = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await orderAPI.getById(id);
        setOrder(data);
      } catch (e) {
        setError(apiMessage(e));
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [id, order]);

  const qrValue = useMemo(() => JSON.stringify({
    orderId: order?.orderId || order?.id,
    paymentId: order?.paymentId,
    amount: order?.amount,
    user: order?.user,
    products: orderItems(order).map((item) => ({
      name: item.productName,
      quantity: item.quantity,
      seller: item.sellerName,
    })),
  }), [order]);

  return (
    <div className="min-h-screen surface-shell">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
        {error && <Alert type="error" message={error} />}
        {loading ? (
          <LoadingSpinner label="Loading order" />
        ) : (
          <section className="panel grid gap-6 rounded-lg p-6 lg:grid-cols-[1fr_260px]">
            <div>
              <p className="text-sm font-semibold text-emerald-600">Payment successful</p>
              <h1 className="mt-2 text-2xl font-semibold text-gray-950">Order #{order?.orderId || order?.id}</h1>
              <p className="mt-2 text-sm text-muted">Payment ID: {order?.paymentId}</p>
              <div className="mt-6 grid gap-3">
                {orderItems(order).map((item) => (
                  <article key={item.id || `${item.productId}-${item.quantity}`} className="rounded-lg border border-border p-4 transition hover:bg-surface/70">
                    <div className="flex justify-between gap-4">
                      <div>
                        <h2 className="font-medium text-gray-950">{item.productName}</h2>
                        <p className="text-sm text-muted">Qty {item.quantity} - {item.sellerName}</p>
                      </div>
                      <p className="font-medium text-gray-950">Rs. {Number(item.amount || item.totalPrice || 0).toFixed(2)}</p>
                    </div>
                  </article>
                ))}
              </div>
              <div className="mt-6 flex gap-3">
                <Link to="/orders" className="rounded-lg border border-border px-5 py-2.5 text-sm font-semibold transition hover:bg-surface">View orders</Link>
                <Link to="/products" className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition hover:bg-indigo-600">Continue shopping</Link>
              </div>
            </div>
            <aside className="rounded-lg border border-border p-5">
              <QRCode value={qrValue} className="h-auto w-full" />
              <p className="mt-4 text-center text-sm text-muted">Order verification QR</p>
            </aside>
          </section>
        )}
      </main>
    </div>
  );
}

export default OrderSuccess;
