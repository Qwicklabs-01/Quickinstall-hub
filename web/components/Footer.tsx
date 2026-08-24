import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#1a1f26] text-gray-300 py-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Download Software */}
          <div>
            <h3 className="text-white font-semibold mb-4">Download Software</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/windows" className="hover:text-white transition-colors text-sm">
                  Windows
                </Link>
              </li>
              <li>
                <Link href="/mac" className="hover:text-white transition-colors text-sm">
                  Mac
                </Link>
              </li>
              <li>
                <Link href="/android" className="hover:text-white transition-colors text-sm">
                  Android APK
                </Link>
              </li>
            </ul>
          </div>

          {/* Download Operating Systems */}
          <div>
            <h3 className="text-white font-semibold mb-4">Download Operating Systems</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/os/windows-11" className="hover:text-white transition-colors text-sm">
                  Windows 11
                </Link>
              </li>
              <li>
                <Link href="/os/windows-10" className="hover:text-white transition-colors text-sm">
                  Windows 10
                </Link>
              </li>
              <li>
                <Link href="/os/windows-8" className="hover:text-white transition-colors text-sm">
                  Windows 8
                </Link>
              </li>
              <li>
                <Link href="/os/windows-7" className="hover:text-white transition-colors text-sm">
                  Windows 7
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Center */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support Center</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/faqs" className="hover:text-white transition-colors text-sm">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors text-sm">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/submit" className="hover:text-white transition-colors text-sm">
                  Software Submission
                </Link>
              </li>
              <li>
                <Link href="/request" className="hover:text-white transition-colors text-sm">
                  Software Request
                </Link>
              </li>
            </ul>
          </div>

          {/* Common Issues */}
          <div>
            <h3 className="text-white font-semibold mb-4">Common Issues</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/issues/ad-blocker" className="hover:text-white transition-colors text-sm">
                  Ad Blocker
                </Link>
              </li>
              <li>
                <Link href="/issues/how-to-download" className="hover:text-white transition-colors text-sm">
                  How To Download
                </Link>
              </li>
              <li>
                <Link href="/issues/zip-password" className="hover:text-white transition-colors text-sm">
                  Zip Password
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
