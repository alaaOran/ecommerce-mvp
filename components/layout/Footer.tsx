import Link from 'next/link'
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react'

const Footer = () => {
  const footerSections = [
    {
      title: 'Shop',
      links: [
        { name: 'New Arrivals', href: '/new-arrivals' },
        { name: 'Men', href: '/category/men' },
        { name: 'Women', href: '/category/women' },
        { name: 'Kids', href: '/category/kids' },
        { name: 'Sale', href: '/sale' },
      ]
    },
    {
      title: 'Customer Service',
      links: [
        { name: 'Contact Us', href: '/contact' },
        { name: 'Size Guide', href: '/size-guide' },
        { name: 'Shipping & Returns', href: '/shipping-returns' },
        { name: 'FAQ', href: '/faq' },
        { name: 'Track Order', href: '/track-order' },
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Careers', href: '/careers' },
        { name: 'Press', href: '/press' },
        { name: 'Sustainability', href: '/sustainability' },
        { name: 'Privacy Policy', href: '/privacy' },
      ]
    }
  ]

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: Youtube, href: 'https://youtube.com', label: 'YouTube' },
  ]

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter */}
        <div className="py-12 border-b border-gray-800">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Stay In Style</h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              Subscribe to get special offers, trend updates, and exclusive previews
            </p>
            <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent text-white placeholder-gray-400"
              />
              <button className="px-6 py-3 bg-white text-black font-medium rounded-lg hover:bg-gray-100 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">StyleHub</h2>
            <p className="text-gray-400 mb-6">
              Premium fashion for the modern lifestyle. Quality, style, and comfort in every piece.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div className="py-6 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; 2024 StyleHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer