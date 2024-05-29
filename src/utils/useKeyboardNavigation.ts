import { useEffect } from "react";

interface UseKeyboardNavigationProps {
  onNext: () => void;
  onPrevious: () => void;
  shortcutKeys?: [string, string];
}

const useKeyboardNavigation = ({
  onNext,
  onPrevious,
  shortcutKeys = ["Ctrl", "ArrowRight"],
}: UseKeyboardNavigationProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const [modifierKey, nextKey] = shortcutKeys;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const modifierKeyPressed = (event as any)[
        `${modifierKey.toLowerCase()}Key`
      ];
      if (modifierKeyPressed && event.key === nextKey) {
        onNext();
      } else if (modifierKeyPressed && event.key === "ArrowLeft") {
        onPrevious();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onNext, onPrevious, shortcutKeys]);
};

export default useKeyboardNavigation;
