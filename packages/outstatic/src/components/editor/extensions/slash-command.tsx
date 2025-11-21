import { Extension, Range } from '@tiptap/core'
import { Editor, ReactRenderer, posToDOMRect } from '@tiptap/react'
import Suggestion from '@tiptap/suggestion'
import { ReactNode, useState } from 'react'
import { BaseCommandList } from '@/components/editor/extensions/slash-command/BaseCommandList'
import ImageCommandList from '@/components/editor/extensions/slash-command/ImageCommandList'
import { getSuggestionItems } from '@/components/editor/extensions/slash-command/getSuggestionItems'
import { computePosition, shift, flip } from '@floating-ui/dom'

export type CommandItemProps = {
  title: string
  description: string
  icon: ReactNode
  command?: ({ editor, range }: CommandProps) => void
  searchTerms: string[]
  subItems?: CommandItemProps[]
}

export type CommandProps = {
  editor: Editor
  range: Range
}

const Command = Extension.create({
  name: 'slash-command',
  addOptions() {
    return {
      suggestion: {
        char: '/',
        command: ({
          editor,
          range,
          props
        }: {
          editor: Editor
          range: Range
          props: any
        }) => {
          props.command({ editor, range })
        }
      }
    }
  },
  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion
      })
    ]
  }
})

export const updateScrollView = (container: HTMLElement, item: HTMLElement) => {
  const containerHeight = container.offsetHeight
  const itemHeight = item ? item.offsetHeight : 0

  const top = item.offsetTop
  const bottom = top + itemHeight

  if (top < container.scrollTop) {
    container.scrollTop -= container.scrollTop - top + 5
  } else if (bottom > containerHeight + container.scrollTop) {
    container.scrollTop += bottom - containerHeight - container.scrollTop + 5
  }
}

const CommandList = ({
  items,
  command,
  editor,
  range
}: {
  items: CommandItemProps[]
  command: any
  editor: Editor
  range: Range
}) => {
  const [imageMenu, setImageMenu] = useState(false)

  return items.length > 0 ? (
    imageMenu ? (
      <ImageCommandList
        editor={editor}
        setImageMenu={setImageMenu}
        range={range}
      />
    ) : (
      <BaseCommandList
        items={items}
        command={command}
        setImageMenu={setImageMenu}
        editor={editor}
        range={range}
      />
    )
  ) : null
}

const updatePosition = (editor: Editor, element: HTMLElement) => {
  const virtualElement = {
    getBoundingClientRect: () => posToDOMRect(editor.view, editor.state.selection.from, editor.state.selection.to),
  }

  computePosition(virtualElement, element, {
    placement: 'bottom-start',
    strategy: 'absolute',
    middleware: [shift(), flip()],
  }).then(({ x, y, strategy }) => {
    element.style.width = 'max-content'
    element.style.position = strategy
    element.style.left = `${x}px`
    element.style.top = `${y}px`
  })
}

const renderItems = () => {
  let component: ReactRenderer | null = null

  return {
    onStart: (props: { editor: Editor; clientRect: DOMRect }) => {
      component = new ReactRenderer(CommandList, {
        props,
        editor: props.editor,
      })

      if (!props.clientRect) {
        return
      }

      component.element.style.position = 'absolute'
      document.body.appendChild(component.element)
      updatePosition(props.editor, component.element)
    },

    onUpdate(props: { editor: Editor; clientRect: DOMRect }) {
      component?.updateProps(props)

      if (!props.clientRect || !component) {
        return
      }

      updatePosition(props.editor, component.element)
    },

    onKeyDown(props: { event: KeyboardEvent }) {
      if (props.event.key === 'Escape') {
        component?.destroy()
        component?.element.remove()

        return true
      }

      // @ts-ignore
      return component?.ref?.onKeyDown(props)
    },

    onExit() {
      component?.destroy()
      component?.element.remove()
    },
  }
}

const SlashCommand = Command.configure({
  suggestion: {
    items: getSuggestionItems,
    render: renderItems
  }
})

export default SlashCommand
