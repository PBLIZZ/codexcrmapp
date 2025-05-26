"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface CollapsibleProps {
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
  children: React.ReactNode
}

// Simple collapsible component
export function Collapsible({
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
  className,
  children,
}: CollapsibleProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  
  const isOpen = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen
  const handleOpenChange = (open: boolean) => {
    if (onOpenChange) onOpenChange(open)
    setUncontrolledOpen(open)
  }
  
  return (
    <div className={cn("w-full", className)}>
      {React.Children.map(children, child => {
        if (!React.isValidElement(child)) return child
        
        // Pass isOpen and handleOpenChange to CollapsibleTrigger and CollapsibleContent
        return React.cloneElement(child as React.ReactElement<any>, {
          isOpen,
          handleToggle: handleOpenChange,
        })
      })}
    </div>
  )
}

interface CollapsibleTriggerProps {
  isOpen?: boolean
  handleToggle?: (open: boolean) => void
  asChild?: boolean
  className?: string
  children: React.ReactNode
}

export function CollapsibleTrigger({
  isOpen,
  handleToggle,
  asChild,
  className,
  children,
  ...props
}: CollapsibleTriggerProps & React.HTMLAttributes<HTMLDivElement>) {
  const handleClick = () => {
    if (handleToggle) handleToggle(!isOpen)
  }
  
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      ...props,
      onClick: (e: React.MouseEvent) => {
        handleClick()
        // Call the original onClick if it exists
        const originalOnClick = (children as any).props?.onClick
        if (typeof originalOnClick === 'function') {
          originalOnClick(e)
        }
      },
    })
  }
  
  return (
    <div 
      className={cn("cursor-pointer", className)} 
      onClick={handleClick}
      {...props}
    >
      {children}
    </div>
  )
}

interface CollapsibleContentProps {
  isOpen?: boolean
  className?: string
  children: React.ReactNode
}

export function CollapsibleContent({
  isOpen,
  handleToggle,  // We receive this prop but don't use it or pass it to DOM
  className,
  children,
  ...props
}: CollapsibleContentProps & React.HTMLAttributes<HTMLDivElement> & { handleToggle?: any }) {
  // Extract handleToggle from props to prevent it from being passed to the DOM element
  const domProps = { ...props };
  delete (domProps as any).onOpenChange;  // Ensure onOpenChange doesn't get passed to DOM
  
  return (
    <div
      className={cn(
        "overflow-hidden transition-all duration-300",
        isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
        className
      )}
      {...domProps}
    >
      {children}
    </div>
  )
}
