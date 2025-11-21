import { BubbleMenu } from '@tiptap/react/menus'
import { isNodeSelection } from '@tiptap/react'
import { useMemo, forwardRef } from 'react'
import type { BubbleMenuProps } from '@tiptap/react/menus'
import type { ReactNode } from 'react'
import { useEditor } from '../editor-context'

export interface EditorBubbleProps extends Omit<BubbleMenuProps, 'editor'> {
  readonly children: ReactNode
}

export const EditorBubble = forwardRef<HTMLDivElement, EditorBubbleProps>(
  ({ children, options, ...rest }, ref) => {
    const { editor: currentEditor } = useEditor()

    const bubbleMenuProps: Omit<EditorBubbleProps, 'children'> = useMemo(() => {
      const shouldShow: BubbleMenuProps['shouldShow'] = ({ editor, state }) => {
        const { selection } = state
        const { empty } = selection

        // don't show bubble menu if:
        // - the editor is not editable
        // - the selected node is an image
        // - the selection is empty
        // - the selection is a node selection (for drag handles)
        if (
          !editor.isEditable ||
          editor.isActive('image') ||
          empty ||
          isNodeSelection(selection)
        ) {
          return false
        }
        return true
      }

      return {
        shouldShow,
        options: {
          moveTransition: 'transform 0.15s ease-out',
          ...options
        },
        ...rest
      }
    }, [rest, options])

    if (!currentEditor) return null

    return (
      // We need to add this because of https://github.com/ueberdosis/tiptap/issues/2658
      <div ref={ref}>
        <BubbleMenu {...bubbleMenuProps} editor={currentEditor}>
          {children}
        </BubbleMenu>
      </div>
    )
  }
)

EditorBubble.displayName = 'EditorBubble'

export default EditorBubble
