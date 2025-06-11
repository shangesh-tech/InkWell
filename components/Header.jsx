'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';

const Header = () => {
    const { data: session } = useSession();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const pathname = usePathname();
    const isBlogPostPage = pathname.startsWith('/blogs/');


    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);

    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (isMenuOpen && !e.target.closest('nav') && !e.target.closest('button')) {
                setIsMenuOpen(false);
            }
            if (isDropdownOpen && !e.target.closest('.dropdown-container')) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [isMenuOpen, isDropdownOpen]);

    const toggleDropdown = () => {
        console.log(session);
        setIsDropdownOpen(!isDropdownOpen);

    };

    const navLinks = [
        { href: "/", label: "Home" },
        { href: "/admin", label: "Admin" }
    ];

    return (
        <header className={`${isBlogPostPage ? '' : 'sticky'} top-0 z-50 px-4 py-3 bg-white ${isScrolled ? 'shadow-sm bg-white/80 backdrop-blur-sm' : 'border-b'}`}>
            <div className="max-w-6xl mx-auto flex items-center justify-between">
                <Link href="/" className="text-2xl font-bold">
                    INKWELL
                </Link>

                <nav className="hidden md:flex items-center space-x-8">
                    {navLinks.map(({ href, label }) => (
                        <Link
                            key={href}
                            href={href}
                            className="text-gray-600 hover:text-black"
                        >
                            {label}
                        </Link>
                    ))}

                    {session ? (
                        <div className="dropdown-container relative">
                            <button
                                onClick={toggleDropdown}
                                className="flex items-center space-x-3 text-gray-600 hover:text-black focus:outline-none"
                            >
                                <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-gray-200">
                                    {session.user.image ? (
                                        <Image
                                            src={session.user.image}
                                            alt="Profile"
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                            <span className="text-gray-500 text-sm">
                                                {session.user.firstName?.[0]?.toUpperCase() || session.user.email[0].toUpperCase()}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-64 rounded-lg shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <div className="px-4 py-3 border-b">
                                        <p className="text-sm leading-5 font-medium text-gray-900">
                                            {session.user.firstName ? `${session.user.firstName} ${session.user.lastName || ''}` : 'User'}
                                        </p>
                                        <p className="text-sm leading-5 text-gray-500 truncate">
                                            {session.user.email}
                                        </p>
                                    </div>

                                    <div className="py-1">
                                        {session.user.role === 'admin' && (
                                            <Link
                                                href="/admin/blogList"
                                                className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                onClick={() => setIsDropdownOpen(false)}
                                            >
                                                <svg className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                                </svg>
                                                Dashboard
                                            </Link>
                                        )}

                                        {/* <Link
                                            href="/settings"
                                            className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            <svg className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            Settings
                                        </Link> */}

                                        <button
                                            onClick={() => {
                                                signOut({ callbackUrl: '/' });
                                                setIsDropdownOpen(false);
                                            }}
                                            className="w-full group flex items-center px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                                        >
                                            <svg className="mr-3 h-5 w-5 text-red-400 group-hover:text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="text-gray-600 hover:text-black"
                            >
                                Sign In
                            </Link>
                            <Link
                                href="/signup"
                                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                            >
                                Sign Up
                            </Link>
                        </>
                    )}
                </nav>

                <button
                    className="md:hidden p-2"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {isMenuOpen ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    )}
                </button>

                {isMenuOpen && (
                    <nav className="absolute top-full left-0 right-0 bg-white border-b md:hidden p-4 space-y-4">
                        {navLinks.map(({ href, label }) => (
                            <Link
                                key={href}
                                href={href}
                                className="block text-gray-600 hover:text-black"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {label}
                            </Link>
                        ))}

                        {session ? (
                            <div className="space-y-3">
                                <div className="flex items-center space-x-3 px-2">
                                    <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200">
                                        {session.user.image ? (
                                            <Image
                                                src={session.user.image}
                                                alt="Profile"
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                <span className="text-gray-500 text-lg">
                                                    {session.user.firstName?.[0]?.toUpperCase() || session.user.email[0].toUpperCase()}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {session.user.firstName ? `${session.user.firstName} ${session.user.lastName || ''}` : 'User'}
                                        </p>
                                        <p className="text-sm text-gray-500 truncate">
                                            {session.user.email}
                                        </p>
                                    </div>
                                </div>

                                {session.user.role === 'admin' && (
                                    <Link
                                        href="/admin/blogList"
                                        className="block text-gray-600 hover:text-black px-2"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Dashboard
                                    </Link>
                                )}

                                <Link
                                    href="/admin/settings"
                                    className="block text-gray-600 hover:text-black px-2"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Settings
                                </Link>

                                <button
                                    onClick={() => {
                                        signOut({ callbackUrl: '/' });
                                        setIsMenuOpen(false);
                                    }}
                                    className="block w-full text-left text-red-600 hover:text-red-700 px-2"
                                >
                                    Sign Out
                                </button>
                            </div>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="block text-gray-600 hover:text-black"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/signup"
                                    className="block px-4 py-2 bg-black text-white text-center rounded-md hover:bg-gray-800 transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </nav>
                )}
            </div>
        </header>
    );
};

export default Header;