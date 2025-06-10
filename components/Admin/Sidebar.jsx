'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from 'next/navigation';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const isActive = (path) => {
    return pathname === path;
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navigationItems = [
    {
      label: "Dashboard",
      path: "/admin",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      )
    },
    {
      section: "Content",
      items: [
        {
          label: "Add Blog",
          path: "/admin/addProduct",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          )
        },
        {
          label: "Blog List",
          path: "/admin/blogList",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          )
        }
      ]
    },
    {
      section: "Users",
      items: [
        {
          label: "Subscribers",
          path: "/admin/subscribers",
          // count: 24,
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          )
        }
      ]
    },
    // {
    //   section: "System",
    //   items: [
    //     {
    //       label: "Settings",
    //       path: "/admin/settings",
    //       icon: (
    //         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    //           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    //           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    //         </svg>
    //       )
    //     }
    //   ]
    // }
  ];

  return (
    <div
      className={`bg-black text-white h-screen ${isCollapsed ? 'w-[70px]' : 'w-[260px]'
        } transition-all duration-300 flex flex-col border-r border-gray-800 relative z-20`}
    >
      {/* Sidebar Header */}
      <div className="flex justify-between items-center py-6 px-4 border-b border-gray-800">
        {!isCollapsed && (
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
            <span className="font-bold text-lg">INKWELL</span>
          </div>
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded-md hover:bg-gray-800 transition-colors"
        >
          {isCollapsed ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7" />
            </svg>
          )}
        </button>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 py-6 flex flex-col gap-2 overflow-y-auto">
        {navigationItems.map((item, index) => {
          if (item.section) {
            return (
              <div key={index} className="px-4 mb-1 mt-5">
                {!isCollapsed && (
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    {item.section}
                  </div>
                )}
                <div className="space-y-1">
                  {item.items.map((subItem, subIndex) => (
                    <Link
                      key={`${index}-${subIndex}`}
                      href={subItem.path}
                      className={`flex items-center justify-between px-4 py-3 rounded-md transition-colors ${isActive(subItem.path)
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <span>{subItem.icon}</span>
                        {!isCollapsed && <span>{subItem.label}</span>}
                      </div>

                      {!isCollapsed && subItem.count && (
                        <span className="bg-gray-700 text-xs px-2 py-0.5 rounded-full">
                          {subItem.count}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            );
          } else {
            return (
              <Link
                key={index}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-md transition-colors ${isActive(item.path)
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
              >
                <span>{item.icon}</span>
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            );
          }
        })}
      </div>

      {/* Back to Site Link */}
      <div className="mt-auto p-4 border-t border-gray-800">
        <Link
          href="/"
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors bg-gray-800/50 rounded-md py-2 px-3"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {!isCollapsed && <span>Back to Website</span>}
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;