import { useState } from 'react';
import { format } from 'date-fns';
import Link from 'next/link';
import Image from 'next/image';
import profile_icon from '@/Assets/profile_icon.png';
import { createPortal } from 'react-dom';

const DeleteModal = ({ isOpen, title, onClose, onDelete, isDeleting }) => {
    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
                <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
                <p className="text-gray-600 mb-6">
                    Are you sure you want to delete "{title}"? This action cannot be undone.
                </p>
                <div className="flex justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onDelete}
                        disabled={isDeleting}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

const BlogTableItem = ({ authorImg, title, author, date, deleteBlog, mongoId, image }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            await deleteBlog(mongoId);
        } finally {
            setIsDeleting(false);
            setShowConfirm(false);
        }
    };

    return (
        <>
            <tr className="bg-white border-b hover:bg-gray-50 transition-all duration-200">
                <td className="px-6 py-4">
                    <div className="w-20 h-16 relative rounded overflow-hidden bg-gray-100">
                        {image ? (
                            <Image
                                src={image}
                                alt={title || 'Blog thumbnail'}
                                fill
                                sizes="80px"
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        )}
                    </div>
                </td>
                <td className="hidden sm:table-cell px-6 py-4 font-medium text-gray-900">
                    <div className="flex items-center gap-3">
                        <Image
                            width={40}
                            height={40}
                            src={profile_icon}
                            alt={author || 'Author'}
                            className="rounded-full"
                        />
                        <span>{author || "No author"}</span>
                    </div>
                </td>
                <td className="px-6 py-4 font-medium text-gray-900">
                    <div className="line-clamp-1">{title || "no title"}</div>
                </td>
                <td className="px-6 py-4">
                    {format(new Date(date || Date.now()), 'MMM dd, yyyy')}
                </td>
                <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                        <Link
                            href={`/admin/edit/${mongoId}`}
                            className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                            </svg>
                        </Link>

                        <button
                            onClick={() => setShowConfirm(true)}
                            disabled={isDeleting}
                            className="text-red-600 hover:text-red-800 transition-colors duration-200"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </td>
            </tr>

            <DeleteModal
                isOpen={showConfirm}
                title={title}
                onClose={() => setShowConfirm(false)}
                onDelete={handleDelete}
                isDeleting={isDeleting}
            />
        </>
    );
};

export default BlogTableItem;