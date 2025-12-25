"use client"

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"

interface ToasterProps {
  forceDefaultPosition?: boolean  // Option to use default (right bottom corner) instead of bottom center
}

export function Toaster({ forceDefaultPosition = false }: ToasterProps = {}) {
  const { toasts } = useToast()

  // Always use bottom center positioning unless explicitly forced to default
  const shouldUseBottomCenter = !forceDefaultPosition

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport
        className={shouldUseBottomCenter
          ? "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:left-1/2 sm:top-auto sm:flex-col sm:-translate-x-1/2 md:max-w-[420px]"
          : undefined
        }
      />
    </ToastProvider>
  )
}
