import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-gray-50 border-t border-gray-200 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand Column */}
                    <div className="space-y-4">
                         <div className="flex items-center gap-2">
                            <span className="font-bold text-xl text-gray-900 tracking-tight">
                                Adda<span className="text-indigo-600">Hub</span>
                            </span>
                        </div>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Connecting people through real-world activities. Find your passion, meet new friends, and create lasting memories.
                        </p>
                        <div className="flex space-x-4 pt-2">
                            <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors"><Facebook className="h-5 w-5" /></a>
                            <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors"><Twitter className="h-5 w-5" /></a>
                            <a href="#" className="text-gray-400 hover:text-pink-600 transition-colors"><Instagram className="h-5 w-5" /></a>
                            <a href="#" className="text-gray-400 hover:text-blue-700 transition-colors"><Linkedin className="h-5 w-5" /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold text-gray-900 tracking-wider uppercase text-sm mb-4">Quick Links</h3>
                        <ul className="space-y-3">
                            <li><Link href="/" className="text-gray-500 hover:text-indigo-600 transition-colors text-sm">Home</Link></li>
                            <li><Link href="/events" className="text-gray-500 hover:text-indigo-600 transition-colors text-sm">Explore Events</Link></li>
                            <li><Link href="/about" className="text-gray-500 hover:text-indigo-600 transition-colors text-sm">About Us</Link></li>
                            <li><Link href="/dashboard" className="text-gray-500 hover:text-indigo-600 transition-colors text-sm">Dashboard</Link></li>
                        </ul>
                    </div>

                     {/* Support */}
                     <div>
                        <h3 className="font-semibold text-gray-900 tracking-wider uppercase text-sm mb-4">Support</h3>
                        <ul className="space-y-3">
                            <li><Link href="/help" className="text-gray-500 hover:text-indigo-600 transition-colors text-sm">Help Center</Link></li>
                            <li><Link href="/terms" className="text-gray-500 hover:text-indigo-600 transition-colors text-sm">Terms of Service</Link></li>
                            <li><Link href="/privacy" className="text-gray-500 hover:text-indigo-600 transition-colors text-sm">Privacy Policy</Link></li>
                            <li><Link href="/help" className="text-gray-500 hover:text-indigo-600 transition-colors text-sm">FAQ</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="font-semibold text-gray-900 tracking-wider uppercase text-sm mb-4">Contact Us</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3 text-gray-500 text-sm">
                                <MapPin className="h-5 w-5 text-indigo-600 flex-shrink-0" />
                                <span>Block: C, Section: 10<br />Mirpur, Dhaka</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-500 text-sm">
                                <Phone className="h-5 w-5 text-indigo-600 flex-shrink-0" />
                                <span>+880 1234 567890</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-500 text-sm">
                                <Mail className="h-5 w-5 text-indigo-600 flex-shrink-0" />
                                <span>support@addahub.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center bg-gray-50">
                    <p className="text-gray-400 text-sm">
                        &copy; 2026 AddaHub. All rights reserved.
                    </p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                         <Link href="/privacy" className="text-gray-400 text-sm hover:text-gray-600">Privacy</Link>
                         <Link href="/terms" className="text-gray-400 text-sm hover:text-gray-600">Terms</Link>
                         <Link href="#" className="text-gray-400 text-sm hover:text-gray-600">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
