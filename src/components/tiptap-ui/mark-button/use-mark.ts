"use client"

import * as React from "react"
import { useHotkeys } from "react-hotkeys-hook"
import type { Editor } from "@tiptap/react"

// --- Hooks ---
import { useTiptapEditor } from "@/hooks/use-tiptap-editor"

// --- Lib ---
import { isMarkInSchema, isNodeTypeSelected } from "@/lib/tiptap-utils"

// --- Icons ---
import { BoldIcon } from "@/components/tiptap-icons/bold-icon"
import { Code2Icon } from "@/components/tiptap-icons/code2-icon"
import { ItalicIcon } from "@/components/tiptap-icons/italic-icon"
import { StrikeIcon } from "@/components/tiptap-icons/strike-icon"
import { SubscriptIcon } from "@/components/tiptap-icons/subscript-icon"
import { SuperscriptIcon } from "@/components/tiptap-icons/superscript-icon"
import { UnderlineIcon } from "@/components/tiptap-icons/underline-icon"
import { HeadingOneIcon } from "@/components/tiptap-icons/heading-one-icon"
import { HeadingTwoIcon } from "@/components/tiptap-icons/heading-two-icon"
import { HeadingThreeIcon } from "@/components/tiptap-icons/heading-three-icon"
import { HeadingFourIcon } from "@/components/tiptap-icons/heading-four-icon"
import { HeadingFiveIcon } from "@/components/tiptap-icons/heading-five-icon"
import { HeadingSixIcon } from "@/components/tiptap-icons/heading-six-icon"
import { ListOrderedIcon } from "@/components/tiptap-icons/list-ordered-icon"
import { ListIcon } from "lucide-react"
import { ListTodoIcon } from "@/components/tiptap-icons/list-todo-icon"

export type Mark =
  | "bold"
  | "italic"
  | "strike"
  | "code"
  | "underline"
  | "superscript"
  | "subscript"
  | "orderedList"
  | "bulletList"
  | "taskList"
  | "heading1"
  | "heading2"
  | "heading3"
  | "heading4"
  | "heading5"
  | "heading6"
  

/**
 * Configuration for the mark functionality
 */
export interface UseMarkConfig {
  /**
   * The Tiptap editor instance.
   */
  editor?: Editor | null
  /**
   * The type of mark to toggle
   */
  type: Mark
  /**
   * Whether the button should hide when mark is not available.
   * @default false
   */
  hideWhenUnavailable?: boolean
  /**
   * Callback function called after a successful mark toggle.
   */
  onToggled?: () => void
}

export const markIcons = {
  bold: BoldIcon,
  italic: ItalicIcon,
  underline: UnderlineIcon,
  strike: StrikeIcon,
  code: Code2Icon,
  superscript: SuperscriptIcon,
  subscript: SubscriptIcon,
  heading1: HeadingOneIcon,
  heading2: HeadingTwoIcon,
  heading3: HeadingThreeIcon,
  heading4: HeadingFourIcon,
  heading5: HeadingFiveIcon,
  heading6: HeadingSixIcon,
  orderedList: ListOrderedIcon,
  bulletList: ListIcon, // Assuming same icon for both
  taskList: ListTodoIcon, // Assuming same icon for task list
}

export const MARK_SHORTCUT_KEYS: Record<Mark, string> = {
  bold: "mod+b",
  italic: "mod+i",
  underline: "mod+u",
  strike: "mod+shift+s",
  code: "mod+e",
  superscript: "mod+.",
  subscript: "mod+,",
  orderedList: "mod+shift+7",
  bulletList: "mod+shift+8",
  taskList: "mod+shift+9",
  heading1: "mod+alt+1",
  heading2: "mod+alt+2",
  heading3: "mod+alt+3",
  heading4: "mod+alt+4",
  heading5: "mod+alt+5",
  heading6: "mod+alt+6",
}

/**
 * Checks if a mark can be toggled in the current editor state
 */
export function canToggleMark(editor: Editor | null, type: Mark): boolean {
  if (!editor || !editor.isEditable) return false;

  const chain = editor.can();

  switch (type) {
    case "heading1":
    case "heading2":
    case "heading3":
    case "heading4":
    case "heading5":
    case "heading6":
      // Level tidak penting untuk .can(), cukup cek .toggleHeading()
      return chain.toggleHeading({ level: 1 }); 
    case "bulletList":
      return chain.toggleBulletList();
    case "orderedList":
      return chain.toggleOrderedList();
    case "taskList":
      return chain.toggleTaskList();
    // Default case untuk Marks
    default:
      if (!isMarkInSchema(type, editor) || isNodeTypeSelected(editor, ["image"])) {
        return false;
      }
      return chain.toggleMark(type);
  }
}
/**
 * Checks if a mark is currently active
 */
export function isMarkActive(editor: Editor | null, type: Mark): boolean {
  if (!editor || !editor.isEditable) return false;

  switch (type) {
    case "heading1":
      return editor.isActive("heading", { level: 1 });
    case "heading2":
      return editor.isActive("heading", { level: 2 });
    case "heading3":
      return editor.isActive("heading", { level: 3 });
    case "heading4":
      return editor.isActive("heading", { level: 4 });
    case "heading5":
      return editor.isActive("heading", { level: 5 });
    case "heading6":
      return editor.isActive("heading", { level: 6 });
    case "bulletList":
      return editor.isActive("bulletList");
    case "orderedList":
      return editor.isActive("orderedList");
    case "taskList":
      return editor.isActive("taskList");
    // Default case untuk Marks
    default:
      return editor.isActive(type);
  }
}

/**
 * Toggles a mark in the editor
 */
export function toggleMark(editor: Editor | null, type: Mark): boolean {
  if (!editor || !editor.isEditable) return false;

  const chain = editor.chain().focus();

  switch (type) {
    case "heading1":
      return chain.toggleHeading({ level: 1 }).run();
    case "heading2":
      return chain.toggleHeading({ level: 2 }).run();
    case "heading3":
      return chain.toggleHeading({ level: 3 }).run();
    case "heading4":
      return chain.toggleHeading({ level: 4 }).run();
    case "heading5":
      return chain.toggleHeading({ level: 5 }).run();
    case "heading6":
      return chain.toggleHeading({ level: 6 }).run();
    case "bulletList":
      return chain.toggleBulletList().run();
    case "orderedList":
      return chain.toggleOrderedList().run();
    case "taskList":
      return chain.toggleTaskList().run();
    // Default case untuk Marks
    default:
      if (!isMarkInSchema(type, editor) || isNodeTypeSelected(editor, ["image"])) {
        return false;
      }
      return chain.toggleMark(type).run();
  }
}

/**
 * Determines if the mark button should be shown
 */
export function shouldShowButton(props: {
  editor: Editor | null
  type: Mark
  hideWhenUnavailable: boolean
}): boolean {
  const { editor, type, hideWhenUnavailable } = props

  if (!editor || !editor.isEditable) return false

  // Untuk Node, kita tidak perlu memeriksa schema Mark
  const isNode = [
    "heading1", "heading2", "heading3", "heading4", "heading5", "heading6",
    "bulletList", "orderedList", "taskList"
  ].includes(type);

  if (!isNode && !isMarkInSchema(type, editor)) return false

  if (hideWhenUnavailable) {
    return canToggleMark(editor, type)
  }

  return true
}

/**
 * Gets the formatted mark name
 */
export function getFormattedMarkName(type: Mark): string {
  return type.charAt(0).toUpperCase() + type.slice(1)
}

/**
 * Custom hook that provides mark functionality for Tiptap editor
 *
 * @example
 * ```tsx
 * // Simple usage
 * function MySimpleBoldButton() {
 *   const { isVisible, handleMark } = useMark({ type: "bold" })
 *
 *   if (!isVisible) return null
 *
 *   return <button onClick={handleMark}>Bold</button>
 * }
 *
 * // Advanced usage with configuration
 * function MyAdvancedItalicButton() {
 *   const { isVisible, handleMark, label, isActive } = useMark({
 *     editor: myEditor,
 *     type: "italic",
 *     hideWhenUnavailable: true,
 *     onToggled: () => console.log('Mark toggled!')
 *   })
 *
 *   if (!isVisible) return null
 *
 *   return (
 *     <MyButton
 *       onClick={handleMark}
 *       aria-pressed={isActive}
 *       aria-label={label}
 *     >
 *       Italic
 *     </MyButton>
 *   )
 * }
 * ```
 */
export function useMark(config: UseMarkConfig) {
  const {
    editor: providedEditor,
    type,
    hideWhenUnavailable = false,
    onToggled,
  } = config

  const { editor } = useTiptapEditor(providedEditor)
  const [isVisible, setIsVisible] = React.useState<boolean>(true)
  const canToggle = canToggleMark(editor, type)
  const isActive = isMarkActive(editor, type)

  React.useEffect(() => {
    if (!editor) return

    const handleSelectionUpdate = () => {
      setIsVisible(shouldShowButton({ editor, type, hideWhenUnavailable }))
    }

    handleSelectionUpdate()

    editor.on("selectionUpdate", handleSelectionUpdate)

    return () => {
      editor.off("selectionUpdate", handleSelectionUpdate)
    }
  }, [editor, type, hideWhenUnavailable])

  const handleMark = React.useCallback(() => {
    if (!editor) return false

    const success = toggleMark(editor, type)
    if (success) {
      onToggled?.()
    }
    return success
  }, [editor, type, onToggled])

  useHotkeys(
    MARK_SHORTCUT_KEYS[type],
    (event) => {
      event.preventDefault()
      handleMark()
    },
    {
      enabled: isVisible && canToggle,
      enableOnContentEditable: true,
      enableOnFormTags: true,
    }
  )

  return {
    isVisible,
    isActive,
    handleMark,
    canToggle,
    label: getFormattedMarkName(type),
    shortcutKeys: MARK_SHORTCUT_KEYS[type],
    Icon: markIcons[type],
  }
}
