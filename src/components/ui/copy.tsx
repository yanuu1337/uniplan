"use client";

import * as React from "react";
import { Copy as CopyIcon, Check } from "lucide-react";
import { Input } from "./input";
import { Button } from "./button";
import { cn } from "#/lib/utils";

export interface CopyProps {
  value: string;
  disabled?: boolean;
  disabledMessage?: string;
  className?: string;
  inputClassName?: string;
}

export function Copy({
  value,
  disabled = false,
  disabledMessage,
  className,
  inputClassName,
}: CopyProps) {
  const [copied, setCopied] = React.useState(false);
  const copyTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const handleCopy = React.useCallback(async () => {
    if (disabled) return;
    if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      copyTimeoutRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }, [value, disabled]);

  React.useEffect(
    () => () => {
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    },
    [],
  );

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex items-center gap-2">
        <Input
          readOnly
          disabled={disabled}
          value={value}
          className={cn("font-mono text-sm", inputClassName)}
          aria-label="Text to copy"
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleCopy}
          disabled={disabled}
          aria-label={copied ? "Copied" : "Copy to clipboard"}
        >
          {copied ? (
            <Check className="size-4 text-green-600 dark:text-green-400" />
          ) : (
            <CopyIcon className="size-4" />
          )}
        </Button>
      </div>
      {disabled && disabledMessage && (
        <p className="text-muted-foreground text-xs">{disabledMessage}</p>
      )}
    </div>
  );
}
