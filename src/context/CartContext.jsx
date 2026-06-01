import { createContext, useCallback, useMemo, useState } from 'react';
import {
  addToCart as addToCartRequest,
  getCart,
  removeCartItem,
  updateCartItem,
} from '../api/cartService';

export const CartContext = createContext(null);

const normalizeCartItems = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.cartItems)) return payload.cartItems;
  return [];
};

const getCartItemId = (item) => item.cartItemId || item.cartId || item.id;

const getProductId = (item) => item.productId || item.product?.id;

const isSameProduct = (item, productId) => String(getProductId(item)) === String(productId);

const normalizeSavedCartItem = (savedItem, fallbackItem) => ({
  ...fallbackItem,
  ...savedItem,
  cartItemId: savedItem?.cartItemId || savedItem?.cartId || savedItem?.id || fallbackItem.cartItemId,
});

const apiMessage = (err) => err.detail?.message ?? err.response?.data?.message ?? err.message ?? 'Something went wrong';

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchCart = useCallback(async (userId) => {
    if (!userId) return;

    setLoading(true);
    setError('');

    try {
      const response = await getCart(userId);
      setCartItems(normalizeCartItems(response.data));
    } catch (err) {
      setError(apiMessage(err));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const addItem = useCallback(async (userId, productId, quantity = 1, product = null) => {
    if (!userId || !productId) return;

    const tempId = `temp-${productId}-${Date.now()}`;
    let optimisticItem = {
      id: tempId,
      cartItemId: tempId,
      productId,
      quantity,
      product,
      title: product?.title,
      price: product?.price,
      thumbnail: product?.thumbnail,
    };
    let previousItems = [];
    let existingCartItemId = null;

    setCartItems((items) => {
      previousItems = items;
      const existingItem = items.find((item) => isSameProduct(item, productId));

      if (existingItem) {
        existingCartItemId = getCartItemId(existingItem);
        optimisticItem = {
          ...existingItem,
          quantity: Number(existingItem.quantity || 0) + Number(quantity || 0),
          product: existingItem.product || product,
        };

        return items.map((item) =>
          isSameProduct(item, productId) ? optimisticItem : item
        );
      }

      return [...items, optimisticItem];
    });

    try {
      const response = await addToCartRequest({ userId, productId, quantity });
      const savedItem = response.data?.item || response.data;

      if (savedItem) {
        setCartItems((items) =>
          items.map((item) => {
            const itemId = getCartItemId(item);
            const shouldReplace = existingCartItemId
              ? itemId === existingCartItemId
              : itemId === tempId;

            return shouldReplace ? normalizeSavedCartItem(savedItem, optimisticItem) : item;
          })
        );
      }
    } catch (err) {
      setCartItems(previousItems);
      setError(apiMessage(err));
      throw err;
    }
  }, []);

  const updateItem = useCallback(async (cartItemId, quantity) => {
    const previousItems = cartItems;

    setCartItems((items) =>
      items.map((item) =>
        getCartItemId(item) === cartItemId ? { ...item, quantity } : item
      )
    );

    try {
      await updateCartItem(cartItemId, { quantity });
    } catch (err) {
      setCartItems(previousItems);
      setError(apiMessage(err));
      throw err;
    }
  }, [cartItems]);

  const removeItem = useCallback(async (cartItemId) => {
    const previousItems = cartItems;

    setCartItems((items) => items.filter((item) => getCartItemId(item) !== cartItemId));

    try {
      await removeCartItem(cartItemId);
    } catch (err) {
      setCartItems(previousItems);
      setError(apiMessage(err));
      throw err;
    }
  }, [cartItems]);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + Number(item.quantity || 0), 0),
    [cartItems]
  );

  const cartTotal = useMemo(
    () =>
      cartItems.reduce((sum, item) => {
        const product = item.product || item;
        return sum + Number(product.price || item.price || 0) * Number(item.quantity || 0);
      }, 0),
    [cartItems]
  );

  const value = useMemo(
    () => ({
      cartItems,
      cart: cartItems,
      cartCount,
      totalItems: cartCount,
      cartTotal,
      loading,
      error,
      fetchCart,
      addItem,
      updateItem,
      removeItem,
      clearCart,
    }),
    [
      addItem,
      cartCount,
      cartItems,
      cartTotal,
      clearCart,
      error,
      fetchCart,
      loading,
      removeItem,
      updateItem,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

