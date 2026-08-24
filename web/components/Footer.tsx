import Link from 'next/link';

export default function Footer() {
  const features = [
    { icon: '⚡', title: 'Silent Installation', desc: 'No manual clicking next/next. Apps install automatically in the background.' },
    { icon: '🛡️', title: 'SHA-256 Verified', desc: 'Every download payload is checksum-verified before running.' },
    { icon: '🚫', title: 'Zero Bloatware', desc: '100% clean installers straight from official sources, no extra toolbars.' },
    { icon: '🔐', title: 'Ed25519 Signed', desc: 'All manifests are cryptographically signed to prevent tampering.' },
  ];

  return (
    <footer className="border-t border-gray-800/80 bg-[#080b13] text-gray-400 py-12 mt-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Value Prop Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 border-b border-gray-800/60 mb-12">
          {features.map((feat) => (
            <div key={feat.title} className="flex items-start gap-3.5 p-4 rounded-xl bg-gray-900/40 border border-gray-800/60">
              <span className="text-2xl shrink-0">{feat.icon}</span>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">{feat.title}</h4>
                <p className="text-xs text-gray-400 leading-relaxed">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Navigation */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-sm">
              Q
            </div>
            <span className="text-sm font-bold text-white tracking-tight">QuickInstall Hub</span>
            <span className="text-xs text-gray-500">• 100% Free & Open Source</span>
          </div>

          <div className="flex items-center gap-6 text-xs text-gray-400">
            <Link href="/" className="hover:text-white transition-colors">Browse Apps</Link>
            <Link href="/search" className="hover:text-white transition-colors">Search</Link>
            <Link href="/admin" className="hover:text-white transition-colors">Admin</Link>
            <a
              href="https://github.com/Qwicklabs-01/Quickinstall-hub"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <span>GitHub</span>
              <span>↗</span>
            </a>
          </div>
        </div>

        <div className="mt-8 text-center text-[11px] text-gray-600">
          © {new Date().getFullYear()} QuickInstall Hub. Built with Next.js, FastAPI & Rust/Python Agent.
        </div>
      </div>
    </footer>
  );
}
