import { useCallback, useEffect, useState } from 'react';
import { categoryApi } from '../lib/shopApi.js';

const useCategories = (user, userLoading) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    // ⛔ wait for auth
    if (userLoading) return;

    // ⛔ user nahi hai → clear data
    if (!user) {
      setCategories([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const data = await categoryApi.getAll();
      setCategories(data || []);
    } catch (err) {
      console.log("CATEGORY ERROR:", err);
      setCategories([]);
    }

    setLoading(false);
  }, [user, userLoading]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { categories, loading, refresh };
};

export default useCategories;