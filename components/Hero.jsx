'use client';
import React, { useState } from 'react'
import { toast } from 'react-toastify';
import axios from 'axios';

const Hero = () => {
    const [email, setEmail] = useState("");
    const [isHovered, setIsHovered] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        if (!email) {
            toast.error("Please enter a valid email address");
            return;
        }

        try {
            setIsSubmitting(true);
            const response = await axios.post('/api/subscribers', { email });

            if (response.data.success) {
                toast.success(response.data.message || "Welcome to our community! 🎉");
                setEmail("");
            } else {
                toast.error(response.data.message || "Failed to subscribe");
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to subscribe. Please try again.";
            toast.error(errorMessage);

            // If it's already subscribed, show a different message
            if (error.response?.status === 400) {
                toast.info("Looks like you're already part of our community!");
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="relative bg-gradient-to-b from-gray-50 via-white to-gray-50 py-32 border-b border-border overflow-hidden">
            {/* Enhanced decorative elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute top-40 right-10 w-72 h-72 bg-gradient-to-r from-yellow-200 to-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
                {/* Additional decorative elements */}
                <div className="absolute top-60 left-1/2 w-48 h-48 bg-gradient-to-r from-green-100 to-teal-100 rounded-full mix-blend-multiply filter blur-lg opacity-60 animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-r from-orange-100 to-red-100 rounded-full mix-blend-multiply filter blur-lg opacity-60 animate-pulse animation-delay-3000"></div>
            </div>

            <div className="container-custom relative z-10">
                <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
                    <div className="flex-1 space-y-8 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-6 py-3 bg-black/5 rounded-full backdrop-blur-sm transition-all hover:bg-black/10 hover:scale-105 transform">
                            <span className="flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                            </span>
                            <span className="text-sm font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                                Crafted with Nextjs | MongoDB | Tailwind CSS | Server-Actions
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 leading-tight tracking-tight">
                            Where Words <br />
                            <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900">
                                Come
                                <span className="absolute bottom-2 left-0 w-full h-4 bg-yellow-200/80 -z-10 transform -rotate-2 rounded"></span>
                            </span>
                            <span className="relative inline-block ml-3 text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900">
                                Alive
                                <span className="absolute bottom-2 left-0 w-full h-4 bg-blue-200/80 -z-10 transform rotate-1 rounded"></span>
                            </span>
                        </h1>

                        <p className="text-gray-600 text-xl leading-relaxed max-w-2xl animate-fade-in">
                            Join a community of passionate writers and readers. Discover stories that inspire,
                            challenge, and transform perspectives.
                        </p>

                        <form onSubmit={onSubmitHandler} className="flex flex-col sm:flex-row max-w-md md:mx-0 mx-auto gap-4">
                            <div className="relative flex-grow group">
                                <input
                                    onChange={(e) => setEmail(e.target.value)}
                                    value={email}
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full px-6 py-4 rounded-full bg-white border-2 border-gray-200 outline-none focus:border-black focus:ring-4 focus:ring-black/5 transition-all duration-300 text-lg group-hover:border-gray-400"
                                    disabled={isSubmitting}
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-transform group-hover:scale-110">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            </div>
                            <button
                                type="submit"
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                                disabled={isSubmitting}
                                className={`px-8 py-4 bg-gradient-to-r from-black to-gray-800 text-white rounded-full hover:from-gray-800 hover:to-black transform hover:scale-105 transition-all duration-300 text-lg font-medium shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)] whitespace-nowrap ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Subscribing...
                                    </div>
                                ) : isHovered ? "Join Now →" : "Subscribe"}
                            </button>
                        </form>

                        <div className="flex items-center gap-8 justify-center md:justify-start text-sm text-gray-500 pt-4">
                            <div className="flex items-center gap-2 hover:text-gray-800 transition-colors">
                                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Free Newsletter</span>
                            </div>
                            <div className="flex items-center gap-2 hover:text-gray-800 transition-colors">
                                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Cancel Anytime</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 hidden lg:block">
                        <div className="relative h-[500px] w-full perspective-1000">
                            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl transform translate-x-10 -translate-y-10 rotate-6 z-0 animate-float"></div>
                            <div className="absolute top-20 right-10 w-96 h-96 border-2 border-black rounded-2xl overflow-hidden shadow-[15px_15px_0px_rgba(0,0,0,0.9)] z-10 transform hover:scale-105 transition-transform duration-500 hover:shadow-[20px_20px_0px_rgba(0,0,0,0.8)] bg-white">
                                <div className="h-full w-full bg-gradient-to-br from-gray-100 via-white to-gray-200 p-6">
                                    <div className="w-full h-4 bg-gray-200 rounded mb-4"></div>
                                    <div className="w-3/4 h-4 bg-gray-200 rounded mb-8"></div>
                                    <div className="space-y-3">
                                        <div className="w-full h-3 bg-gray-100 rounded"></div>
                                        <div className="w-5/6 h-3 bg-gray-100 rounded"></div>
                                        <div className="w-4/6 h-3 bg-gray-100 rounded"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute bottom-0 right-32 w-64 h-64 border-2 border-gray-400 rounded-2xl overflow-hidden z-20 transform -rotate-6 hover:rotate-0 transition-transform duration-500 hover:border-black bg-white animate-float-slow">
                                <div className="h-full w-full bg-gradient-to-br from-gray-50 to-gray-100 p-4">
                                    <div className="w-full h-3 bg-gray-200 rounded mb-3"></div>
                                    <div className="w-2/3 h-3 bg-gray-200 rounded"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Hero