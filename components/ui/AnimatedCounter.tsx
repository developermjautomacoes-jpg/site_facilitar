'use client'
import { useAnimatedCounter } from '@/hooks/useAnimatedCounter'

interface Props {
  value: number
  suffix?: string
  label: string
}

export function AnimatedCounter({ value, suffix = '', label }: Props) {
  const { count, ref } = useAnimatedCounter(value)
  return (
    <div className="text-center" ref={ref}>
      <div className="text-4xl font-bold text-blue-600" style={{ fontFamily: 'var(--font-outfit)' }}>
        {count}{suffix}
      </div>
      <div className="text-slate-500 text-sm mt-1">{label}</div>
    </div>
  )
}
