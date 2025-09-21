"use client";

import React from "react";
import { motion } from "motion/react";

export function Loading() {
  return (
    <div className="w-full text-left">
      <div className="flex items-center space-x-1 p-2">
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
        >
          *
        </motion.span>
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
        >
          *
        </motion.span>
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
        >
          *
        </motion.span>
      </div>
    </div>
  );
}
