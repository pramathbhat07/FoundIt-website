import React from "react";
import { Link } from "react-router-dom";
import { Package, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-500">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4 col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 text-white">
              <Package className="h-6 w-6 text-indigo-600" />
              <span className="text-xl font-bold tracking-tight">FoundIt.</span>
            </Link>
            <p className="text-sm text-gray-500 max-w-xs">
              A community-driven platform to report, search, and recover lost
              items securely and efficiently.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wider text-gray-500 uppercase mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/lost" className="hover:text-white transition-colors">
                  Search Lost Items
                </Link>
              </li>
              <li>
                <Link
                  to="/found"
                  className="hover:text-white transition-colors"
                >
                  Search Found Items
                </Link>
              </li>
              <li>
                <Link
                  to="/report-lost"
                  className="hover:text-white transition-colors"
                >
                  Report Lost
                </Link>
              </li>
              <li>
                <Link
                  to="/report-found"
                  className="hover:text-white transition-colors"
                >
                  Report Found
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wider text-gray-500 uppercase mb-4">
              Legal
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/privacy-policy"
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms-of-service"
                  className="hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/cookie-policy"
                  className="hover:text-white transition-colors"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wider text-gray-500 uppercase mb-4">
              Contact
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span>BMS College Of Engineering</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span>+91 9448264286</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span>kspramath.ec25@bmsce.ac.in</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} FoundIt Platform. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
