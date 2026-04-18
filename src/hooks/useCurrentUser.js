const initializeAuth = async () => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    let activeSession = sessionData?.session || null;

    if (activeSession) {
      await applySessionState(activeSession);
      clearTimeout(loadingTimeoutId);
      return;
    }

    if (typeof window !== "undefined") {
      const authCode = new URLSearchParams(window.location.search).get("code");
      if (authCode) {
        const { data: exchangeData } = await supabase.auth.exchangeCodeForSession(authCode);
        activeSession = exchangeData?.session || null;
      }
    }

    await applySessionState(activeSession);
  } catch {
    if (!isActive) return;
    setSession(null);
    setUser(null);
    setProfile(null);
    setLoading(false);
  } finally {
    clearTimeout(loadingTimeoutId);
  }
};