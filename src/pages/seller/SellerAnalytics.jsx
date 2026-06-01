import { useEffect, useMemo, useState } from 'react';
import Navbar from '../../components/Navbar';
import Alert from '../../components/Alert';
import LoadingSpinner from '../../components/LoadingSpinner';
import { sellerAPI } from '../../api/axiosInstance';
import useAuth from '../../hooks/useAuth';

const apiMessage = (e) => e.detail?.message ?? e.response?.data?.message ?? e.message ?? 'Something went wrong';

function SellerAnalytics() {
  const { seller } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [period, setPeriod] = useState('daily');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadAnalytics = async () => {
      const sellerId = seller?.id || localStorage.getItem('sellerId');
      if (!sellerId) {
        setError('Seller session is missing');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');
      try {
        // Backend doesn't support period filtering, so we fetch all data
        const res = await sellerAPI.getAnalytics();
        setAnalytics(res.data);
      } catch (e) {
        setError(apiMessage(e));
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [seller?.id]);

  const metrics = useMemo(() => [
    ['Revenue', `Rs. ${Number(analytics?.totalRevenue || 0).toFixed(2)}`],
    ['Products', analytics?.totalProducts ?? 0],
    ['Orders', analytics?.totalOrders ?? 0],
    ['Successful Payments', analytics?.successfulPayments ?? 0],
  ], [analytics]);
  const revenueSeries = analytics?.revenueSeries || [];
  const productSeries = analytics?.productSales || [];
  const maxRevenue = Math.max(...revenueSeries.map((item) => Number(item.amount || 0)), 1);
  const maxUnits = Math.max(...productSeries.map((item) => Number(item.quantity || 0)), 1);

  return (
    <div className="min-h-screen surface-shell">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:py-10">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-sm font-semibold text-primary">Performance</span>
            <h1 className="mt-1 text-2xl font-semibold text-gray-950 sm:text-3xl">Seller analytics</h1>
          </div>
          <div className="inline-flex w-fit rounded-lg border border-border bg-white p-1 shadow-sm">
            {['daily', 'weekly', 'monthly'].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setPeriod(option)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium capitalize transition ${period === option ? 'bg-primary text-white shadow-sm' : 'text-muted hover:bg-surface'}`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
        {error && <div className="mt-5"><Alert type="error" message={error} /></div>}
        {loading ? (
          <LoadingSpinner label="Loading analytics" />
        ) : (
          <>
            <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {metrics.map(([label, value]) => (
                <article key={label} className="panel rounded-lg p-5">
                  <p className="text-sm text-muted">{label}</p>
                  <p className="mt-3 text-2xl font-semibold text-gray-950">{value}</p>
                </article>
              ))}
            </section>
            <section className="mt-6 grid gap-6 lg:grid-cols-2">
              <article className="panel rounded-lg p-5">
                <h2 className="text-lg font-semibold text-gray-950">Revenue analytics</h2>
                <div className="mt-5 flex h-64 items-end gap-3">
                  {revenueSeries.length === 0 ? (
                    <div className="grid h-full w-full place-items-center rounded-lg bg-surface text-sm text-muted">No revenue data yet</div>
                  ) : revenueSeries.map((item) => (
                    <div key={item.label} className="flex flex-1 flex-col items-center gap-2">
                      <div className="w-full rounded-t-lg bg-primary transition-all" style={{ height: `${Math.max((Number(item.amount || 0) / maxRevenue) * 100, 4)}%` }} />
                      <span className="text-xs text-muted">{item.label}</span>
                    </div>
                  ))}
                </div>
              </article>
              <article className="panel rounded-lg p-5">
                <h2 className="text-lg font-semibold text-gray-950">Product sales analytics</h2>
                <div className="mt-5 grid gap-3">
                  {productSeries.length === 0 ? (
                    <div className="grid min-h-64 place-items-center rounded-lg bg-surface text-sm text-muted">No product sales yet</div>
                  ) : productSeries.map((item) => (
                    <div key={item.productName}>
                      <div className="mb-1 flex justify-between text-sm">
                        <span className="font-medium text-gray-800">{item.productName}</span>
                        <span className="text-muted">{item.quantity}</span>
                      </div>
                      <div className="h-3 overflow-hidden rounded-full bg-surface">
                        <div className="h-full rounded-full bg-emerald-500" style={{ width: `${Math.max((Number(item.quantity || 0) / maxUnits) * 100, 4)}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default SellerAnalytics;
