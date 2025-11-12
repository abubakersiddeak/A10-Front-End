import {
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Globe,
  Info,
  Mail,
  Leaf,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  const socialLinks = [
    { name: "X (Twitter)", icon: Twitter, url: "#", color: "hover:text-white" },
    {
      name: "Facebook",
      icon: Facebook,
      url: "#",
      color: "hover:text-blue-500",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: "#",
      color: "hover:text-cyan-400",
    },
    {
      name: "Instagram",
      icon: Instagram,
      url: "#",
      color: "hover:text-pink-500",
    },
  ];

  const quickLinks = [
    { name: "About", path: "/about", icon: Info },
    { name: "Contact", path: "/contact", icon: Mail },
    { name: "Accessibility", path: "/accessibility", icon: Globe },
    { name: "Privacy Note", path: "/privacy", icon: Globe },
  ];

  return (
    // Dark background matching the Navbar theme, subtle top border for separation
    <footer className="bg-gray-950 text-gray-400 pt-12 pb-6 px-4 md:px-12 border-t border-green-700/50">
      <div className="max-w-7xl mx-auto">
        {/* Main Content Grid: Structured into three columns */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 border-b border-green-700/30 pb-8 mb-6">
          {/* Column 1 & 2: Brand & Description (Takes two columns on MD+) */}
          <div className="space-y-4 col-span-2">
            <Link to="/" className="flex items-center gap-2">
              {/* Logo - Gradient 'E' emblem (matching Navbar) */}
              <Leaf className="w-8 h-8 text-green-600" />
              <span className="font-extrabold text-2xl tracking-wider text-green-400 transition-colors duration-300">
                EcoTrack
              </span>
            </Link>
            <p className="text-sm pr-4">
              Join the sustainability revolution. Track your impact, discover
              challenges, and contribute to a greener planet.
            </p>
          </div>

          {/* Column 3: Quick Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-green-400">
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="flex items-center gap-2 hover:text-green-300 transition-colors duration-200"
                  >
                    <link.icon size={16} className="text-green-600" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 & 5: Social Media */}
          <div className="col-span-2 md:col-span-2">
            <h3 className="text-lg font-semibold mb-4 text-green-400">
              Connect & Support
            </h3>
            <div className="flex space-x-6">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Follow us on ${link.name}`}
                  className={`text-gray-400 ${link.color} transition-colors duration-300 transform hover:scale-125`}
                >
                  <link.icon size={28} />
                </a>
              ))}
            </div>

            <div className="text-sm mt-6">
              <h4 className="font-semibold text-gray-300 mb-1">Get in Touch</h4>
              <p>
                Email:{" "}
                <a
                  href="mailto:support@ecotrack.com"
                  className="hover:text-green-300 transition-colors"
                >
                  support@ecotrack.com
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section (Copyright) */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm pt-4">
          <p className="order-2 md:order-1 mt-4 md:mt-0 text-gray-500">
            &copy; 2025 EcoTrack. All rights reserved.
          </p>
          {/* Note: Accessibility and Privacy links are already in the main quick links section for better structure */}
        </div>
      </div>
    </footer>
  );
}
