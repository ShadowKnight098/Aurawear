import { useEffect } from 'react';

/**
 * Custom React hook to dynamically update document head metadata for search engine indexing.
 * @param {Object} seoOptions - The title, description, and keywords for the current view.
 */
export const useDocumentSEO = ({ title, description, keywords }) => {
  useEffect(() => {
    // 1. Title Updates
    if (title) {
      const formattedTitle = `${title} | Aura Wear`;
      document.title = formattedTitle;
      
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute('content', formattedTitle);
      
      const twitterTitle = document.querySelector('meta[property="twitter:title"]');
      if (twitterTitle) twitterTitle.setAttribute('content', formattedTitle);
    }

    // 2. Meta Description Updates
    if (description) {
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', description);
      }
      
      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', description);
      
      const twitterDesc = document.querySelector('meta[property="twitter:description"]');
      if (twitterDesc) twitterDesc.setAttribute('content', description);
    }

    // 3. Meta Keywords Updates
    if (keywords) {
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) {
        metaKeywords.setAttribute('content', keywords);
      }
    }
  }, [title, description, keywords]);
};
