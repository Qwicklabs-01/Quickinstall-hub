'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Browse Software' },
    { href: '/search', label: 'Search' },
    { href: '/admin', label: 'Catalog Manager' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-800/80 bg-[#0b0f19]/80 backdrop-blur-xl transition-all">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link href="/" className="group flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 shadow-lg shadow-blue-500/20 transition-all duration-300 group-hover:scale-105 group-hover:shadow-blue-500/40">
                <span className="text-xl font-black text-white">Q</span>
                <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors">
                  QuickInstall <span className="text-blue-500">Hub</span>
                </span>
                <span className="text-[10px] font-medium text-gray-400 tracking-wider uppercase -mt-1">
                  Windows App Suite
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'text-white bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-sm'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions / GitHub link */}
          <div className="flex items-center gap-3">
            <Link
              href="/search"
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-900/80 border border-gray-800 text-xs text-gray-400 hover:border-gray-700 hover:text-gray-300 transition-all"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Quick Search...</span>
              <kbd className="px-1.5 py-0.5 rounded bg-gray-800 text-[10px] text-gray-400 border border-gray-700">Ctrl+K</kbd>
            </Link>

            <a
              href="https://github.com/Qwicklabs-01/Quickinstall-hub"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800/80 hover:bg-gray-700 border border-gray-700/80 text-xs font-semibold text-gray-200 transition-all shadow-sm hover:scale-105"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
