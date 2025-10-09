// server/utils/linkVerifier.js

const axios = require('axios');

// --- 1. Trusted Platforms Whitelist ---
const TRUSTED_DOMAINS = [
    { name: 'Amazon', regex: /^(https?:\/\/)?(www\.)?amazon\.[a-z\.]{2,6}\/.+/i },
    { name: 'Flipkart', regex: /^(https?:\/\/)?(www\.)?flipkart\.com\/.+/i },
    // Add other trusted e-commerce platforms here as needed
];

/**
 * Performs multi-stage validation on a purchase link.
 * @param {string} url The URL submitted by the user.
 * @returns {object} { isValid: boolean, source: string, error: string }
 */
const verifyLink = async (url) => {
    // --- A. Basic URL Format Check (Already done client-side, but good server practice) ---
    try {
        new URL(url);
    } catch (e) {
        return { isValid: false, source: null, error: 'Invalid URL format.' };
    }

    let sourceName = null;
    let finalUrl = url;

    // --- B. Trusted Domain Check ---
    const trustedPlatform = TRUSTED_DOMAINS.find(platform => platform.regex.test(url));

    if (trustedPlatform) {
        sourceName = trustedPlatform.name;
    } else {
        // Block upload if the domain is not trusted
        return { 
            isValid: false, 
            source: 'Other', 
            error: `Link must be from a trusted platform like Amazon or Flipkart.` 
        };
    }

    // --- C. Real/Safe Link Check (HTTP Request) ---
    try {
        const response = await axios.head(url, {
            // Set a short timeout to prevent hanging on unresponsive links
            timeout: 5000, 
            // Crucially, disable automatic redirects initially to check the *original* URL's status
            maxRedirects: 0, 
            validateStatus: (status) => {
                // Accept 2xx (Success) and 3xx (Redirection) status codes
                return status >= 200 && status < 400; 
            },
        });

        // If the status is 3xx (Redirection), we follow it to ensure it lands on a trusted page
        if (response.status >= 300 && response.status < 400) {
            // The final URL is usually in the 'location' header
            finalUrl = response.headers.location || url; 

            // Re-check if the redirect destination is still a trusted domain
            const finalTrusted = TRUSTED_DOMAINS.some(p => p.regex.test(finalUrl));
            if (!finalTrusted) {
                 return { 
                    isValid: false, 
                    source: sourceName, 
                    error: 'Link redirected to an untrusted domain.' 
                };
            }

            // Now, send a GET request to the final URL to ensure it is live (optional but robust)
            await axios.get(finalUrl, { timeout: 5000 });
        }

        // If all checks pass
        return { isValid: true, source: sourceName, error: null };

    } catch (error) {
        // Catch network errors (timeout, DNS failure) or 4xx/5xx status codes
        const status = error.response ? error.response.status : 'Network Error';
        return { 
            isValid: false, 
            source: sourceName, 
            error: `Link verification failed (Status: ${status}). Could not find a live product page or resource.` 
        };
    }
};

module.exports = verifyLink;