import { AnyExtension } from '@tiptap/core'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import Highlight from '@tiptap/extension-highlight'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import Image from '@tiptap/extension-image'
import { Table, TableCell, TableHeader, TableRow } from '@tiptap/extension-table'
import TiptapUnderline from '@tiptap/extension-underline'
import { ReactNodeViewRenderer } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { common, createLowlight } from 'lowlight'
import CodeBlock from '@/components/editor/extensions/code-block'
import SlashCommand from '@/components/editor/extensions/slash-command'
import { ToggleClass } from '@/components/editor/extensions/toggle-class'
import { Mathematics } from '@/components/editor/extensions/mathematics'
import LinkParser from '@/components/editor/extensions/link-parser'
import { cn } from '@/utils/ui'
import { Markdown } from '@tiptap/markdown'

export const TiptapExtensions = [
  Markdown,
  StarterKit.configure({
    bulletList: {
      HTMLAttributes: {
        class: 'list-disc list-outside leading-3 -mt-2'
      }
    },
    orderedList: {
      HTMLAttributes: {
        class: 'list-decimal list-outside leading-3 -mt-2'
      }
    },
    listItem: {
      HTMLAttributes: {
        class: 'leading-normal -mb-2'
      }
    },
    blockquote: {
      HTMLAttributes: {
        class: 'border-l-4 border-muted'
      }
    },
    codeBlock: false,
    code: {
      HTMLAttributes: {
        class:
          'rounded-md bg-muted px-1.5 py-1 font-mono font-medium text-foreground',
        spellcheck: 'false'
      }
    },
    horizontalRule: false,
    dropcursor: {
      color: '#DBEAFE',
      width: 4
    }
  }),
  ToggleClass,
  HorizontalRule.configure({
    HTMLAttributes: {
      class: 'mt-4 mb-6 border-t border-muted'
    }
  }),
  SlashCommand,
  TiptapUnderline,
  Highlight.configure({
    multicolor: true
  }),
  LinkParser.configure({
    openOnClick: false
  }),
  Mathematics.configure({
    HTMLAttributes: {
      class: cn('text-foreground rounded p-1 hover:bg-accent cursor-pointer')
    },
    katexOptions: {
      throwOnError: false
    }
  }),
  Image.extend({
    renderHTML({ HTMLAttributes }) {
      return [
        'img',
        {
          ...HTMLAttributes,
          onError:
            'this.classList.add("image-error");this.alt="Couldn\'t load image.";'
        }
      ]
    }
  }).configure({ inline: true }),
  CodeBlockLowlight.extend({
    addNodeView() {
      return ReactNodeViewRenderer(CodeBlock as any)
    }
  }).configure({
    // configure lowlight: common /  all / use highlightJS in case there is a need to specify certain language grammars only
    // common: covers 37 language grammars which should be good enough in most cases
    lowlight: createLowlight(common)
  }),
  Table.configure({
    resizable: true
  }),
  TableRow,
  TableHeader,
  TableCell
] as AnyExtension[] // TODO: fix this type
