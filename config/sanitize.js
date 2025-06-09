import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

/**
 * @param {string} dirty - Raw HTML input from the user.
 * @returns {string} Clean and safe HTML content.
 */
export const sanitizeHtmlContent = (dirty = '') => {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      'ul', 'ol', 'li',
      'section', 'article', 'div',
      'h2', 'h3', 'p', 'span',
      'code', 'em', 'i', 'strong', 'b',
      'br', 'a', 'time', 'sub', 'sup'
    ],
    ALLOWED_ATTR: ['href']
  });
};
