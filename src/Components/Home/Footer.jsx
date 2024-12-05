import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-16 select-none">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">About LuxSpaces</h3>
            <p className="text-sm text-gray-400">
              LuxSpaces offers a curated collection of luxury furniture and home decor items designed to elevate your living spaces. Discover the perfect pieces for your home with us.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Support</h3>
            <ul>
              <li className="text-gray-400">Help & FAQs</li>
              <li className="text-gray-400">Shipping Info</li>
              <li className="text-gray-400">Returns & Exchanges</li>
              <li className="text-gray-400">Contact Us</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul>
              <li className="text-gray-400">Privacy Policy</li>
              <li className="text-gray-400">Terms & Conditions</li>
              <li className="text-gray-400">Careers</li>
              <li className="text-gray-400">Sitemap</li>
            </ul>
          </div>

          
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="">
              <span className="text-gray-400">Facebook</span><br />
              <span className="text-gray-400">Instagram</span><br />
              <span className="text-gray-400">Twitter</span><br />
              <span className="text-gray-400">YouTube</span><br />
            </div>
          </div>

        </div>
        
       
        <div className="mt-8 border-t border-gray-700 pt-6 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} LuxSpaces. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

