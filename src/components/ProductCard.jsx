import { Link } from 'react-router-dom';
import { memo, useMemo } from 'react';

const productName = (product) => product.name || product.title || 'Product';
const productImage = (product) => product.imageUrl || product.thumbnail || product.image || '';

function ProductCard({ product }) {
  const name = useMemo(() => productName(product), [product]);
  const image = useMemo(() => productImage(product), [product]);
  const price = useMemo(() => Number(product.price || 0).toFixed(2), [product.price]);
  const stock = Number(product.stock || 0);

  return (
    <article className="group overflow-hidden rounded-lg border border-border bg-white shadow-sm interactive-lift">
      <Link to={`/products/${product.id}`} className="block h-full">
        <div className="aspect-square overflow-hidden bg-surface">
          {image ? (
            <img
              src={image}
              alt={name}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
              loading="lazy"
              decoding="async"
              sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted">No image</div>
          )}
        </div>
        <div className="grid gap-3 p-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted">{product.category || 'Product'}</p>
            <h2 className="mt-1 line-clamp-2 min-h-12 text-base font-semibold text-gray-950">{name}</h2>
          </div>
          <div className="flex items-center justify-between gap-3">
            <p className="text-lg font-semibold text-gray-950">Rs. {price}</p>
            <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${stock > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {stock > 0 ? `${stock} left` : 'Out'}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

export default memo(ProductCard);

