import { connectDB } from "@/lib/config/db";
import BlogModel from "@/lib/models/BlogModel";
import ViewTracker from "@/lib/models/ViewTracker";
// import { writeFile } from 'fs/promises';
import { NextResponse } from "next/server";
// import fs from 'fs';
import mongoose from 'mongoose';
import { auth } from "@/auth";
import cloudinary from "@/lib/cloudinary";

// const UPLOAD_DIR = './public/uploads';
// const UPLOAD_PATH_PUBLIC = '/uploads';
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// if (!fs.existsSync(UPLOAD_DIR)) {
//     fs.mkdirSync(UPLOAD_DIR, { recursive: true });
// }

export async function GET(request) {
    try {
        await connectDB();
        const blogId = request.nextUrl.searchParams.get("id");

        if (blogId) {
            if (!mongoose.Types.ObjectId.isValid(blogId)) {
                return NextResponse.json({
                    success: false,
                    error: "Invalid blog ID format"
                }, { status: 400 });
            }

            let blog = await BlogModel.findById(blogId).lean();

            if (!blog) {
                return NextResponse.json({
                    success: false,
                    error: "Blog not found"
                }, { status: 404 });
            }

            // Handle view tracking
            try {
                const forwarded = request.headers.get('x-forwarded-for');
                const ipAddress = forwarded
                    ? forwarded.split(',')[0].trim()
                    : request.headers.get('x-real-ip') || request.ip || '127.0.0.1';

                const now = new Date();

                // Get the current user session
                const session = await auth();
                const userId = session?.user?.id || null;

                // Check if this view already exists before trying to create it
                const existingView = await ViewTracker.findOne({
                    blogId,
                    ipAddress,
                    userId
                });

                if (!existingView) {
                    // Only create a new view if one doesn't exist
                    const viewTracker = new ViewTracker({
                        blogId,
                        ipAddress,
                        timestamp: now,
                        userId
                    });

                    await viewTracker.save();

                    // Increment view count only for new views
                    blog = await BlogModel.findByIdAndUpdate(
                        blogId,
                        {
                            $inc: { views: 1 },
                            $push: {
                                viewsHistory: {
                                    date: now,
                                    count: 1
                                }
                            }
                        },
                        { new: true }
                    ).lean();
                }
            } catch (error) {
                if (error.code !== 11000) {
                    console.error("Error tracking view:", error);
                }
            }

            return NextResponse.json({
                success: true,
                blog
            }, { status: 200 });

        } else {
            const blogs = await BlogModel.find({}).lean().sort({ createdAt: -1 });

            return NextResponse.json({
                success: true,
                blogs,
                length: blogs.length
            }, { status: 200 });
        }

    } catch (error) {
        console.error("Error in GET /api/blog:", error);
        return NextResponse.json({
            success: false,
            error: "Internal server error"
        }, { status: 500 });
    }
}

//API Endpoint for posting blogs

export async function POST(request) {
    try {

        await connectDB();

        const formData = await request.formData();
        const imageUrl = await handleImageUpload(formData.get('image'));
        const blogData = createBlogData(formData, imageUrl);
        const newBlog = await BlogModel.create(blogData);

        return NextResponse.json({
            success: true,
            message: "Blog post created successfully",
            blog: newBlog
        }, { status: 201 });

    } catch (error) {
        console.error("Error creating blog post:", error);
        return NextResponse.json({
            success: false,
            message: "Failed to create blog post"
        }, { status: 500 });
    }
}


// API to delete blog post

export async function DELETE(request) {
    try {
        await connectDB();

        const id = request.nextUrl.searchParams.get('id');
        if (!id) {
            return NextResponse.json({
                success: false,
                message: "Blog ID is required"
            }, { status: 400 });
        }

        const blog = await BlogModel.findById(id);
        if (!blog) {
            return NextResponse.json({
                success: false,
                message: "Blog post not found"
            }, { status: 404 });
        }


        await deleteImage(blog.image);


        await BlogModel.findByIdAndDelete(id);

        return NextResponse.json({
            success: true,
            message: "Blog post deleted successfully"
        }, { status: 200 });

    } catch (error) {
        console.error("Error deleting blog post:", error);
        return NextResponse.json({
            success: false,
            message: "Failed to delete blog post"
        }, { status: 500 });
    }
}

//API Endpoint for updating blog post

export async function PUT(request) {
    try {
        await connectDB();
        const id = request.nextUrl.searchParams.get('id');

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({
                success: false,
                message: "Invalid Blog ID"
            }, { status: 400 });
        }

        const existingBlog = await BlogModel.findById(id);
        if (!existingBlog) {
            return NextResponse.json({
                success: false,
                message: "Blog not found"
            }, { status: 404 });
        }

        const formData = await request.formData();
        let updateData = {
            title: formData.get('title'),
            description: formData.get('description'),
            category: formData.get('category'),
            author: formData.get('author'),
            authorImg: formData.get('authorImg')
        };

        Object.keys(updateData).forEach(key =>
            !updateData[key] && delete updateData[key]
        );

        const newImage = formData.get('image');
        if (newImage?.size > 0) {
            try {
                await deleteImage(existingBlog.image);
                updateData.image = await handleImageUpload(newImage);
            } catch (imageError) {
                return NextResponse.json({
                    success: false,
                    message: imageError.message
                }, { status: 400 });
            }
        }

        const updatedBlog = await BlogModel.findOneAndUpdate(
            {
                _id: id,
                __v: existingBlog.__v
            },
            {
                $set: updateData,
                $inc: { __v: 1 }
            },
            {
                new: true,
                runValidators: true,
                lean: true
            }
        );

        if (!updatedBlog) {
            return NextResponse.json({
                success: false,
                message: "Blog was modified by another user. Please refresh and try again."
            }, { status: 409 });
        }

        return NextResponse.json({
            success: true,
            message: "Blog updated successfully",
            blog: updatedBlog
        }, { status: 200 });

    } catch (error) {
        console.error("Error updating blog:", error);
        return NextResponse.json({
            success: false,
            message: error.message
        }, { status: 500 });
    }
}


//  image upload helper with validation
// async function handleImageUpload(image) {
//     if (!image) {
//         throw new Error("Image is required");
//     }

//     // File type validation
//     if (!ALLOWED_FILE_TYPES.includes(image.type)) {
//         throw new Error("Invalid file type. Only JPEG, PNG, WebP and GIF are allowed");
//     }

//     // File size validation
//     if (image.size > MAX_FILE_SIZE) {
//         throw new Error("File size too large. Maximum size is 10MB");
//     }

//     const filename = `${Date.now()}_${image.name}`;
//     const fullPath = `${UPLOAD_DIR}/${filename}`;
//     const publicPath = `${UPLOAD_PATH_PUBLIC}/${filename}`;

//     try {
//         const imageBuffer = Buffer.from(await image.arrayBuffer());
//         await writeFile(fullPath, imageBuffer);
//         return publicPath;
//     } catch (error) {
//         console.error("Error uploading image:", error);
//         throw new Error("Failed to upload image");
//     }
// }

async function handleImageUpload(image) {
    if (!image) throw new Error("Image is required");

    if (!ALLOWED_FILE_TYPES.includes(image.type)) {
        throw new Error("Invalid file type. Only JPEG, PNG, WebP allowed");
    }

    if (image.size > MAX_FILE_SIZE) {
        throw new Error("File size too large. Max 10MB");
    }

    const buffer = Buffer.from(await image.arrayBuffer());

    try {
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: "blog_uploads",
                    resource_type: "image"
                },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );

            uploadStream.end(buffer);
        });

        return result.secure_url;

    } catch (error) {
        console.error("Cloudinary upload error:", error);
        throw new Error("Failed to upload image to Cloudinary");
    }
}


// Helper function to delete image
// async function deleteImage(imagePath) {
//     if (!imagePath) return;

//     try {
//         const fullPath = `./public${imagePath}`;
//         if (fs.existsSync(fullPath)) {
//             await fs.promises.unlink(fullPath);
//         }
//     } catch (error) {
//         console.error("Error deleting image file:", error);
//     }
// }

async function deleteImage(imageUrl) {
    if (!imageUrl) return;

    try {
        const publicId = getPublicIdFromUrl(imageUrl);
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error("Cloudinary delete error:", error);
    }
}

// Helper: Extract Cloudinary public_id from secure_url
function getPublicIdFromUrl(url) {
    const parts = url.split('/');
    const filename = parts.pop().split('.')[0];
    const folder = parts.slice(-1)[0] === 'blog_uploads' ? 'blog_uploads/' : '';
    return folder + filename;
}


// Helper function to create blog data object
function createBlogData(formData, imageUrl) {
    const requiredFields = ['title', 'description', 'category', 'author', 'authorImg'];

    for (const field of requiredFields) {
        if (!formData.get(field)) {
            throw new Error(`${field} is required`);
        }
    }

    return {
        title: formData.get('title'),
        description: formData.get('description'),
        category: formData.get('category'),
        author: formData.get('author'),
        image: imageUrl,
        authorImg: formData.get('authorImg')
    };
}

