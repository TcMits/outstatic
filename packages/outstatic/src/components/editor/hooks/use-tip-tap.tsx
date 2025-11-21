import { TiptapExtensions } from '@/components/editor/extensions/index'
import { TiptapEditorProps } from '@/components/editor/props'
import { Placeholder } from '@tiptap/extensions'
import { Editor, EditorEvents, useEditor } from '@tiptap/react'
import { useEffect, useRef, useCallback } from 'react'
import { useDebouncedCallback } from 'use-debounce'

export const useTipTap = ({ ...rhfMethods }) => {
  const { setValue } = rhfMethods

  const editorRef = useRef<Editor | null>(null)

  const debouncedCallback = useDebouncedCallback(async ({ editor }) => {
    const val = editor.getHTML()
    setValue('content', val && !editor.isEmpty ? val : '')
  }, 500)


  const onUpdate = useCallback(
    ({ editor }: EditorEvents['update']) => {
      debouncedCallback({ editor })
    },
    [debouncedCallback]
  )

  const editor = useEditor({
    extensions: [
      ...TiptapExtensions,
      Placeholder.configure({
        placeholder: ({ editor, node }) => {
          if (editor.isActive('tableCell') || editor.isActive('tableHeader')) {
            return ''
          }

          if (node.type.name === 'heading') {
            return `Heading ${node.attrs.level}`
          }

          if (
            node.type.name === 'bulletList' ||
            node.type.name === 'orderedList'
          ) {
            return ''
          }

          return ``
        },
        includeChildren: false
      })
    ],
    // shouldRerenderOnTransaction: false,
    editorProps: TiptapEditorProps,
    onUpdate,
    immediatelyRender: false
  })

  useEffect(() => {
    if (!editor || editorRef.current) return
    editorRef.current = editor
  }, [editor])


  return { editor: editor as Editor }
}
