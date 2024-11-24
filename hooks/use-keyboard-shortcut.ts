import { useEffect, useCallback } from 'react'

type KeyHandler = (e: KeyboardEvent) => void
type KeyCombo = string

const parseKeyCombo = (combo: KeyCombo): { key: string; ctrl?: boolean; shift?: boolean; alt?: boolean } => {
  const parts = combo.toLowerCase().split('+')
  return {
    key: parts[parts.length - 1],
    ctrl: parts.includes('ctrl'),
    shift: parts.includes('shift'),
    alt: parts.includes('alt'),
  }
}

export const useKeyboardShortcut = (keyCombo: KeyCombo, handler: KeyHandler) => {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const { key, ctrl, shift, alt } = parseKeyCombo(keyCombo)
      
      const matchesKey = event.key.toLowerCase() === key
      const matchesCtrl = ctrl ? event.ctrlKey : !event.ctrlKey
      const matchesShift = shift ? event.shiftKey : !event.shiftKey
      const matchesAlt = alt ? event.altKey : !event.altKey

      if (matchesKey && matchesCtrl && matchesShift && matchesAlt) {
        handler(event)
      }
    },
    [keyCombo, handler]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
}
