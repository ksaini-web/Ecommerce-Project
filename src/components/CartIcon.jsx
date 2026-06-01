import { MdAddShoppingCart } from 'react-icons/md';
import useCart from '../hooks/useCart';

function CartIcon() {
  const { cartCount } = useCart();

  return (
    <span className="relative inline-flex items-center">
      <MdAddShoppingCart className="text-xl" />
      {cartCount > 0 && (
        <span className="absolute -right-2 -top-2 min-w-5 rounded-full bg-secondary px-1.5 text-center text-[11px] font-medium leading-5 text-white">
          {cartCount}
        </span>
      )}
    </span>
  );
}

export default CartIcon;

