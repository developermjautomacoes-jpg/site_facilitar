'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, X } from 'lucide-react'

interface ToastProps {
  message: string
  type: 'success' | 'error'
  onClose: () => void
}

export function Toast({ message, type, onClose }: ToastProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.9 }}
        className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl max-w-sm backdrop-blur-md ${
          type === 'success'
            ? 'bg-green-900/90 border border-green-500/30 text-green-100'
            : 'bg-red-900/90 border border-red-500/30 text-red-100'
        }`}
      >
        {type === 'success'
          ? <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
          : <XCircle className="w-5 h-5 text-red-400 shrink-0" />
        }
        <span className="text-sm">{message}</span>
        <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100">
          <X className="w-4 h-4" />
        </button>
      </motion.div>
    </AnimatePresence>
  )
}
