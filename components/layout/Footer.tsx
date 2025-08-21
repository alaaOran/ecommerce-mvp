import Link from 'next/link';
import { Instagram, Twitter, Facebook, Youtube } from 'lucide-react';

const socialLinks = [
  { name: 'Instagram', icon: Instagram, href: '#' },
  { name: 'Twitter', icon: Twitter, href: '#' },
  { name: 'Facebook', icon: Facebook, href: '#' },
  { name: 'YouTube', icon: Youtube, href: '#' },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center space-y-4">
          {/* Social Media Icons */}
          <div className="flex space-x-6">
            {socialLinks.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label={item.name}
                >
                  <Icon className="h-5 w-5" />
                </a>
              );
            })}
          </div>
          
          {/* Copyright and Powered By */}
          <div className="text-center space-y-1">
            <p className="text-gray-400 text-xs">
              © {currentYear} StyleHub. All rights reserved.
            </p>
            <p className="text-gray-500 text-xs">
              powered by alaa
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
