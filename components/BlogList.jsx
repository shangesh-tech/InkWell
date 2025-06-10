'use client';
import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import BlogItem from "./BlogItem";

const BlogList = () => {
    const [activeCategory, setActiveCategory] = useState("All");
    const [blogs, setBlogs] = useState([]);
    const [categories, setCategories] = useState(["All", "Technology", "Startup", "Lifestyle", "Tamil history"]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchBlogs = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('/api/blog');
            setBlogs(response.data.blogs);
        } catch (error) {
            console.error("Failed to fetch blogs:", error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchBlogs();
    }, []);

    const filteredBlogs = useMemo(() => {
        if (!blogs.length) return [];


        const filterCategory = activeCategory === "All"
            ? blogs
            : blogs.filter(blog => blog.category === activeCategory);

        const normalizedQuery = searchQuery.toLowerCase().trim();
        if (!normalizedQuery) return filterCategory;

        return filterCategory.filter(blog => {
            const title = blog?.title?.toLowerCase() || '';
            const description = blog?.description?.toLowerCase() || '';

            return title.includes(normalizedQuery) ||
                description.includes(normalizedQuery);
        });

    }, [blogs, activeCategory, searchQuery]);

    return (
        <section className="container-custom py-16">
            {/* Section Title */}
            <div className="mb-12 flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                    <h2 className="text-3xl font-bold text-primary">Latest Articles</h2>
                    <div className="h-1 w-12 bg-black mt-2"></div>
                    <p className="text-muted mt-2">Discover the latest thoughts and ideas</p>
                </div>

                <div className="relative w-full md:w-auto md:min-w-[300px]">
                    <input
                        type="text"
                        placeholder="Search articles..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-start gap-3 mb-12 border-b border-gray-200 pb-4">
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`px-4 py-2 transition-all ${activeCategory === category
                            ? "font-medium text-white bg-black"
                            : "text-gray-600 bg-gray-100 hover:bg-gray-200"
                            } rounded-md`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Blog Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-80 bg-gray-100 rounded-lg">
                            <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                            <div className="p-4 space-y-3">
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-3 bg-gray-200 rounded w-full"></div>
                                <div className="h-3 bg-gray-200 rounded w-full"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : filteredBlogs.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {filteredBlogs.map((blog, index) => (
                            <BlogItem
                                key={blog._id || index}
                                {...blog}
                            />
                        ))}
                    </div>
                    <div className="mt-12 text-center">
                        <p className="text-gray-600 mb-2">
                            Showing {filteredBlogs.length} of {blogs.length} articles
                        </p>
                        <button className="btn-secondary">
                            Load More
                        </button>
                    </div>
                </>
            ) : (
                <div className="py-16 text-center border border-gray-200 rounded-lg bg-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-gray-600 text-lg">No articles found matching your criteria.</p>
                    <button
                        onClick={() => {
                            setActiveCategory("All");
                            setSearchQuery("");
                        }}
                        className="mt-4 btn-secondary"
                    >
                        Reset filters
                    </button>
                </div>
            )}
        </section>
    );
};

export default BlogList;