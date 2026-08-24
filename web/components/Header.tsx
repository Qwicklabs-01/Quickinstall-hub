import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-[#1a1f26]/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center py-3 gap-3 md:gap-0">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">Q</span>
              </div>
              <span className="text-white font-bold text-xl tracking-tight">QuickInstall Hub</span>
            </Link>
          </div>
          <nav className="flex space-x-6">
            <Link href="/" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
              Browse Apps
            </Link>
            <Link href="/search" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
              Search
            </Link>
            <Link href="/admin" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
              Admin
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
