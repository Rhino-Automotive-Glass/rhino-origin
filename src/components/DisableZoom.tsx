'use client'

import { useEffect } from 'react'

export function DisableZoom() {
  useEffect(() => {
    // Prevent keyboard zoom (Ctrl/Cmd + plus/minus/zero)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === '+' || e.key === '-' || e.key === '=' || e.key === '0')
      ) {
        e.preventDefault()
      }
    }

    // Prevent mouse wheel zoom (Ctrl/Cmd + scroll)
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('wheel', handleWheel)
    }
  }, [])

  return null
}
