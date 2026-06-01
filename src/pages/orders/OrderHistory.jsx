import { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import Navbar from '../../components/Navbar';
import Alert from '../../components/Alert';
import LoadingSpinner from '../../components/LoadingSpinner';
import { orderAPI } from '../../api/axiosInstance';

const apiMessage = (e) => e.detail?.message ?? e.response?.data?.message ?? e.message ?? 'Something went wrong';
const itemsFrom = (order) => order.items || order.orderItems || [];

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await orderAPI.getUserOrders();
        setOrders(Array.isArray(data) ? data : data.orders || []);
      } catch (e) {
        setError(apiMessage(e));
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  return (
    <div className="min-h-screen surface-shell">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:py-10">
        <span className="text-sm font-semibold text-primary">Purchases</span>
        <h1 className="mt-1 text-2xl font-semibold text-gray-950 sm:text-3xl">Order history</h1>
        {error && <div className="mt-5"><Alert type="error" message={error} /></div>}
        {loading ? (
          <LoadingSpinner label="Loading orders" />
        ) : orders.length === 0 ? (
          <section className="panel mt-8 rounded-lg p-10 text-center text-muted">No orders yet</section>
        ) : (
          <section className="mt-6 grid gap-4">
            {orders.map((order) => (
              <article key={order.id} className="panel grid gap-5 rounded-lg p-5 md:grid-cols-[1fr_120px]">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="font-semibold text-gray-950">Order #{order.orderId || order.id}</h2>
                      <p className="mt-1 text-sm text-muted">{order.orderStatus || order.paymentStatus} - Rs. {Number(order.totalPrice || 0).toFixed(2)}</p>
                    </div>
                    <p className="text-sm text-muted">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ''}</p>
                  </div>
                  <div className="mt-4 grid gap-2">
                    {itemsFrom(order).map((item) => (
                      <div key={item.id || `${order.id}-${item.productId}`} className="flex justify-between rounded-lg bg-surface px-3 py-2 text-sm">
                        <span>{item.productName} x {item.quantity}</span>
                        <span>Rs. {Number(item.amount || item.totalPrice || 0).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <aside className="rounded-lg border border-border bg-white p-2">
                  <QRCode value={order.qrPayload || JSON.stringify(order)} className="h-auto w-full" />
                </aside>
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}

export default OrderHistory;
