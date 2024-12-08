import { cn } from "@/lib/utils";
import { useUserContext } from "@/store/userStore";
import { cva, type VariantProps } from "class-variance-authority";
import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  forwardRef,
} from "react";

interface CustomInputProps
  extends React.HTMLProps<HTMLDivElement>,
    VariantProps<typeof inputVariants> {
  onChanged?: (value: string) => void;
  value?: string;
  placeholder?: string;
  type?: string;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
}

const inputVariants = cva(
  "flex w-full rounded-md border border-input bg-transparent text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:bg-peerlistHoverBackground md:text-base overflow-wrap-break-word",
  {
    variants: {
      variant: {
        default: "",
        title:
          "border-none rounded-none font-semibold shadow-none outline-none focus-visible:ring-0 text-muted-foreground  max-md:text-sm",
        helpText:
          "border-none rounded-none text-xs md:text-sm shadow-none outline-none focus-visible:ring-0",
        notFilled:
          "text-xs px-2 py-1.5  shadow-none outline-none focus-visible:ring-0",
      },
    },
    defaultVariants: {
      variant: "notFilled",
    },
  }
);

const CustomInput = forwardRef<HTMLDivElement, CustomInputProps>(
  (
    {
      className = "",
      placeholder = "Write a question",
      variant,
      onChanged,
      value: propValue,
      maxLength,
      minLength,
      pattern,
      disabled,
      readOnly,
      ...props
    },
    //@ts-check
    ref
  ) => {
    const { setEditing } = useUserContext();
    // Local state for immediate editing
    const [localValue, setLocalValue] = useState(propValue || "");
    // State to track the last confirmed value
    const [confirmedValue, setConfirmedValue] = useState(propValue || "");
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<HTMLDivElement>(null);
    const lastCaretPositionRef = useRef<number>(0);

    // Save cursor position before input changes
    const saveCaretPosition = useCallback(() => {
      if (inputRef.current) {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const preCaretRange = range.cloneRange();
          preCaretRange.selectNodeContents(inputRef.current);
          preCaretRange.setEnd(range.endContainer, range.endOffset);
          lastCaretPositionRef.current = preCaretRange.toString().length;
        }
      }
    }, []);

    // Restore cursor position after content update
    const restoreCaretPosition = useCallback((position: number) => {
      if (inputRef.current) {
        const selection = window.getSelection();
        const range = document.createRange();

        let currentOffset = 0;

        // Traverse through text nodes to find the correct position
        const traverseNodes = (
          node: Node
        ): { node: Node; offset: number } | null => {
          if (node.nodeType === Node.TEXT_NODE) {
            const nodeLength = node.textContent?.length || 0;
            if (currentOffset + nodeLength >= position) {
              return {
                node,
                offset: position - currentOffset,
              };
            }
            currentOffset += nodeLength;
          }

          for (let i = 0; i < node.childNodes.length; i++) {
            const result = traverseNodes(node.childNodes[i]);
            if (result) return result;
          }

          return null;
        };

        const caretInfo = traverseNodes(inputRef.current);

        if (caretInfo && selection) {
          range.setStart(caretInfo.node, caretInfo.offset);
          range.collapse(true);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }
    }, []);

    // Handle input changes
    const handleInputChange = useCallback(
      (e: React.FormEvent<HTMLDivElement>) => {
        // Save current caret position before updating
        saveCaretPosition();
        setEditing(true);
        const newValue = e.currentTarget.textContent || "";

        // Apply maxLength if specified
        const limitedValue = maxLength
          ? newValue.slice(0, maxLength)
          : newValue;

        // Check minLength and pattern if needed
        if (
          (!minLength || limitedValue.length >= minLength) &&
          (!pattern || new RegExp(pattern).test(limitedValue))
        ) {
          // Update local value for immediate editing
          setLocalValue(limitedValue);

          // Restore caret position in next render cycle
          setTimeout(() => {
            restoreCaretPosition(lastCaretPositionRef.current);
          }, 0);
        }
      },
      [
        maxLength,
        minLength,
        pattern,
        setEditing,
        saveCaretPosition,
        restoreCaretPosition,
      ]
    );

    // Handle blur to confirm value
    const handleBlur = useCallback(() => {
      setIsFocused(false);

      // Only trigger onChanged if the value has actually changed
      if (localValue !== confirmedValue) {
        onChanged?.(localValue);
        setConfirmedValue(localValue);
        setEditing(false);
      }
    }, [localValue, confirmedValue, onChanged, setEditing]);

    // Sync prop value with confirmed value
    useEffect(() => {
      if (propValue !== undefined && propValue !== confirmedValue) {
        setLocalValue(propValue);
        setConfirmedValue(propValue);
      }
    }, [propValue, confirmedValue]);

    const handleFocus = useCallback(() => {
      setIsFocused(true);
    }, []);

    return (
      <div
        ref={inputRef}
        role="textbox"
        contentEditable={!disabled && !readOnly}
        suppressContentEditableWarning
        aria-multiline="false"
        data-placeholder={placeholder}
        className={cn(
          inputVariants({ variant }),

          "relative", // For placeholder positioning
          "break-words", // Ensure word wrapping
          "whitespace-pre-wrap", // Preserve line breaks
          isFocused || localValue.trim().length > 0
            ? "text-black"
            : "text-muted-foreground",
          disabled ? "opacity-50 cursor-not-allowed" : "",

          // Improved placeholder positioning
          "after:absolute after:top-1/2 after:-translate-y-1/2 after:left-0 after:text-muted-foreground after:pointer-events-none after:opacity-50",
          // Use after pseudo-element for placeholder when empty
          !localValue && `after:content-[attr(data-placeholder)]`,
          className
        )}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onInput={handleInputChange}
        {...props}
      >
        {localValue}
      </div>
    );
  }
);

CustomInput.displayName = "CustomInput";

export default CustomInput;
