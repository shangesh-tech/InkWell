'use client';

import Image from "next/image"
import Link from "next/link"

const BlogItem = ({ title, description, category, image, _id }) => {
  return (
    <div className="group h-full flex flex-col border border-gray-200 rounded-lg overflow-hidden transition-shadow hover:shadow-lg bg-white">
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <Link href={`/blogs/${_id}`}>
          <Image
            src={image}
            alt={title}
            fill
            quality={85}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
        <div className="absolute top-4 left-4">
          <span className="bg-black/85 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-sm">
            {category}
          </span>
        </div>
      </div>

      <div className="flex flex-col flex-grow p-5">
        <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-gray-700 transition-colors">
          <Link href={`/blogs/${_id}`}>
            {title}
          </Link>
        </h3>

        {/* <p className="text-muted text-sm mb-4 line-clamp-3 flex-grow">
          {description}
        </p> */}

        <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
          <Link
            href={`/blogs/${_id}`}
            className="inline-flex items-center text-black font-medium transition-opacity hover:opacity-70"
          >
            Read article
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>

          <span className="text-xs text-gray-400">5 min read</span>
        </div>
      </div>
    </div>
  )
}

export default BlogItem