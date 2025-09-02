"use client"

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';
import { StyleFilter, TransformerState } from './types';
import { styleFilters } from './filters-data';
import { FilterIconList } from './filter-icon';

interface FilterIconsContainerProps {
  onFilterSelect?: (filter: StyleFilter) => void;
  onSnapComplete?: (filter: StyleFilter) => void;
  selectedFilter?: StyleFilter | null;
  state: TransformerState;
  className?: string;
}

/**
 * Style filter icons container component
 * Displays the bottom filter icons area
 */
export function FilterIconsContainer({
  onFilterSelect,
  onSnapComplete,
  selectedFilter,
  state,
  className
}: FilterIconsContainerProps) {
  const shouldShowHint = state === 'readyToTransform';

  return (
    <div className={cn('w-full', className)}>
      <AnimatePresence>
        {shouldShowHint && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="text-center text-sm text-gray-500 mb-4"
          >
            Drag a filter to the text box to apply style transformation
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="px-8 py-10 rounded-xl bg-white/5 backdrop-blur-sm overflow-visible"
      >
        <div className="max-w-[800px] w-full mx-auto">
          <FilterIconList
            filters={styleFilters}
            selectedFilter={selectedFilter}
            onSelectFilter={onFilterSelect}
            onSnapComplete={onSnapComplete}
          />
        </div>
      </motion.div>
    </div>
  );
}