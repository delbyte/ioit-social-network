"use client";

import { AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "./empty";

export function ErrorState({
  className,
  icon,
  title,
  description,
  action,
  error,
  onRetry,
  ...props
}: {
  className?: string;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  error?: Error | string;
  onRetry?: () => void;
} & React.HTMLAttributes<HTMLDivElement>) {
  // If error is provided, use it to populate title/description
  const errorTitle = title || (error ? "Something went wrong" : "Error");
  const errorDescription =
    description ||
    (error
      ? typeof error === "string"
        ? error
        : error.message || "An unexpected error occurred"
      : undefined);

  // Use custom action if provided, otherwise show retry button if onRetry is provided
  const errorAction =
    action ||
    (onRetry && (
      <Button onClick={onRetry} variant="outline" size="sm">
        <RefreshCcw />
        <span>Retry</span>
      </Button>
    ));

  return (
    <Empty className={cn("border-destructive/50 border border-dashed", className)} {...props}>
      <EmptyHeader>
        <EmptyMedia variant="icon" className="text-destructive bg-destructive/10">
          {icon || <AlertCircle />}
        </EmptyMedia>
        <EmptyTitle>{errorTitle}</EmptyTitle>
        {errorDescription && <EmptyDescription>{errorDescription}</EmptyDescription>}
      </EmptyHeader>
      {errorAction && <EmptyContent>{errorAction}</EmptyContent>}
    </Empty>
  );
}
