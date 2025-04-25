import { Link } from 'react-router-dom'

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <Link to="/" className="text-2xl font-bold text-gray-800">
                Invoice Generator
              </Link>
            </div>
            <nav className="hidden md:flex space-x-4">
              <Link to="/" className="text-gray-600 hover:text-gray-900">
                Home
              </Link>
              <Link to="/usa-invoice-generator" className="text-gray-600 hover:text-gray-900">
                USA
              </Link>
              <Link to="/canada-invoice-generator" className="text-gray-600 hover:text-gray-900">
                Canada
              </Link>
              <Link to="/uk-invoice-generator" className="text-gray-600 hover:text-gray-900">
                UK
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Ad Banner - Top */}
      <div className="bg-gray-100 text-center py-2 text-sm text-gray-600">
        <div className="max-w-7xl mx-auto px-4">
          {/* Google AdSense will be placed here */}
          Ad Banner Placeholder
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="md:flex md:justify-between">
            <div className="mb-6 md:mb-0">
              <Link to="/" className="text-xl font-bold">
                Invoice Generator
              </Link>
              <p className="mt-2 text-sm text-gray-400">
                Create professional invoices in seconds.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8 md:gap-16">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider">Countries</h3>
                <ul className="mt-4 space-y-2">
                  <li>
                    <Link to="/usa-invoice-generator" className="text-gray-400 hover:text-white">
                      USA
                    </Link>
                  </li>
                  <li>
                    <Link to="/canada-invoice-generator" className="text-gray-400 hover:text-white">
                      Canada
                    </Link>
                  </li>
                  <li>
                    <Link to="/australia-invoice-generator" className="text-gray-400 hover:text-white">
                      Australia
                    </Link>
                  </li>
                  <li>
                    <Link to="/uk-invoice-generator" className="text-gray-400 hover:text-white">
                      UK
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider">Legal</h3>
                <ul className="mt-4 space-y-2">
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white">
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white">
                      Terms of Service
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Invoice Generator. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Ad Banner - Sticky Footer (Mobile Only) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg py-2 text-center md:hidden">
        {/* Google AdSense will be placed here */}
        Mobile Sticky Ad Placeholder
      </div>
    </div>
  )
}

export default Layout
