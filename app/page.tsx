import Link from 'next/link';
import { BookOpen, Upload, Search, Download, Heart, Users } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-blue via-bg-soft to-white">
      {/* Header - Sticky */}
      <header className="bg-white/80 backdrop-blur-sm shadow-soft border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3 group">
              <BookOpen className="h-8 w-8 text-text-primary group-hover:text-text-primary transition-colors" />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-text-primary font-display">A/L நோTස්</h1>
                <p className="text-xs text-text-secondary hidden sm:block">SL Student Relief</p>
              </div>
            </Link>
            <nav className="flex items-center space-x-2 sm:space-x-4">
              <Link
                href="/browse"
                className="text-text-secondary hover:text-primary-500 font-medium px-3 sm:px-4 py-2 rounded-full hover:bg-primary-50 transition-all duration-200 text-sm sm:text-base"
              >
                Browse
              </Link>
              <Link
                href="/upload"
                className="btn-primary flex items-center justify-center space-x-2"
              >
                <Upload className="h-4 w-4" />
                <span>Upload Notes</span>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
        <div className="text-center animate-fade-in">
          {/* Decorative elements */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-accent-400/20 rounded-full blur-2xl"></div>
              <Heart className="h-12 w-12 sm:h-16 sm:w-16 text-orange-400 relative z-10 animate-pulse" fill="currentColor" />
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary mb-6 font-display leading-tight">
            SL Student Relief
          </h1>
          <p className="text-xl sm:text-2xl text-text-primary mb-4 max-w-3xl mx-auto font-medium">
            Free study notes for flood-affected G.C.E. A/L students in Sri Lanka
          </p>
          <p className="text-base sm:text-lg text-text-secondary mb-12 max-w-2xl mx-auto leading-relaxed">
            Access comprehensive study materials across all streams, subjects, and mediums. 
            Contributed by teachers and university students to help you succeed.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link href="/browse" className="btn-primary w-full sm:w-auto flex items-center justify-center space-x-2 min-w-[200px]">
              <Search className="h-5 w-5" />
              <span>Browse Notes</span>
            </Link>
            <Link href="/upload" className="btn-accent w-full sm:w-auto flex items-center justify-center space-x-2 min-w-[200px]">
              <Upload className="h-5 w-5" />
              <span>Contribute Notes</span>
            </Link>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mt-16">
            <div className="card text-center hover:scale-[1.02] transition-transform duration-200">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-soft">
                <Search className="h-8 w-8 text-primary-500" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-2 font-display">Easy Search</h3>
              <p className="text-text-secondary text-sm sm:text-base">
                Find notes by stream, subject, and medium. No login required.
              </p>
            </div>

            <div className="card text-center hover:scale-[1.02] transition-transform duration-200">
              <div className="bg-accent-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-soft">
                <Download className="h-8 w-8 text-accent-600" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-2 font-display">Free Downloads</h3>
              <p className="text-text-secondary text-sm sm:text-base">
                All notes are completely free. Download as many as you need.
              </p>
            </div>

            <div className="card text-center hover:scale-[1.02] transition-transform duration-200">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-soft">
                <Users className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-2 font-display">Community Help</h3>
              <p className="text-text-secondary text-sm sm:text-base">
                Teachers and students can contribute notes via Google login.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer - Minimal */}
      <footer className="bg-white/60 backdrop-blur-sm border-t border-gray-100 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-text-secondary text-sm">
            © 2025 A/L நோTස් - Helping students recover from natural disasters
          </p>
        </div>
      </footer>
    </div>
  );
}

