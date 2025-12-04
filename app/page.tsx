import Link from 'next/link';
import { BookOpen, Upload, Search, Download, Heart, Users } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-blue/80 via-bg-soft/80 to-white/80 dark:from-gray-900/80 dark:via-gray-800/80 dark:to-gray-900/80">
      {/* Header - Sticky */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-soft border-b border-gray-100 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3 group">
              <BookOpen className="h-8 w-8 text-text-primary dark:text-gray-100 group-hover:text-text-primary dark:group-hover:text-gray-100 transition-colors" />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-text-primary dark:text-gray-100 font-display">A/L நோTස්</h1>
                <p className="text-xs text-text-secondary dark:text-gray-400 hidden sm:block">SL Student Relief</p>
              </div>
            </Link>
            <nav className="flex items-center space-x-2 sm:space-x-4">
              <ThemeToggle />
              <Link
                href="/browse"
                className="text-text-secondary dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 font-medium px-3 sm:px-4 py-2 rounded-full hover:bg-primary-50 dark:hover:bg-gray-700 transition-all duration-200 text-sm sm:text-base"
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
              <Heart className="h-12 w-12 sm:h-16 sm:w-16 text-orange-400 dark:text-orange-500 relative z-10 animate-pulse" fill="currentColor" />
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary dark:text-gray-100 mb-6 font-display leading-tight">
            SL Student Relief
          </h1>
          <p className="text-xl sm:text-2xl text-text-primary dark:text-gray-100 mb-4 max-w-3xl mx-auto font-medium">
            Free study notes for flood-affected G.C.E. A/L students in Sri Lanka
          </p>
          <p className="text-base sm:text-lg text-text-secondary dark:text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
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
              <div className="bg-primary-100 dark:bg-primary-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-soft">
                <Search className="h-8 w-8 text-primary-500 dark:text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary dark:text-gray-100 mb-2 font-display">Easy Search</h3>
              <p className="text-text-secondary dark:text-gray-300 text-sm sm:text-base">
                Find notes by stream, subject, and medium. No login required.
              </p>
            </div>

            <div className="card text-center hover:scale-[1.02] transition-transform duration-200">
              <div className="bg-accent-100 dark:bg-accent-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-soft">
                <Download className="h-8 w-8 text-accent-600 dark:text-accent-400" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary dark:text-gray-100 mb-2 font-display">Free Downloads</h3>
              <p className="text-text-secondary dark:text-gray-300 text-sm sm:text-base">
                All notes are completely free. Download as many as you need.
              </p>
            </div>

            <div className="card text-center hover:scale-[1.02] transition-transform duration-200">
              <div className="bg-orange-100 dark:bg-orange-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-soft">
                <Users className="h-8 w-8 text-orange-500 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary dark:text-gray-100 mb-2 font-display">Community Help</h3>
              <p className="text-text-secondary dark:text-gray-300 text-sm sm:text-base">
                Teachers and students can contribute notes via Google login.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer - Minimal */}
      <footer className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-t border-gray-100 dark:border-gray-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-text-secondary dark:text-gray-400 text-sm">
            © 2025 A/L நோTස් - Helping students recover from natural disasters
          </p>
        </div>
      </footer>
    </div>
  );
}

