import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import React, { useState, useRef, useCallback } from "react";

interface CustomInputProps
  extends React.HTMLProps<HTMLDivElement>,
    VariantProps<typeof inputVariants> {
  placeholder?: string | undefined;
  onChanged?: (value: string) => void; // Callback for changes
}

const inputVariants = cva(
  "flex min-h-auto w-full rounded-md border border-input bg-transparent text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:bg-peerlistHoverBackground md:text-sm overflow-wrap-break-word",
  {
    variants: {
      variant: {
        default: "",
        title:
          "border-none rounded-none font-semibold shadow-none outline-none focus-visible:ring-0 text-muted-foreground",
        helpText:
          "border-none text-xs rounded-none shadow-none outline-none focus-visible:ring-0",
        notFilled:
          "text-xs px-2 py-1.5 shadow-none outline-none focus-visible:ring-0",
      },
    },
    defaultVariants: {
      variant: "notFilled",
    },
  }
);

function CustomInput({
  className = "",
  placeholder = "Write a question",
  variant,
  onChanged,
  ...props
}: CustomInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLDivElement>(null);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLDivElement>) => {
      const newValue = e.target.innerText;
      setInputValue(newValue); // Update local state
      onChanged?.(newValue); // Call the onChange prop with the new value
    },
    [onChanged]
  );

  return (
    <div
      ref={inputRef}
      role="textbox"
      suppressContentEditableWarning
      aria-multiline="true"
      className={cn(
        inputVariants({ variant }),
        className,
        inputValue.trim().length !== 0 && "text-black"
      )}
      contentEditable
      onFocus={handleFocus}
      onBlur={handleBlur}
      onInput={handleInputChange}
      {...props}
    >
      {/* Only display placeholder if the div is not focused and is empty */}
      {!isFocused && inputValue.trim().length === 0 && placeholder}
    </div>
  );
}

export default CustomInput;
