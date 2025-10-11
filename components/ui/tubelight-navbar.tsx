"use client"

import * as React from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  name: string
  url?: string
  value?: string
  emoji?: string
  icon?: LucideIcon | React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>
}

type NavBarSize = "sm" | "md" | "lg"

interface NavBarProps {
  items: NavItem[]
  className?: string
  innerClassName?: string
  floating?: boolean
  size?: NavBarSize
  defaultValue?: string
  value?: string
  onValueChange?: (value: string, item: NavItem) => void
}

export function NavBar({
  items,
  className,
  innerClassName,
  floating = true,
  size = "md",
  defaultValue,
  value,
  onValueChange,
}: NavBarProps) {
  const fallbackValue = React.useMemo(() => {
    if (!items.length) return ""
    return defaultValue ?? items[0]?.value ?? items[0]?.name ?? ""
  }, [defaultValue, items])

  const [internalValue, setInternalValue] = React.useState(() => value ?? fallbackValue)

  React.useEffect(() => {
    if (value !== undefined) return
    const availableValues = items.map((item) => item.value ?? item.name)
    if (!availableValues.includes(internalValue)) {
      setInternalValue(fallbackValue)
    }
  }, [items, fallbackValue, value, internalValue])

  const activeValue = value ?? internalValue

  if (!items.length) return null

const sizeClasses: Record<NavBarSize, string> = {
  sm: "px-5 py-1.75",
  md: "px-7 py-2.25",
  lg: "px-8 py-2.75",
}

const itemSizeClasses: Record<NavBarSize, string> = {
  sm: "px-3 py-1.5",
  md: "px-4 py-2",
  lg: "px-5 py-3",
}

const emojiSizeClasses: Record<NavBarSize, string> = {
  sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
  }

  const labelSizeClasses: Record<NavBarSize, string> = {
    sm: "text-[11px]",
    md: "text-xs",
    lg: "text-sm",
  }

  const wrapperClassName = cn(
    floating
      ? "fixed bottom-0 sm:top-0 left-1/2 -translate-x-1/2 z-50 mb-6 sm:pt-6"
      : "relative flex w-full justify-center",
    className
  )

  const nonFloatingBase = "inline-flex max-w-full items-center rounded-full border border-slate-200/70 bg-white/85 shadow-[0_12px_38px_rgba(15,23,42,0.12)] supports-[backdrop-filter]:backdrop-blur"
  const floatingBase = "flex items-center rounded-full border border-border bg-background/5 shadow-lg supports-[backdrop-filter]:backdrop-blur"

  const barClassName = cn(
    floating ? floatingBase : nonFloatingBase,
    sizeClasses[size],
    !floating && "w-full max-w-[700px] justify-between",
    innerClassName
  )

  const handleSelect = (event: React.MouseEvent<HTMLAnchorElement>, item: NavItem) => {
    const itemValue = item.value ?? item.name
    if (!item.url || item.url === "#") {
      event.preventDefault()
    }

    if (value === undefined) {
      setInternalValue(itemValue)
    }

    if (onValueChange) {
      onValueChange(itemValue, item)
    }
  }

  const renderedItems = items.map((item) => {
    const Icon = item.icon
    const itemValue = item.value ?? item.name
    const isActive = activeValue === itemValue

    return (
      <Link
        key={itemValue}
        href={item.url ?? "#"}
        onClick={(event) => handleSelect(event, item)}
        className={cn(
          "relative flex basis-0 cursor-pointer flex-col items-center rounded-full transition-colors no-underline flex-1",
          itemSizeClasses[size],
          "text-foreground/80 hover:text-primary",
          isActive && "bg-muted text-primary"
        )}
      >
        <span className="flex min-w-[80px] max-w-[110px] flex-col items-center gap-2 leading-tight text-center">
          {item.emoji ? (
            <span className={cn("leading-none", emojiSizeClasses[size])} aria-hidden="true">
              {item.emoji}
            </span>
          ) : Icon ? (
            <Icon size={24} strokeWidth={2.5} className="leading-none" />
          ) : null}
          <span className={cn("font-medium tracking-tight", labelSizeClasses[size])}>{item.name}</span>
        </span>
        {isActive && (
          <motion.div
            layoutId="lamp"
            className="absolute inset-0 w-full bg-primary/5 rounded-full -z-10"
            initial={false}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
          >
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-t-full">
              <div className="absolute w-12 h-6 bg-primary/20 rounded-full blur-md -top-2 -left-2" />
              <div className="absolute w-8 h-6 bg-primary/20 rounded-full blur-md -top-1" />
              <div className="absolute w-4 h-4 bg-primary/20 rounded-full blur-sm top-0 left-2" />
            </div>
          </motion.div>
        )}
      </Link>
    )
  })

  return (
    <div className={wrapperClassName}>
      <div className={barClassName}>{renderedItems}</div>
    </div>
  )
}
