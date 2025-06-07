
import * as React from "react"
import { X } from "lucide-react"

interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
  action?: React.ReactNode
  onDismiss?: () => void
}

export function Toast({
  title,
  description,
  action,
  onDismiss,
  ...props
}: ToastProps) {
  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex w-full max-w-sm items-center space-x-4 rounded-lg bg-white p-6 shadow-lg border border-gray-200"
      role="alert"
      aria-live="polite"
      {...props}
    >
      <div className="flex-1 space-y-1">
        {title && <div className="font-medium text-gray-900">{title}</div>}
        {description && <div className="text-sm text-gray-600">{description}</div>}
      </div>
      {action}
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="inline-flex shrink-0 items-center justify-center rounded-md p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Dismiss notification"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}

export function Toaster() {
  const [toasts, setToasts] = React.useState<
    Array<{
      id: string
      title?: string
      description?: string
      action?: React.ReactNode
    }>
  >([])

  return (
    <>
      {toasts.map(({ id, ...props }) => (
        <Toast
          key={id}
          {...props}
          onDismiss={() => {
            setToasts((toasts) => toasts.filter((toast) => toast.id !== id))
          }}
        />
      ))}
    </>
  )
}
