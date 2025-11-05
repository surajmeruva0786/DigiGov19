import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Youtube, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const quickLinks = [
    { label: 'About Us', page: 'home' },
    { label: 'Services', page: 'home' },
    { label: 'Contact', page: 'home' },
    { label: 'Help Center', page: 'home' },
  ];

  const services = [
    { label: 'Digital ID', page: 'digital-id' },
    { label: 'Education', page: 'education' },
    { label: 'Healthcare', page: 'health' },
    { label: 'Feedback', page: 'feedback' },
  ];

  const legal = [
    { label: 'Privacy Policy', page: 'home' },
    { label: 'Terms of Service', page: 'home' },
    { label: 'Accessibility', page: 'home' },
    { label: 'Data Protection', page: 'home' },
  ];

  const socialLinks = [
    { icon: Facebook, label: 'Facebook' },
    { icon: Twitter, label: 'Twitter' },
    { icon: Linkedin, label: 'LinkedIn' },
    { icon: Youtube, label: 'YouTube' },
  ];

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-gray-300 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="grid-pattern" />
      </div>

      {/* Glow effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center mb-4 group cursor-pointer" onClick={() => onNavigate('home')}>
              <motion.div
                className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                }}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Sparkles className="w-5 h-5 text-white" />
              </motion.div>
              <span className="ml-3 text-white gradient-text">DigiGov</span>
            </div>
            <p className="text-sm mb-6 text-gray-400">
              Your trusted digital government platform providing seamless access to public services.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social, index) => (
                <motion.button
                  key={social.label}
                  className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors group"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <social.icon className="w-4 h-4 text-gray-400 group-hover:text-blue-400 transition-colors" />
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <motion.li
                  key={link.label}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <button
                    onClick={() => onNavigate(link.page)}
                    className="text-sm text-gray-400 hover:text-blue-400 transition-colors inline-flex items-center group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform inline-block">
                      {link.label}
                    </span>
                  </button>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-white mb-4">Services</h3>
            <ul className="space-y-2">
              {services.map((link, index) => (
                <motion.li
                  key={link.label}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                >
                  <button
                    onClick={() => onNavigate(link.page)}
                    className="text-sm text-gray-400 hover:text-blue-400 transition-colors inline-flex items-center group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform inline-block">
                      {link.label}
                    </span>
                  </button>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-white mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start group">
                <Mail className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5 text-gray-400 group-hover:text-blue-400 transition-colors" />
                <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">support@digigov.gov</span>
              </li>
              <li className="flex items-start group">
                <Phone className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5 text-gray-400 group-hover:text-blue-400 transition-colors" />
                <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">1-800-DIGIGOV</span>
              </li>
              <li className="flex items-start group">
                <MapPin className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5 text-gray-400 group-hover:text-blue-400 transition-colors" />
                <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">123 Government Plaza<br />Capital City, ST 12345</span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Legal Links */}
        <motion.div
          className="mt-12 pt-8 border-t border-gray-800/50"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap justify-center gap-6">
              {legal.map((link, index) => (
                <motion.button
                  key={link.label}
                  onClick={() => onNavigate(link.page)}
                  className="text-sm text-gray-400 hover:text-blue-400 transition-colors"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                  whileHover={{ y: -2 }}
                >
                  {link.label}
                </motion.button>
              ))}
            </div>
            <p className="text-sm text-gray-400">
              © 2025 DigiGov. All rights reserved.
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
