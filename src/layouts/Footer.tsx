// FileName: Footer.tsx
// Path: src/components/layout/Footer.tsx

import React from 'react';

const Footer = () => {
  return (
    <footer className="container mx-auto px-4 sm:px-6 py-8 text-center text-text-muted border-t border-line-light mt-auto">
        <div className="flex justify-center gap-6 text-sm mb-4">
            <a href="#" className="hover:text-primary">About Us</a>
            <a href="#" className="hover:text-primary">Terms of Service</a>
            <a href="#" className="hover:text-primary">Privacy Policy</a>
        </div>
        <p className="mt-2 text-xs text-text-muted">&copy; 2025 Nublink. All Rights Reserved.</p>
    </footer>
  );
};

export default Footer;

