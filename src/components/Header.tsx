"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMenuOpen]);

  const menuItems = [
    {
      title: "COMPANY",
      path: "/company/about",
      submenu: [
        { title: "About us", path: "/company/about" },
        { title: "CEO Message", path: "/company/ceo" },
        { title: "History", path: "/company/history" },
        { title: "Organization", path: "/company/organization" },
      ],
    },
    {
      title: "BUSINESS",
      path: "/business/work",
      submenu: [
        { title: "Work", path: "/business/work" },
        { title: "Clients", path: "/business/clients" },
      ],
    },
    {
      title: "PROJECTS",
      path: "/projects",
    },
    {
      title: "CONTACT",
      path: "/contact",
    },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled || pathname !== "/"
            ? "bg-white shadow-md"
            : "bg-transparent"
        }`}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="text-2xl font-bold">
              <span
                className={`transition-colors ${
                  isScrolled || pathname !== "/" ? "text-primary" : "text-white"
                }`}
              >
                SJ INDE
              </span>
            </Link>

            {/* Desktop Menu */}
            <nav className="hidden md:flex items-center space-x-8">
              {menuItems.map((item) => (
                <div key={item.path} className="relative group">
                  <Link
                    href={item.path}
                    className={`text-sm font-medium transition-colors ${
                      isScrolled || pathname !== "/"
                        ? "text-primary hover:text-accent"
                        : "text-white hover:text-gray-200"
                    }`}
                  >
                    {item.title}
                  </Link>
                  {item.submenu && (
                    <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                      {item.submenu.map((subitem) => (
                        <Link
                          key={subitem.path}
                          href={subitem.path}
                          className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {subitem.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <span
                  className={`w-full h-0.5 transition-all ${
                    isScrolled || pathname !== "/" ? "bg-primary" : "bg-white"
                  } ${isMenuOpen ? "rotate-45 translate-y-2" : ""}`}
                />
                <span
                  className={`w-full h-0.5 transition-all ${
                    isScrolled || pathname !== "/" ? "bg-primary" : "bg-white"
                  } ${isMenuOpen ? "opacity-0" : ""}`}
                />
                <span
                  className={`w-full h-0.5 transition-all ${
                    isScrolled || pathname !== "/" ? "bg-primary" : "bg-white"
                  } ${isMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}
                />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`menu-overlay ${isMenuOpen ? "active" : ""} md:hidden`}
        onClick={() => setIsMenuOpen(false)}
      >
        <div className="flex items-center justify-center h-full">
          <nav className="text-center" onClick={(e) => e.stopPropagation()}>
            {menuItems.map((item) => (
              <div key={item.path} className="mb-8">
                <Link
                  href={item.path}
                  className="text-white text-2xl font-bold block mb-4 hover:text-gray-300 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.title}
                </Link>
                {item.submenu && (
                  <div className="space-y-2">
                    {item.submenu.map((subitem) => (
                      <Link
                        key={subitem.path}
                        href={subitem.path}
                        className="text-gray-400 text-lg block hover:text-white transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {subitem.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}
