import React, { useContext, useState } from 'react';
import { MdAddShoppingCart } from 'react-icons/md';
import { FaSearch } from 'react-icons/fa';
import { FaRegUser } from 'react-icons/fa6';
import { IoMenu } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { CartContext } from './CartContext';
import './Navbar.css';

function Navbar({ products = [], setFilteredProduct = () => {}, setCurrentPage = () => {} }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const { totalItems } = useContext(CartContext);

  const menuItems = ['Categories', 'Deals', "What's New", 'Delivery'];

  const handleFilter = (type) => {
    let filtered = [];

    if (type === 'Deals') {
      filtered = [...products]
        .filter((item) => item.discountPercentage > 10)
        .sort((a, b) => b.discountPercentage - a.discountPercentage)
        .slice(0, 10);
    } else if (type === "What's New") {
      filtered = products.slice(0, 10);
    } else if (type === 'Delivery') {
      filtered = products.filter((item) => item.stock > 0);
    } else {
      filtered = products;
    }

    setFilteredProduct(filtered);
    setCurrentPage(1);
    setMenuOpen(false);
  };

  const handleSearch = (value) => {
    setSearch(value);

    if (value === '') {
      setFilteredProduct(products);
      setCurrentPage(1);
      return;
    }

    const filtered = products.filter((item) =>
      item.title.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredProduct(filtered);
    setCurrentPage(1);
  };

  return (
    <header className="navbar">
      <Link to="/" className="navbar__brand">
        <span className="navbar__brand-icon">
          <MdAddShoppingCart />
        </span>
        <div>
          <h1>Shopcart</h1>
          <p>Smart daily shopping</p>
        </div>
      </Link>

      <nav className="navbar__menu">
        {menuItems.map((item) => (
          <button
            key={item}
            type="button"
            className="navbar__menu-item"
            onClick={() => handleFilter(item)}
          >
            {item}
          </button>
        ))}
      </nav>

      <div className="navbar__search">
        <FaSearch className="navbar__search-icon" />
        <input
          type="text"
          placeholder="Search products"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch(search);
            }
          }}
        />
      </div>

      <div className="navbar__actions">
        <button type="button" className="navbar__account">
          <FaRegUser />
          <span>Account</span>
        </button>

        <Link to="/cart" className="navbar__cart">
          <span className="navbar__cart-icon">
            <MdAddShoppingCart />
            {totalItems > 0 && <span className="navbar__cart-badge">{totalItems}</span>}
          </span>
          <span>Cart</span>
        </Link>

        <button
          type="button"
          className="navbar__toggle"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Open menu"
        >
          <IoMenu />
        </button>
      </div>

      {menuOpen && (
        <div className="navbar__mobile-menu">
          {menuItems.map((item) => (
            <button
              key={item}
              type="button"
              className="navbar__mobile-item"
              onClick={() => handleFilter(item)}
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}

export default Navbar;
