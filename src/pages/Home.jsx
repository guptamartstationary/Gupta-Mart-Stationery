import { useMemo } from 'react';
import useCurrentUser from '../hooks/useCurrentUser.js';
import { Link } from 'react-router-dom';
import useProducts from '../hooks/useProducts.js';
import useCategories from '../hooks/useCategories.js';
import { useCartStore } from '../store/cartStore.js';
import HeroSlider from '../components/HeroSlider.jsx';
import ProductCard from '../components/ProductCard.jsx';
import CategoryCard from '../components/CategoryCard.jsx';
import { ProductCardSkeleton, CategorySkeleton } from '../components/Skeletons.jsx';

const Home = () => {
  // ✅ FIX: user + loading lo
  const { user, loading: userLoading } = useCurrentUser();

  // ✅ FIX: pass user
  const { products, loading } = useProducts(user, userLoading);
  const { categories, loading: categoryLoading } = useCategories(user, userLoading);

  const addToCart = useCartStore((state) => state.addToCart);

  const trending = useMemo(() => products.slice(0, 6), [products]);
  const newArrivals = useMemo(() => [...products].slice(-6).reverse(), [products]);
  const discounts = useMemo(
    () => products.filter((item) => Number(item.discount) > 0).slice(0, 6),
    [products]
  );

  return (
    <div className="min-h-screen bg-white pb-20 dark:bg-slate-950">
      <HeroSlider />

      {/* Categories */}
      <section className="container-fixed mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Categories</h2>
          <Link to="/category/all">View All</Link>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {categoryLoading
            ? [...Array(6)].map((_, i) => <CategorySkeleton key={i} />)
            : categories.map((c) => <CategoryCard key={c.id} category={c} />)}
        </div>
      </section>

      {/* Products */}
      <section className="container-fixed mt-12">
        <h2 className="text-xl font-semibold">Trending</h2>

        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {loading
            ? [...Array(6)].map((_, i) => <ProductCardSkeleton key={i} />)
            : trending.map((p) => (
                <ProductCard key={p.id} product={p} onAdd={addToCart} />
              ))}
        </div>
      </section>
    </div>
  );
};

export default Home;