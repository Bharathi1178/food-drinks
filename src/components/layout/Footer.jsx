import React from 'react';
import { Link } from 'react-router-dom';
import {
  Flame,
  Phone,
  Mail,
  MapPin,
  Heart,
  ArrowUpRight,
  ShieldCheck,
  Clock,
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#07090e] border-t border-slate-800 text-slate-400 text-xs select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/menu" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 flex items-center justify-center text-slate-950 shadow-md">
                <Flame className="w-5 h-5 text-slate-950 fill-slate-950" />
              </div>
              <div>
                <span className="font-black text-white text-2xl tracking-tight leading-none block">
                  BiteCraze
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-400/90 block mt-0.5">
                  ARTISAN KITCHEN & DINING
                </span>
              </div>
            </Link>

            <p className="text-slate-400 leading-relaxed text-xs max-w-sm">
              Crafting unforgettable culinary memories. Handcrafted gourmet fast food, rich traditional dum biryanis, authentic curries, and stone-baked pizzas delivered sizzling hot to your door.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="#instagram"
                className="w-8 h-8 rounded-xl bg-slate-900 hover:bg-amber-500 hover:text-slate-950 border border-slate-800 flex items-center justify-center text-slate-400 transition-all"
                title="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="#facebook"
                className="w-8 h-8 rounded-xl bg-slate-900 hover:bg-amber-500 hover:text-slate-950 border border-slate-800 flex items-center justify-center text-slate-400 transition-all"
                title="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.597 0 9 1.583 9 4.615V8z"/>
                </svg>
              </a>
              <a
                href="#twitter"
                className="w-8 h-8 rounded-xl bg-slate-900 hover:bg-amber-500 hover:text-slate-950 border border-slate-800 flex items-center justify-center text-slate-400 transition-all"
                title="Twitter"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2: Company */}
          <div className="space-y-3">
            <h4 className="font-black text-white text-xs uppercase tracking-wider text-amber-400">
              Company
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <a href="#about" className="hover:text-amber-400 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#kitchens" className="hover:text-amber-400 transition-colors">
                  Our Cloud Kitchens
                </a>
              </li>
              <li>
                <a href="#careers" className="hover:text-amber-400 transition-colors">
                  Careers & Culture
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-amber-400 transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-amber-400 transition-colors">
                  Director Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Support */}
          <div className="space-y-3">
            <h4 className="font-black text-white text-xs uppercase tracking-wider text-amber-400">
              Customer Support
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link to="/orders" className="hover:text-amber-400 transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <a href="#help" className="hover:text-amber-400 transition-colors">
                  Help & FAQs
                </a>
              </li>
              <li>
                <a href="#delivery" className="hover:text-amber-400 transition-colors">
                  Delivery Coverage
                </a>
              </li>
              <li>
                <a href="#hygiene" className="hover:text-amber-400 transition-colors">
                  Kitchen Hygiene Standards
                </a>
              </li>
              <li>
                <a href="#safety" className="hover:text-amber-400 transition-colors">
                  Safe Packaging Promise
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal & Contact */}
          <div className="space-y-3">
            <h4 className="font-black text-white text-xs uppercase tracking-wider text-amber-400">
              Legal & Direct
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <a href="#privacy" className="hover:text-amber-400 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms" className="hover:text-amber-400 transition-colors">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#refund" className="hover:text-amber-400 transition-colors">
                  Refund & Cancellation
                </a>
              </li>
              <li className="pt-2 text-slate-500 font-mono text-[11px]">
                Support: +91 98765 43210
              </li>
              <li className="text-slate-500 text-[11px]">
                kitchen@bitecraze.com
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
          <p>© {new Date().getFullYear()} BiteCraze Artisan Kitchen & Dining. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Designed for passionate food lovers</span>
            <span className="w-1 h-1 rounded-full bg-slate-700" />
            <span className="text-amber-400">Hot • Fresh • Fast</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
