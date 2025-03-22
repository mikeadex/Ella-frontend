import React, { useState, useEffect, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Typography from '@tiptap/extension-typography';
import Highlight from '@tiptap/extension-highlight';
import './editor.css';
// Import FontAwesome CSS the Vite way
import '@fortawesome/fontawesome-free/css/all.min.css';
import ImageUploader from './ImageUploader';

// Toolbar button component
const ToolbarButton = ({ icon, onClick, isActive, title }) => (
  <button
    type="button"
    onClick={onClick}
    className={`p-2 ${
      isActive ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
    } rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
    title={title}
  >
    <i className={icon}></i>
  </button>
);

const TiptapEditor = ({ content = '', onChange, placeholder = 'Start typing...', postId = null }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Placeholder.configure({
        placeholder,
        emptyEditorClass: 'is-editor-empty',
      }),
      Link.configure({
        openOnClick: false,
      }),
      Typography,
      Highlight,
    ],
    content,
    onUpdate: ({ editor }) => {
      if (onChange) {
        onChange(editor.getHTML());
      }
    },
  });

  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);

  // Add image handler
  const addImage = useCallback((url) => {
    if (editor && url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);
  
  // Handle image upload
  const handleImageUploaded = useCallback((imageUrl) => {
    addImage(imageUrl);
  }, [addImage]);

  // Handle link insertion
  const setLink = useCallback(() => {
    if (!linkUrl) return;
    
    if (linkUrl === 'clear') {
      editor.chain().focus().unsetLink().run();
    } else {
      editor.chain().focus().setLink({ href: linkUrl }).run();
    }
    
    setLinkUrl('');
    setShowLinkInput(false);
  }, [editor, linkUrl]);

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <ToolbarButton
          icon="fas fa-paragraph"
          onClick={() => editor.chain().focus().setParagraph().run()}
          isActive={editor.isActive('paragraph')}
          title="Paragraph"
        />
        <ToolbarButton
          icon="fas fa-heading"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive('heading', { level: 2 })}
          title="Heading 2"
        />
        <ToolbarButton
          icon="fas fa-heading fa-xs"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive('heading', { level: 3 })}
          title="Heading 3"
        />
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1"></div>
        <ToolbarButton
          icon="fas fa-bold"
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          title="Bold"
        />
        <ToolbarButton
          icon="fas fa-italic"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          title="Italic"
        />
        <ToolbarButton
          icon="fas fa-underline"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive('underline')}
          title="Underline"
        />
        <ToolbarButton
          icon="fas fa-highlighter"
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          isActive={editor.isActive('highlight')}
          title="Highlight"
        />
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1"></div>
        <ToolbarButton
          icon="fas fa-list-ul"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          title="Bullet List"
        />
        <ToolbarButton
          icon="fas fa-list-ol"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          title="Ordered List"
        />
        <ToolbarButton
          icon="fas fa-tasks"
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          isActive={editor.isActive('taskList')}
          title="Task List"
        />
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1"></div>
        <ToolbarButton
          icon="fas fa-quote-right"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
          title="Blockquote"
        />
        <ToolbarButton
          icon="fas fa-code"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive('codeBlock')}
          title="Code Block"
        />
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1"></div>
        <div className="relative">
          {showLinkInput ? (
            <div className="absolute top-full left-0 mt-1 p-2 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 flex items-center w-64">
              <input
                type="text"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="flex-1 p-1 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="https://example.com"
                onKeyDown={(e) => e.key === 'Enter' && setLink()}
                autoFocus
              />
              <button 
                onClick={setLink}
                className="ml-2 px-2 py-1 bg-blue-500 text-white rounded text-sm"
              >
                Add
              </button>
              <button 
                onClick={() => setShowLinkInput(false)}
                className="ml-1 px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded text-sm"
              >
                Cancel
              </button>
            </div>
          ) : null}
          <ToolbarButton
            icon="fas fa-link"
            onClick={() => {
              setShowLinkInput(!showLinkInput);
              if (editor.isActive('link')) {
                setLinkUrl(editor.getAttributes('link').href);
              } else {
                setLinkUrl('');
              }
            }}
            isActive={editor.isActive('link')}
            title="Add Link"
          />
        </div>
        
        {/* Image uploader */}
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1"></div>
        <ImageUploader 
          onImageUploaded={handleImageUploaded}
          postId={postId}
        />
      </div>
      
      <EditorContent 
        editor={editor} 
        className="prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg max-w-none p-4"
      />
    </div>
  );
};

export default TiptapEditor;
