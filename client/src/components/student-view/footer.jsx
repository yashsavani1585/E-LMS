import { Link } from "react-router-dom";
import { School, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

function StudentViewCommonFooter() {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <Link to="/home" className="flex items-center">
              <School className="h-8 w-8 mr-2 text-blue-600" />
              <span className="font-extrabold text-xl">BRAINBOOST</span>
            </Link>
            <p className="text-sm text-gray-400">
              Empowering learners with the best online courses.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/courses" className="text-sm text-gray-400 hover:text-white">
                  Explore Courses
                </Link>
              </li>
              <li>
                <Link to="/student-courses" className="text-sm text-gray-400 hover:text-white">
                  My Courses
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-gray-400 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-gray-400 hover:text-white">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media Links */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                // href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a
                // href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white"
              >
                <Twitter className="h-6 w-6" />
              </a>
              <a
                // href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a
                // href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white"
              >
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg">Contact Info</h3>
            <p className="text-sm text-gray-400">Email: support@brainboost.com</p>
            <p className="text-sm text-gray-400">Phone: +91 9909288061</p>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} BRAINBOOST. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default StudentViewCommonFooter;