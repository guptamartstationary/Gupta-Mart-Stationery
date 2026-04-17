import { supabase } from './supabase';
import {
  createId, readLocal, writeLocal, safeSupabase,
  PRODUCT_KEY, CATEGORY_KEY, BANNER_KEY, ORDER_KEY, USER_KEY,
  defaultCategories, defaultBanners, fallbackProducts,
  userProfilesCache, userProfilesPromiseCache, buildSupabaseProductRow
} from './utils.js';

// ---------------- NORMALIZERS ----------------
const normalizeProduct = (item = {}) => ({
  id: item.id,
  name: item.name,
  size: item.pack_size || item.size || '',
  price: Number(item.original_price || item.final_price || item.price) || 0,
  discount: Number(item.discount_percent || item.discount) || 0,
  image: item.image_url || item.image || '',
  category: item.category || item.tag || 'General',
  stock: Number(item.stock) || 0,
  unit: item.unit || 'kg',
});

const normalizeCategory = (item = {}) => ({
  id: item.id || createId(),
  name: item.name || 'Category',
  image: item.image || item.image_url || '',
});

const normalizeBanner = (item = {}) => ({
  id: item.id || createId(),
  title: item.title || 'Banner',
  image: item.image || '',
  link: item.link || '/',
});

const normalizeOrder = (item = {}) => ({
  id: item.id || createId(),
  status: item.status || 'pending',
  items: item.items || item.products || [],
  total_price: Number(item.total_price || 0),
  user_email: item.user_email || '',
  created_at: item.created_at || new Date().toISOString(),
});

// ---------------- IMAGE UPLOAD ----------------
const fileToDataUrl = (file) =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result || '');
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });

export const uploadImage = async (file, bucket = 'product-images') => {
  if (!file) return '';
  if (!supabase) return fileToDataUrl(file);

  const ext = file.name?.split('.').pop() || 'png';
  const path = `${createId()}.${ext}`;

  const { error } = await supabase.storage.from(bucket).upload(path, file);

  if (!error) {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data?.publicUrl || '';
  }

  return fileToDataUrl(file);
};

// ---------------- PRODUCT API ----------------
export const productApi = {
  getAll: async () => {
    const { data } = await safeSupabase(() =>
      supabase.from('products').select('*')
    );
    return data?.map(normalizeProduct) || [];
  },
};

// ---------------- CATEGORY API ----------------
export const categoryApi = {
  getAll: async () => {
    const { data } = await safeSupabase(() =>
      supabase.from('categories').select('*')
    );
    return data?.map(normalizeCategory) || defaultCategories;
  },
};

// ---------------- BANNER API ----------------
export const bannerApi = {
  getAll: async () => {
    const { data } = await safeSupabase(() =>
      supabase.from('banners').select('*')
    );
    return data?.map(normalizeBanner) || defaultBanners;
  },
};

// ---------------- ORDERS API ----------------
export const ordersApi = {
  getAll: async () => {
    const { data } = await safeSupabase(() =>
      supabase.from('orders').select('*')
    );
    return data?.map(normalizeOrder) || [];
  },
};

// ---------------- SETTINGS API ----------------
export const settingsApi = {
  getAppLogo: async () => {
    const { data } = await safeSupabase(() =>
      supabase.from('settings').select('app_logo').maybeSingle()
    );
    return data?.app_logo || '/Applogo.png';
  },
};

// ---------------- USERS API ----------------
export const usersApi = {
  getByEmail: async (email) => {
    if (!email) return null;

    const { data } = await safeSupabase(() =>
      supabase.from('profiles').select('*').eq('email', email).single()
    );

    return data || null;
  },
};
