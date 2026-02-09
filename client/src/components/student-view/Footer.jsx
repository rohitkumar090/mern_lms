import { GraduationCap, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-[#0f172a] text-gray-300">
      <div className="max-w-[1420px] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <GraduationCap className="h-7 w-7 text-indigo-400" />
              <h2 className="text-lg font-bold text-white">LMS Learn</h2>
            </div>
            <p className="text-sm text-gray-400">
              Learn new skills online with expert instructors and
              industry-ready courses.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {["Home", "Courses", "Login", "Register"].map((item) => (
                <li key={item}>
                  <Link
                    to={`/${item.toLowerCase()}`}
                    className="hover:text-indigo-400"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">Support</h3>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-indigo-400 cursor-pointer">
                Help Center
              </li>
              <li className="hover:text-indigo-400 cursor-pointer">
                Privacy Policy
              </li>
              <li className="hover:text-indigo-400 cursor-pointer">
                Terms & Conditions
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Mail size={16} /> rohitkumar198281@gmail.com
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} /> +91 111111111111
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={16} /> India
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} LMS Learn. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
