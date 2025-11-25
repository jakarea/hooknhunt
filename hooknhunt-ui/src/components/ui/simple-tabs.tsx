"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SimpleTabsProps {
  defaultValue: string
  children: React.ReactNode
  className?: string
}

interface SimpleTabsListProps {
  children: React.ReactNode
  className?: string
}

interface SimpleTabsTriggerProps {
  value: string
  children: React.ReactNode
  className?: string
  isActive?: boolean
  onClick?: () => void
}

interface SimpleTabsContentProps {
  value: string
  children: React.ReactNode
  className?: string
}

const SimpleTabsContext = React.createContext<{
  activeTab: string
  setActiveTab: (value: string) => void
}>({
  activeTab: "",
  setActiveTab: () => {}
})

export const SimpleTabs: React.FC<SimpleTabsProps> = ({
  defaultValue,
  children,
  className
}) => {
  const [activeTab, setActiveTab] = React.useState(defaultValue)

  return (
    <SimpleTabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={cn("w-full", className)}>
        {children}
      </div>
    </SimpleTabsContext.Provider>
  )
}

export const SimpleTabsList: React.FC<SimpleTabsListProps> = ({
  children,
  className
}) => {
  return (
    <div className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className
    )}>
      {children}
    </div>
  )
}

export const SimpleTabsTrigger: React.FC<SimpleTabsTriggerProps> = ({
  value,
  children,
  className,
  onClick
}) => {
  const { activeTab, setActiveTab } = React.useContext(SimpleTabsContext)

  const isActive = activeTab === value

  const handleClick = () => {
    setActiveTab(value)
    onClick?.()
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        isActive
          ? "bg-background text-foreground shadow-sm border-2 border-primary"
          : "border-2 border-transparent hover:bg-background hover:text-foreground",
        className
      )}
    >
      {children}
    </button>
  )
}

export const SimpleTabsContent: React.FC<SimpleTabsContentProps> = ({
  value,
  children,
  className
}) => {
  const { activeTab } = React.useContext(SimpleTabsContext)

  if (activeTab !== value) {
    return null
  }

  return (
    <div className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}>
      {children}
    </div>
  )
}