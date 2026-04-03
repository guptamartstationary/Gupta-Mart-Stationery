import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { getProfile } from "../lib/auth"

const useCurrentUser = () => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      
      const currentUser = data?.user || null
      setUser(currentUser)
      
      if (currentUser?.id) {
        const prof = await getProfile(currentUser.id)
        setProfile(prof)
      } else {
        setProfile(null)
      }
      
      setLoading(false)
    }

    getUser()

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const currentUser = session?.user || null
        setUser(currentUser)
        
        if (currentUser?.id) {
          const prof = await getProfile(currentUser.id)
          setProfile(prof)
        } else {
          setProfile(null)
        }
      }
    )

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  return { user, profile, loading }
}

export default useCurrentUser;

