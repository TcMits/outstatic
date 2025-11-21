import { useState } from 'react'
import { NodeSelector } from '@/components/editor/selectors/node-selector'
import { LinkSelector } from '@/components/editor/selectors/link-selector'
import { TextButtons } from '@/components/editor/selectors/text-buttons'
import { MathSelector } from '@/components/editor/selectors/math-selector'
import { Editor } from '@tiptap/react'
import { EditorBubble } from '../ui/editor-bubble'

const EditorMenu = ({ editor }: { editor: Editor }) => {
  const [openLink, setOpenLink] = useState(false)
  const [openNode, setOpenNode] = useState(false)

  if (!editor) return null

  return (
    <EditorBubble
      options={{
        placement: 'top',
        onHide: () => {
          editor.chain().unsetHighlight().run()
        }
      }}
      className="flex w-fit max-w-[90vw] overflow-hidden rounded-md border border-muted bg-background shadow-xl"
    >
      <NodeSelector open={openNode} onOpenChange={setOpenNode} />
      <LinkSelector open={openLink} onOpenChange={setOpenLink} />
      <TextButtons />
      <MathSelector />
    </EditorBubble>
  )
}

export default EditorMenu
