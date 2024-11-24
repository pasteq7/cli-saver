import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { AlertTriangle, Info } from "lucide-react"

const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>div]:pl-7",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        warning: "border-yellow-200 text-yellow-800 dark:border-yellow-700 dark:text-yellow-300 [&>svg]:text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants> & {
    icon?: "warning" | "info"
  }
>(({ className, variant, icon, children, ...props }, ref) => {
  const Icon = icon === "warning" ? AlertTriangle : Info
  return (
    <div
      ref={ref}
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      <Icon className="h-4 w-4" />
      <div>{children}</div>
    </div>
  )
})
Alert.displayName = "Alert"

export { Alert, alertVariants }
