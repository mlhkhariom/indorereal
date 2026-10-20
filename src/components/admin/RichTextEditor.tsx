import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";
import { Bold, Italic, Heading2, Heading3, List, ListOrdered, Quote, Undo, Redo, Minus } from "lucide-react";

const RichTextEditor = ({ value, onChange }: { value: string; onChange: (html: string) => void }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: { attributes: { class: "prose prose-sm max-w-none min-h-[280px] p-4 focus:outline-none" } },
  });
  useEffect(() => {
    if (editor && value !== editor.getHTML()) editor.commands.setContent(value || "", false);
  }, [value, editor]);
  if (!editor) return null;
  const B = ({ on, active, children, label }: any) => (
    <button type="button" aria-label={label} onClick={on}
      className={`h-8 w-8 rounded-md flex items-center justify-center text-sm ${active ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>{children}</button>
  );
  const c = () => editor.chain().focus();
  return (
    <div className="rounded-lg border border-input bg-background">
      <div className="flex flex-wrap gap-1 border-b border-border p-1.5">
        <B label="Bold" on={() => c().toggleBold().run()} active={editor.isActive("bold")}><Bold className="h-4 w-4" /></B>
        <B label="Italic" on={() => c().toggleItalic().run()} active={editor.isActive("italic")}><Italic className="h-4 w-4" /></B>
        <B label="Heading" on={() => c().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })}><Heading2 className="h-4 w-4" /></B>
        <B label="Subheading" on={() => c().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })}><Heading3 className="h-4 w-4" /></B>
        <B label="Bullet list" on={() => c().toggleBulletList().run()} active={editor.isActive("bulletList")}><List className="h-4 w-4" /></B>
        <B label="Numbered list" on={() => c().toggleOrderedList().run()} active={editor.isActive("orderedList")}><ListOrdered className="h-4 w-4" /></B>
        <B label="Quote" on={() => c().toggleBlockquote().run()} active={editor.isActive("blockquote")}><Quote className="h-4 w-4" /></B>
        <B label="Divider" on={() => c().setHorizontalRule().run()}><Minus className="h-4 w-4" /></B>
        <span className="flex-1" />
        <B label="Undo" on={() => c().undo().run()}><Undo className="h-4 w-4" /></B>
        <B label="Redo" on={() => c().redo().run()}><Redo className="h-4 w-4" /></B>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;
