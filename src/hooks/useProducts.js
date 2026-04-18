import { useCallback, useEffect, useState } from 'react';
import { productApi } from '../lib/shopApi.js';

const useProducts = (user, userLoading) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    // ⛔ wait for auth
    if (userLoading) return;

    // ⛔ user nahi hai → clear state
    if (!user) {
      setProducts([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');

      const data = await productApi.getAll();

      setProducts(data || []);
    } catch (err) {
      console.log("PRODUCT ERROR:", err);
      setError(err?.message || 'Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [user, userLoading]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { products, loading, error, refresh };
};

export default useProducts;