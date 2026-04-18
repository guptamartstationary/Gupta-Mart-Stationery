const applySessionState = async (nextSession) => {
  if (!isActive) return;

  const currentUser = nextSession?.user || null;

  setSession(nextSession || null);

  // ✅ STEP A: user turant set karo
  if (currentUser) {
    const email = currentUser.email || '';
    const isAdmin = email === 'guptamartstationary911@gmail.com';

    setUser({
      ...currentUser,
      role: isAdmin ? 'admin' : 'user',
      isAdmin
    });
  } else {
    setUser(null);
  }

  setLoading(false); // ✅ yahi pe loading false

  // ✅ STEP B: profile baad me load karo (non-blocking)
  if (currentUser) {
    try {
      const profileData = await getProfile(currentUser.id);

      if (!isActive) return;

      const isAdmin =
        profileData?.role === 'admin' ||
        currentUser.email === 'guptamartstationary911@gmail.com';

      setProfile(profileData);

      setUser(prev => ({
        ...prev,
        role: isAdmin ? 'admin' : (profileData?.role || 'user'),
        isAdmin
      }));
    } catch {
      // ignore
    }
  }
};