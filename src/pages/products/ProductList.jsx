import { useEffect, useMemo, useState } from 'react';
import Navbar from '../../components/Navbar';
import Alert from '../../components/Alert';
import LoadingSpinner from '../../components/LoadingSpinner';
import ProductCard from '../../components/ProductCard';
import { productAPI } from '../../api/axiosInstance';

const apiMessage = (e) => e.detail?.message ?? e.response?.data?.message ?? e.message ?? 'Something went wrong';
const productsFrom = (payload) => (Array.isArray(payload) ? payload : payload?.products || []);

function ProductList() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const productCount = useMemo(() => filteredProducts.length, [filteredProducts.length]);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await productAPI.getAll();
        const nextProducts = productsFrom(res.data);
        setProducts(nextProducts);
        setFilteredProducts(nextProducts);
      } catch (e) {
        setError(apiMessage(e));
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <div className="min-h-screen surface-shell">
      <Navbar products={products} setFilteredProduct={setFilteredProducts} />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:py-10">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-sm font-semibold text-primary">Curated products</span>
            <h1 className="mt-1 text-2xl font-semibold text-gray-950 sm:text-3xl">Fresh deals for your everyday cart</h1>
          </div>
          <p className="rounded-full border border-border bg-white px-3 py-1 text-sm font-medium text-muted shadow-sm">{productCount} products found</p>
        </div>

        {error && <div className="mb-5"><Alert type="error" message={error} /></div>}
        {loading ? (
          <LoadingSpinner label="Loading products" />
        ) : filteredProducts.length === 0 ? (
          <section className="panel rounded-lg p-10 text-center text-muted">No products yet</section>
        ) : (
          <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)}
          </section>
        )}
      </main>
    </div>
  );
}

export default ProductList;

