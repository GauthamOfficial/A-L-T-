import Link from 'next/link';
import { BookOpen, Upload, Search, Download } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BookOpen className="h-8 w-8 text-primary-600" />
              <h1 className="text-2xl font-bold text-gray-900">A/L நோTස්</h1>
            </div>
            <nav className="flex items-center space-x-4">
              <Link
                href="/browse"
                className="text-gray-700 hover:text-primary-600 font-medium px-4 py-2 rounded-lg hover:bg-primary-50 transition-colors"
              >
                Browse Notes
              </Link>
              <Link
                href="/upload"
                className="btn-primary"
              >
                Upload Notes
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
        <div className="text-center">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            SL Student Relief
          </h2>
          <p className="text-xl sm:text-2xl text-gray-600 mb-4 max-w-3xl mx-auto">
            Free study notes for flood-affected G.C.E. A/L students in Sri Lanka
          </p>
          <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto">
            Access comprehensive study materials across all streams, subjects, and mediums. 
            Contributed by teachers and university students to help you succeed.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link href="/browse" className="btn-primary w-full sm:w-auto flex items-center justify-center space-x-2">
              <Search className="h-5 w-5" />
              <span>Browse Notes</span>
            </Link>
            <Link href="/upload" className="btn-secondary w-full sm:w-auto flex items-center justify-center space-x-2">
              <Upload className="h-5 w-5" />
              <span>Contribute Notes</span>
            </Link>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="card text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Search</h3>
              <p className="text-gray-600">
                Find notes by stream, subject, and medium. No login required.
              </p>
            </div>

            <div className="card text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Free Downloads</h3>
              <p className="text-gray-600">
                All notes are completely free. Download as many as you need.
              </p>
            </div>

            <div className="card text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Upload</h3>
              <p className="text-gray-600">
                Teachers and students can contribute notes via Google login.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-600">
            © 2025 A/L நோTස් - Helping students recover from natural disasters
          </p>
        </div>
      </footer>
    </div>
  );
}

