//utils/useKeyboardShortcut.ts
import { useEffect, useCallback } from "react";

type Modifier = "ctrl" | "shift" | "alt" | "meta";

interface ShortcutOptions {
  modifier?: Modifier | Modifier[];
  key: string;
  callback: () => void;
}

const useKeyboardShortcut = ({ modifier, key, callback }: ShortcutOptions) => {
  const handleKeydown = useCallback(
    (event: KeyboardEvent) => {
      const modifiers = Array.isArray(modifier)
        ? modifier
        : modifier
          ? [modifier]
          : [];

      const isModifierPressed = modifiers.every((mod) => event[`${mod}Key`]);
      const isKeyPressed = event.key.toLowerCase() === key.toLowerCase();

      if (isModifierPressed && isKeyPressed) {
        callback();
        event.preventDefault();
      }
    },
    [key, callback, modifier],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeydown);
    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  }, [handleKeydown]);

  return handleKeydown;
};

export default useKeyboardShortcut;
