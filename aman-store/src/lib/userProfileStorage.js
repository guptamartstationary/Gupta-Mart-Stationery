/** Saved delivery details for checkout (also mirrored to Supabase `profiles` when possible). */
export const USER_PROFILE_STORAGE_KEY = 'userProfile';

export const readStoredUserProfile = () => {
  try {
    const raw = localStorage.getItem(USER_PROFILE_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
};

export const writeStoredUserProfile = (payload) => {
  try {
    localStorage.setItem(USER_PROFILE_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // private mode / quota
  }
};

export const displayNameFromAuthUser = (user) => {
  if (!user) return '';
  const meta = user.user_metadata || {};
  const fromMeta = (meta.full_name || meta.name || meta.display_name || '').trim();
  if (fromMeta) return fromMeta;
  const email = String(user.email || '').trim();
  if (email) return email.split('@')[0] || email;
  return '';
};
