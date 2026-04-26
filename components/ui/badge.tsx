import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "h-5 gap-1 rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium transition-all has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&>svg]:size-3! inline-flex items-center justify-center w-fit whitespace-nowrap shrink-0 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-colors overflow-hidden group/badge",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        secondary: "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
        destructive:
          "bg-destructive/10 [a]:hover:bg-destructive/20 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 text-destructive dark:bg-destructive/20",
        warning:
          "text-amber-900 dark:text-amber-50 bg-amber-500/10 border-amber-500/20 dark:bg-amber-500/20 dark:border-amber-500/20",
        outline: "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        ghost: "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
        link: "text-primary underline-offset-4 hover:underline",

        // per color variants
        blue: "border-blue-700/40 bg-blue-50 text-blue-700 dark:border-blue-200/40 dark:bg-blue-950 dark:text-blue-100",
        green:
          "border-green-700/40 bg-green-50 text-green-700 dark:border-green-200/40 dark:bg-green-950 dark:text-green-100",
        yellow:
          "border-yellow-700/40 bg-yellow-50 text-yellow-700 dark:border-yellow-200/40 dark:bg-yellow-950 dark:text-yellow-100",
        red: "border-red-700/40 bg-red-50 text-red-700 dark:border-red-200/40 dark:bg-red-950 dark:text-red-100",
        purple:
          "border-purple-700/40 bg-purple-50 text-purple-700 dark:border-purple-200/40 dark:bg-purple-950 dark:text-purple-100",
        pink: "border-pink-700/40 bg-pink-50 text-pink-700 dark:border-pink-200/40 dark:bg-pink-950 dark:text-pink-100",
        orange:
          "border-orange-700/40 bg-orange-50 text-orange-700 dark:border-orange-200/40 dark:bg-orange-950 dark:text-orange-100",
        zinc: "border-zinc-700/40 bg-zinc-50 text-zinc-700 dark:border-zinc-200/40 dark:bg-zinc-950 dark:text-zinc-100",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>["variant"]>;

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">({ className: cn(badgeVariants({ className, variant })) }, props),
    render,
    state: { slot: "badge", variant },
  });
}

export { Badge, badgeVariants };
