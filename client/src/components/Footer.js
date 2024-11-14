import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-[#575757] text-[#D9FF05] p-4">
            <div className="flex flex-col sm:flex-row justify-between items-center max-w-7xl mx-auto">
                <div className="text-sm">
                    &copy; 2024 Price Checker. All rights reserved.
                </div>

                <div className="flex space-x-4 mt-2 sm:mt-0">
                    <a href="#about" className="hover:text-white">About Us</a>
                    <a href="#contact" className="hover:text-white">Contact</a>
                    <a href="#privacy" className="hover:text-white">Privacy Policy</a>
                </div>

                <div className="flex space-x-4 mt-2 sm:mt-0">
                    <a href="https://facebook.com" aria-label="Facebook" className="hover:text-white">FB</a>
                    <a href="https://twitter.com" aria-label="Twitter" className="hover:text-white">TW</a>
                    <a href="https://instagram.com" aria-label="Instagram" className="hover:text-white">IG</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
