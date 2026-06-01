import React, { useEffect, useState } from 'react';
import TopBar from '../TopBar';
import Navbar from '../components/Navbar';
import HeroSection from '../HeroSection';
import ProductCard from '../components/ProductCard';
import Alert from '../components/Alert';
import LoadingSpinner from '../components/LoadingSpinner';
import { productAPI } from '../api/axiosInstance';
import './Home.css';

const productsFrom = (payload) => (Array.isArray(payload) ? payload : payload?.products || []);
const apiMessage = (error) => error.response?.data?.message ?? error.message ?? 'Unable to load products';

function Home() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const productsPerPage = 8;
  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError('');

      try {
        const res = await productAPI.getAll();
        const nextProducts = productsFrom(res.data);
        setProducts(nextProducts);
        setFilteredProducts(nextProducts);
      } catch (err) {
        setError(apiMessage(err));
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <div className="home-page">
      <div className="home-page__inner">
        <TopBar />

        <div className="home-page__panel">
          <Navbar
            products={products}
            setFilteredProduct={setFilteredProducts}
            setCurrentPage={setCurrentPage}
          />

          <HeroSection />

          <div className="home-page__section-head">
            <div>
              <span className="home-page__eyebrow">Curated products</span>
              <h2>Fresh deals for your everyday cart</h2>
            </div>
            <p>{filteredProducts.length} products found</p>
          </div>

          {error && <Alert type="error" message={error} />}

          {loading ? (
            <LoadingSpinner />
          ) : currentProducts.length === 0 ? (
            <section className="rounded-lg border border-border bg-white p-8 text-center text-muted">
              No products yet
            </section>
          ) : (
            <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {currentProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </section>
          )}

          <div className="home-page__pagination">
            <button
              type="button"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Prev
            </button>

            <span>Page {currentPage}</span>

            <button
              type="button"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={indexOfLast >= filteredProducts.length}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
