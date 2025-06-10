'use client'
import axios from 'axios'
import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'
import { toast } from 'react-toastify'
import upload_area from '@/Assets/upload_area.png'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import Placeholder from '@tiptap/extension-placeholder'
import TiptapImage from '@tiptap/extension-image'

// Toolbar component for Tiptap
const MenuBar = ({ editor }) => {
    if (!editor) {
        return null;
    }

    return (
        <div className="border border-gray-300 border-b-0 rounded-t-lg bg-gray-50 p-2 flex flex-wrap gap-1">
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`p-2 rounded ${editor.isActive('bold') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                title="Bold"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="w-5 h-5">
                    <path fill="none" d="M0 0h24v24H0z" />
                    <path d="M8 11h4.5a2.5 2.5 0 1 0 0-5H8v5zm10 4.5a4.5 4.5 0 0 1-4.5 4.5H6V4h6.5a4.5 4.5 0 0 1 3.256 7.606A4.498 4.498 0 0 1 18 15.5zM8 13v5h5.5a2.5 2.5 0 1 0 0-5H8z" fill="currentColor" />
                </svg>
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`p-2 rounded ${editor.isActive('italic') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                title="Italic"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="w-5 h-5">
                    <path fill="none" d="M0 0h24v24H0z" />
                    <path d="M15 20H7v-2h2.927l2.116-12H9V4h8v2h-2.927l-2.116 12H15z" fill="currentColor" />
                </svg>
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={`p-2 rounded ${editor.isActive('underline') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                title="Underline"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="w-5 h-5">
                    <path fill="none" d="M0 0h24v24H0z" />
                    <path d="M8 3v9a4 4 0 1 0 8 0V3h2v9a6 6 0 1 1-12 0V3h2zM4 20h16v2H4v-2z" fill="currentColor" />
                </svg>
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={`p-2 rounded ${editor.isActive('strike') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                title="Strike"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="w-5 h-5">
                    <path fill="none" d="M0 0h24v24H0z" />
                    <path d="M17.154 14c.23.516.346 1.09.346 1.72 0 1.342-.524 2.392-1.571 3.147C14.88 19.622 13.433 20 11.586 20c-1.64 0-3.263-.381-4.87-1.144V16.6c1.52.877 3.075 1.316 4.666 1.316 2.551 0 3.83-.732 3.839-2.197a2.21 2.21 0 0 0-.648-1.603l-.12-.117H3v-2h18v2h-3.846zm-4.078-3H7.629a4.086 4.086 0 0 1-.481-.522C6.716 9.92 6.5 9.246 6.5 8.452c0-1.236.466-2.287 1.397-3.153C8.83 4.433 10.271 4 12.222 4c1.471 0 2.879.328 4.222.984v2.152c-1.2-.687-2.515-1.03-3.946-1.03-2.48 0-3.719.782-3.719 2.346 0 .42.218.786.654 1.099.436.313.974.562 1.613.75.62.18 1.297.414 2.03.699z" fill="currentColor" />
                </svg>
            </button>
            <div className="border-r border-gray-300 mx-1 h-8"></div>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={`p-2 rounded ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                title="Heading 1"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="w-5 h-5">
                    <path fill="none" d="M0 0h24v24H0z" />
                    <path d="M13 20h-2v-7H4v7H2V4h2v7h7V4h2v16zm8-12v12h-2v-9.796l-2 .536V8.67L19.5 8H21z" fill="currentColor" />
                </svg>
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`p-2 rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                title="Heading 2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="w-5 h-5">
                    <path fill="none" d="M0 0h24v24H0z" />
                    <path d="M4 4v7h7V4h2v16h-2v-7H4v7H2V4h2zm14.5 4c2.071 0 3.75 1.679 3.75 3.75 0 .857-.288 1.648-.772 2.28l-.148.18L18.034 18H22v2h-7v-1.556l4.82-5.546c.268-.307.43-.709.43-1.148 0-.966-.784-1.75-1.75-1.75-.918 0-1.671.707-1.744 1.606l-.006.144h-2C14.75 9.679 16.429 8 18.5 8z" fill="currentColor" />
                </svg>
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={`p-2 rounded ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                title="Heading 3"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="w-5 h-5">
                    <path fill="none" d="M0 0h24v24H0z" />
                    <path d="M22 8l-.002 2-2.505 2.883c1.59.435 2.757 1.89 2.757 3.617 0 2.071-1.679 3.75-3.75 3.75-1.826 0-3.347-1.305-3.682-3.033l1.964-.382c.156.806.866 1.415 1.718 1.415.966 0 1.75-.784 1.75-1.75s-.784-1.75-1.75-1.75c-.286 0-.556.069-.794.19l-1.307-1.547L19.35 10H15V8h7zM4 4v7h7V4h2v16h-2v-7H4v7H2V4h2z" fill="currentColor" />
                </svg>
            </button>
            <div className="border-r border-gray-300 mx-1 h-8"></div>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`p-2 rounded ${editor.isActive('bulletList') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                title="Bullet List"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="w-5 h-5">
                    <path fill="none" d="M0 0h24v24H0z" />
                    <path d="M8 4h13v2H8V4zM4.5 6.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm0 7a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm0 6.9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM8 11h13v2H8v-2zm0 7h13v2H8v-2z" fill="currentColor" />
                </svg>
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`p-2 rounded ${editor.isActive('orderedList') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                title="Ordered List"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="w-5 h-5">
                    <path fill="none" d="M0 0h24v24H0z" />
                    <path d="M8 4h13v2H8V4zM5 3v3h1v1H3V6h1V4H3V3h2zM3 14v-2.5h2V11H3v-1h3v2.5H4v.5h2v1H3zm2 5.5H3v-1h2V18H3v-1h3v4H3v-1h2v-.5zM8 11h13v2H8v-2zm0 7h13v2H8v-2z" fill="currentColor" />
                </svg>
            </button>
            <div className="border-r border-gray-300 mx-1 h-8"></div>
            <button
                type="button"
                onClick={() => editor.chain().focus().setColor('#000000').run()}
                className="p-2 rounded hover:bg-gray-100"
                title="Black"
            >
                <div className="w-5 h-5 bg-black rounded"></div>
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().setColor('#ef4444').run()}
                className="p-2 rounded hover:bg-gray-100"
                title="Red"
            >
                <div className="w-5 h-5 bg-red-500 rounded"></div>
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().setColor('#3b82f6').run()}
                className="p-2 rounded hover:bg-gray-100"
                title="Blue"
            >
                <div className="w-5 h-5 bg-blue-500 rounded"></div>
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().setColor('#22c55e').run()}
                className="p-2 rounded hover:bg-gray-100"
                title="Green"
            >
                <div className="w-5 h-5 bg-green-500 rounded"></div>
            </button>
            <div className="border-r border-gray-300 mx-1 h-8"></div>
            <button
                type="button"
                onClick={() => {
                    const url = window.prompt('URL');
                    if (url) {
                        editor.chain().focus().setLink({ href: url }).run();
                    } else {
                        editor.chain().focus().unsetLink().run();
                    }
                }}
                className={`p-2 rounded ${editor.isActive('link') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                title="Link"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="w-5 h-5">
                    <path fill="none" d="M0 0h24v24H0z" />
                    <path d="M18.364 15.536L16.95 14.12l1.414-1.414a5 5 0 1 0-7.071-7.071L9.879 7.05 8.464 5.636 9.88 4.222a7 7 0 0 1 9.9 9.9l-1.415 1.414zm-2.828 2.828l-1.415 1.414a7 7 0 0 1-9.9-9.9l1.415-1.414L7.05 9.88l-1.414 1.414a5 5 0 1 0 7.071 7.071l1.414-1.414 1.415 1.414zm-.708-10.607l1.415 1.415-7.071 7.07-1.415-1.414 7.071-7.07z" fill="currentColor" />
                </svg>
            </button>
        </div>
    );
};

const Page = () => {
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);
    const [data, setData] = useState({
        title: "",
        description: "",
        category: "Startup",
        author: "Shangesh S",
        authorImg: "/profile_icon.png"
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initialize editor
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link.configure({
                openOnClick: false,
            }),
            TextStyle,
            Color,
            Highlight,
            TiptapImage,
            Placeholder.configure({
                placeholder: 'Write your blog content here and use editor to format your content...',
            }),
        ],
        content: ''
    });

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }));
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onload = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Get the content from editor only when submitting
        const editorContent = editor ? editor.getHTML() : '';
        const textOnlyDescription = editorContent.replace(/<[^>]*>/g, '').trim();

        if (!textOnlyDescription) {
            toast.error("Blog content cannot be empty!");
            setIsSubmitting(false);
            return;
        }

        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('description', editorContent); // Use content from editor
        formData.append('category', data.category);
        formData.append('author', data.author);
        formData.append('authorImg', data.authorImg);

        if (image) {
            formData.append('image', image);
        }

        try {
            const response = await axios.post('/api/blog', formData);
            if (response.data.success) {
                toast.success(response.data.message || "Blog created successfully!");
                // Reset form
                setImage(null);
                setImagePreview(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
                if (editor) {
                    editor.commands.setContent('');
                }
                setData({
                    title: "",
                    description: "",
                    category: "Startup",
                    author: "Shangesh S",
                    authorImg: "/profile_icon.png"
                });
            } else {
                toast.error(response.data.message || "Failed to create blog post");
            }
        } catch (error) {
            console.error('Error submitting blog:', error);
            toast.error(error.response?.data?.message || "Error uploading blog post");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6 sm:p-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8">Create New Blog Post</h1>

                <form onSubmit={onSubmitHandler} className="space-y-6">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-lg font-medium text-gray-700 mb-3">
                                Upload Thumbnail
                            </label>
                            <div
                                className="mt-1 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors overflow-hidden cursor-pointer"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                {imagePreview ? (
                                    <div className="relative h-64 w-full">
                                        <Image
                                            src={imagePreview}
                                            fill
                                            alt="Preview"
                                            className="object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                            <div className="bg-white px-4 py-2 rounded-full text-sm font-medium text-gray-700">
                                                Change Image
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center px-6 py-10">
                                        <Image
                                            src={upload_area}
                                            width={100}
                                            height={100}
                                            alt="Upload area"
                                            className="mx-auto mb-4"
                                            style={{ width: 'auto', height: 'auto' }}
                                        />
                                        <p className="mb-2 text-sm font-medium text-gray-700">
                                            Click to upload or drag and drop
                                        </p>
                                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                    </div>
                                )}
                                <input
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                    type="file"
                                    id="image"
                                    className="hidden"
                                    accept="image/*"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-lg font-medium text-gray-700 mb-2">
                                    Blog Title
                                </label>
                                <input
                                    name="title"
                                    onChange={onChangeHandler}
                                    value={data.title}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent"
                                    type="text"
                                    placeholder="Enter your blog title"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-lg font-medium text-gray-700 mb-2">
                                    Blog Category
                                </label>
                                <select
                                    name="category"
                                    onChange={onChangeHandler}
                                    value={data.category}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent bg-white"
                                >
                                    <option value="Startup">Startup</option>
                                    <option value="Technology">Technology</option>
                                    <option value="Lifestyle">Lifestyle</option>
                                    <option value="Business">Business</option>
                                    <option value="Design">Design</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-lg font-medium text-gray-700 mb-2">
                                Blog Content
                            </label>
                            <div className="editor-container border border-gray-300 rounded-lg overflow-hidden">
                                <MenuBar editor={editor} />
                                <EditorContent
                                    editor={editor}
                                    className="bg-white min-h-[250px] p-4 focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-4 px-6 bg-black text-white font-semibold rounded-lg shadow-md transition duration-200 
                        ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-gray-800 hover:-translate-y-1 transform'}`}
                    >
                        {isSubmitting ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Publishing...
                            </span>
                        ) : 'Publish Blog Post'}
                    </button>
                </form>
            </div>
            <style jsx global>{`
                .ProseMirror {
                    min-height: 200px;
                    max-height: 400px;
                    overflow-y: auto;
                }
                .ProseMirror:focus {
                    outline: none;
                }
                .ProseMirror p.is-editor-empty:first-child::before {
                    color: #adb5bd;
                    content: attr(data-placeholder);
                    float: left;
                    height: 0;
                    pointer-events: none;
                }
            `}</style>
        </div>
    )
}

export default Page