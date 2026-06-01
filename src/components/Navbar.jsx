import { memo, useCallback, useState, useTransition } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaRegUser, FaSearch } from 'react-icons/fa';
import { IoMenu } from 'react-icons/io5';
import { MdAddShoppingCart } from 'react-icons/md';
import useAuth from '../hooks/useAuth';
import CartIcon from './CartIcon';

const noop = () => {};

const linkClass = ({ isActive }) =>
  `rounded-md px-2.5 py-2 text-sm font-medium transition ${
    isActive ? 'bg-indigo-50 text-primary' : 'text-gray-700 hover:bg-gray-50 hover:text-primary'
  }`;

function Navbar({ products = [], setFilteredProduct = noop, setCurrentPage = noop }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [accountOpen, setAccountOpen] = useState(false);
  const [, startTransition] = useTransition();
  const { user, isUserLoggedIn, isSellerLoggedIn, logoutUser, logoutSeller } = useAuth();

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const handleSearch = useCallback((value) => {
    setSearch(value);

    if (!products.length) return;

    startTransition(() => {
      const query = value.trim().toLowerCase();
      const filtered = query
        ? products.filter((item) => item.title?.toLowerCase().includes(query))
        : products;

      setFilteredProduct(filtered);
      setCurrentPage(1);
    });
  }, [products, setCurrentPage, setFilteredProduct, startTransition]);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white/90 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
        <Link to={isSellerLoggedIn ? '/seller/dashboard' : '/'} className="flex items-center gap-2">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary text-white shadow-sm shadow-indigo-200">
            <MdAddShoppingCart />
          </span>
          <span>
            <span className="block text-base font-semibold leading-5 text-gray-950">Shopcart</span>
            <span className="block text-xs text-muted">Smart daily shopping</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {isSellerLoggedIn ? (
            <>
              <NavLink to="/seller/dashboard" className={linkClass}>
                Dashboard
              </NavLink>
              <NavLink to="/seller/add-product" className={linkClass}>
                Add Product
              </NavLink>
              <NavLink to="/seller/analytics" className={linkClass}>
                Analytics
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/" className={linkClass}>
                Home
              </NavLink>
              <NavLink to="/products" className={linkClass}>
                Products
              </NavLink>
              <NavLink to="/products?offers=true" className={linkClass}>
                Offers
              </NavLink>
              {!isUserLoggedIn && (
                <>
                  <NavLink to="/seller/signup" className={linkClass}>
                    Become a Seller
                  </NavLink>
                  <NavLink to="/seller/login" className={linkClass}>
                    Seller Login
                  </NavLink>
                </>
              )}
            </>
          )}
        </nav>

        {!isSellerLoggedIn && (
          <div className="ml-auto hidden min-w-52 max-w-sm flex-1 items-center rounded-lg border border-border bg-white px-3 py-2 shadow-sm focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 md:flex">
            <FaSearch className="text-muted" />
            <input
              type="text"
              value={search}
              onChange={(event) => handleSearch(event.target.value)}
              placeholder="Search products"
              className="w-full border-0 bg-transparent px-2 text-sm outline-none placeholder:text-muted"
            />
          </div>
        )}

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          {isUserLoggedIn && (
            <>
              <Link to="/cart" className="rounded-lg border border-border px-3 py-2 text-gray-800 transition hover:border-primary hover:bg-indigo-50">
                <CartIcon />
              </Link>
              <div className="relative">
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm transition hover:border-primary hover:bg-indigo-50"
                  onClick={() => setAccountOpen((open) => !open)}
                >
                  <FaRegUser />
                  <span className="hidden sm:inline">{user?.name || 'Account'}</span>
                </button>
                {accountOpen && (
                  <div className="absolute right-0 mt-2 w-44 rounded-lg border border-border bg-white p-2 shadow-lg shadow-slate-200/70">
                    <Link to="/orders" className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-surface">
                      My Orders
                    </Link>
                    <button className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-surface">
                      Wishlist
                    </button>
                    <button
                      type="button"
                      className="block w-full rounded-lg px-3 py-2 text-left text-sm text-danger hover:bg-red-50"
                      onClick={logoutUser}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          {isSellerLoggedIn && (
            <>
              <button
                type="button"
                className="rounded-lg border border-border px-3 py-2 text-sm transition hover:border-primary hover:bg-indigo-50"
                onClick={logoutSeller}
              >
                Logout
              </button>
            </>
          )}

          {!isUserLoggedIn && !isSellerLoggedIn && (
            <div className="hidden items-center gap-2 sm:flex">
              <Link to="/login" className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition hover:border-primary hover:bg-indigo-50">
                Login
              </Link>
              <Link
                to="/signup"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm shadow-indigo-200 transition hover:bg-indigo-600"
              >
                Sign Up
              </Link>
            </div>
          )}

          <button
            type="button"
            className="rounded-lg border border-border p-2 transition hover:bg-gray-50 md:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Open menu"
          >
            <IoMenu className="text-xl" />
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="grid gap-2 border-t border-border bg-white px-4 py-3 shadow-sm md:hidden">
          {isSellerLoggedIn ? (
            <>
              <Link to="/seller/dashboard" className="rounded-lg px-3 py-2 text-sm hover:bg-surface" onClick={closeMenu}>Dashboard</Link>
              <Link to="/seller/add-product" className="rounded-lg px-3 py-2 text-sm hover:bg-surface" onClick={closeMenu}>Add Product</Link>
              <Link to="/seller/analytics" className="rounded-lg px-3 py-2 text-sm hover:bg-surface" onClick={closeMenu}>Analytics</Link>
            </>
          ) : (
            <>
              <Link to="/" className="rounded-lg px-3 py-2 text-sm hover:bg-surface" onClick={closeMenu}>Home</Link>
              <Link to="/products" className="rounded-lg px-3 py-2 text-sm hover:bg-surface" onClick={closeMenu}>Products</Link>
              {!isUserLoggedIn && (
                <>
                  <Link to="/seller/signup" className="rounded-lg px-3 py-2 text-sm hover:bg-surface" onClick={closeMenu}>Become a Seller</Link>
                  <Link to="/seller/login" className="rounded-lg px-3 py-2 text-sm hover:bg-surface" onClick={closeMenu}>Seller Login</Link>
                </>
              )}
              {!isUserLoggedIn && (
                <>
                  <Link to="/login" className="rounded-lg px-3 py-2 text-sm hover:bg-surface" onClick={closeMenu}>
                    Login
                  </Link>
                  <Link to="/signup" className="rounded-lg px-3 py-2 text-sm hover:bg-surface" onClick={closeMenu}>
                    Sign Up
                  </Link>
                </>
              )}
            </>
          )}
        </nav>
      )}
    </header>
  );
}

export default memo(Navbar);
