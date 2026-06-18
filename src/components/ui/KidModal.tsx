'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';

interface KidModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export default function KidModal({ open, onClose, title, children }: KidModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.75, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.75, y: 50 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            className="fixed inset-x-4 top-[15%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-[480px] z-50
              bg-white rounded-[2rem] border-[5px] border-[#ff9a72] p-6"
            style={{ boxShadow: '0 8px 0 rgba(255,154,114,0.3), 0 16px 30px rgba(0,0,0,0.18)' }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl md:text-2xl font-bold text-[#4a6a7d]">{title}</h2>
              <motion.button
                type="button"
                onClick={onClose}
                className="w-11 h-11 rounded-full text-white font-bold text-lg"
                style={{ background: '#ff4d8b', boxShadow: '0 5px 0 #d52f67' }}
                whileHover={{ scale: 1.12, rotate: 90 }}
                whileTap={{ scale: 0.9, y: 3 }}
                aria-label="Đóng"
              >
                ✕
              </motion.button>
            </div>
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
