import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import styles from './scroll-area.module.css'

type TProps = {
  children: ReactNode
  className?: string
  maxHeight?: number | string
  fadeSize?: number
  style?: CSSProperties
}

export function ScrollArea({ children, className, maxHeight, fadeSize = 40, style }: TProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [masked, setMasked] = useState<boolean>(false)

  function updateMask() {
    const el = ref.current
    if (!el) return
    const overflowed = el.scrollHeight - el.clientHeight > 1
    const atBottom = Math.ceil(el.scrollTop + el.clientHeight) >= el.scrollHeight
    setMasked(overflowed && !atBottom)
  }

  function handleScroll() {
    updateMask()
  }

  useEffect(function onMount() {
    updateMask()
  }, [])

  useEffect(function onChildrenChange() {
    updateMask()
  }, [children])

  const inlineStyle: CSSProperties = { ...style };
  (inlineStyle as any)['--sa-fade'] = `${fadeSize}px`
  if (typeof maxHeight !== 'undefined') {
    (inlineStyle as any)['--sa-max-h'] =
      typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight
  }

  let cls = styles.root + ' ' + (masked ? styles.mask : styles.maskOff)
  if (className) cls += ' ' + className

  return (
    <div ref={ref} className={cls} style={inlineStyle} onScroll={handleScroll}>
      {children}
    </div>
  )
}
