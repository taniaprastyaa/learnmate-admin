"use client"

import { useEffect, useState } from "react"
import { supabaseClient } from "@/utils/supabase";
import type { User } from "@supabase/supabase-js"

export function useSupabaseUser() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const supabase = supabaseClient;

    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }

    getUser()
  }, [])

  return user
}
