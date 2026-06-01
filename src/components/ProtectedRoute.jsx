import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const hasStoredAuth = (key) => {
  if (key === 'user_auth' && localStorage.getItem('token')) return true;
  if (key === 'seller_auth' && localStorage.getItem('sellerToken')) return true;

  try {
    return Boolean(JSON.parse(localStorage.getItem(key) || 'null')?.token);
  } catch {
    localStorage.removeItem(key);
    return false;
  }
};

function ProtectedRoute({ role, children }) {
  const { isUserLoggedIn, isSellerLoggedIn } = useAuth();
  const navigate = useNavigate();
  const blockedUser = role === 'user' && !isUserLoggedIn && !hasStoredAuth('user_auth');
  const blockedSeller = role === 'seller' && !isSellerLoggedIn && !hasStoredAuth('seller_auth');
  const wrongUserArea = role === 'user' && isSellerLoggedIn;
  const wrongSellerArea = role === 'seller' && isUserLoggedIn;

  useEffect(() => {
    if (wrongUserArea) navigate('/seller/dashboard', { replace: true });
    if (wrongSellerArea) navigate('/', { replace: true });
    if (blockedUser) navigate('/login', { replace: true });
    if (blockedSeller) navigate('/seller/login', { replace: true });
  }, [blockedSeller, blockedUser, navigate, wrongSellerArea, wrongUserArea]);

  if (blockedUser || blockedSeller || wrongUserArea || wrongSellerArea) return null;
  return children;
}

export default ProtectedRoute;
