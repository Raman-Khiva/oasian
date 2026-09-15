"use client"

import { useEffect, useRef } from "react"
import { useUser } from "@clerk/nextjs"

export function UserSync() {
  const { isSignedIn, user } = useUser()
  const syncedRef = useRef<string | null>(null)

  useEffect(() => {
    if (isSignedIn && user && syncedRef.current !== user.id) {
      syncedRef.current = user.id
      fetch("/api/user/sync", { method: "POST" })
        .then((res) => res.json())
        .then((data) => {
          if (data.authenticated) {
            console.log("⚡ [Oasian] User successfully synchronized with Neon Database")
          }
        })
        .catch((err) => {
          console.warn("[UserSync] Sync warning:", err)
        })
    }
  }, [isSignedIn, user])

  return null
}
