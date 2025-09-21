"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useLocalizedCategories } from "@/lib/use-localized-categories";
import { useTranslation } from "@/lib/use-translation";
import { StyleFilter, TransformerState } from "./types";
import { cn } from "@/utils/cn";

interface MobileFilterSheetProps {
  state: TransformerState;
  onFilterSelect: (filter: StyleFilter) => void;
}

/**
 * 移动端滤镜选择弹层
 * 替代拖拽交互，提供底部弹出的单列滤镜选择器
 */
export function MobileFilterSheet({ state, onFilterSelect }: MobileFilterSheetProps) {
  const categories = useLocalizedCategories();
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  // 初始化激活的分类
  useEffect(() => {
    if (categories.length === 0) {
      return;
    }

    setActiveCategoryId((prev) => {
      if (prev && categories.some((category) => category.id === prev)) {
        return prev;
      }
      return categories[0]?.id ?? null;
    });
  }, [categories]);

  // 禁止弹层打开时的页面滚动
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = "hidden";

    return () => {
      body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const activeCategory = useMemo(() => {
    if (!activeCategoryId) {
      return categories[0];
    }
    return categories.find((category) => category.id === activeCategoryId) ?? categories[0];
  }, [activeCategoryId, categories]);

  const handleOpen = () => {
    if (state === "transforming") {
      return;
    }
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleFilterClick = (filter: StyleFilter) => {
    onFilterSelect(filter);
    handleClose();
  };

  return (
    <div className="w-full">
      <Button
        type="button"
        variant="secondary"
        size="lg"
        className="w-full rounded-full bg-white/90 text-slate-700 shadow-sm hover:bg-white"
        onClick={handleOpen}
        disabled={state === "transforming"}
      >
        {t("openFilterSheet")}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col justify-end bg-slate-900/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="absolute inset-0" onClick={handleClose} />

            <motion.div
              className="relative z-10 flex h-[60vh] w-full flex-col rounded-t-3xl bg-white pt-4 shadow-xl"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 240, damping: 28 }}
            >
              <div className="flex items-center justify-between px-5">
                <span className="text-sm font-medium text-slate-900">
                  {t("filterSelectionTitle")}
                </span>
                <button
                  type="button"
                  onClick={handleClose}
                  aria-label={t("close")}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4 flex gap-2 overflow-x-auto px-5 pb-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setActiveCategoryId(category.id)}
                    className={cn(
                      "flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium",
                      activeCategory?.id === category.id
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300"
                    )}
                  >
                    <span>{category.emoji}</span>
                    <span className="whitespace-nowrap">{category.name}</span>
                  </button>
                ))}
              </div>

              <div className="mt-3 flex-1 overflow-y-auto px-5 pb-6">
                <div className="flex flex-col gap-3">
                  {activeCategory?.filters?.map((filter) => (
                    <button
                      key={filter.id}
                      type="button"
                      onClick={() => handleFilterClick(filter)}
                      className="flex w-full items-center gap-4 rounded-2xl border border-slate-200 bg-white px-3 py-3 text-left shadow-sm hover:border-slate-300 active:bg-slate-50"
                    >
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-50">
                        <Image
                          src={filter.icon}
                          alt={filter.name}
                          width={48}
                          height={48}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      </div>
                      <div className="flex min-w-0 flex-1 items-center">
                        <span className="text-sm font-medium text-slate-700">
                          {filter.name}
                        </span>
                      </div>
                    </button>
                  ))}

                  {(!activeCategory || !activeCategory.filters?.length) && (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-4 py-6 text-center text-sm text-slate-500">
                      {t('unsupportedStyle')}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
