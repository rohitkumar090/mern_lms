import { GraduationCap, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

function Footer() {
     console.log("FOOTER RENDERED");
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* TOP SECTION */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">

          {/* LOGO + ABOUT */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <GraduationCap className="h-7 w-7 text-white" />
              <h2 className="text-lg font-bold text-white">LMS Learn</h2>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Learn new skills online with expert instructors and
              industry-ready courses.
            </p>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="text-white font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/home" className="hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-white">
                  Courses
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white">
                  Register
                </Link>
              </li>
            </ul>
          </div>

          {/* SUPPORT */}
          <div>
            <h3 className="text-white font-semibold mb-3">Support</h3>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-white cursor-pointer">
                Help Center
              </li>
              <li className="hover:text-white cursor-pointer">
                Privacy Policy
              </li>
              <li className="hover:text-white cursor-pointer">
                Terms & Conditions
              </li>
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="text-white font-semibold mb-3">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Mail size={16} />
                support@lmslearn.com
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} />
                +91 98765 43210
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={16} />
                India
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} LMS Learn. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
