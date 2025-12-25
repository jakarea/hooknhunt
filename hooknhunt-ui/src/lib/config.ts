export const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

/**
 * Transform media URLs from backend to use the configured API_URL
 * Replaces hardcoded localhost:8000 or any other hardcoded domain
 */
export function transformMediaUrl(url: string | undefined | null): string {
  if (!url) return '';

  // If URL is already relative (starts with /), return as-is
  if (url.startsWith('/')) return url;

  // If URL doesn't start with http, it's a relative path
  if (!url.startsWith('http')) return url;

  try {
    const urlObj = new URL(url);
    // Replace the hostname and port with the configured API_URL
    const apiBaseUrl = new URL(API_URL);
    urlObj.protocol = apiBaseUrl.protocol;
    urlObj.host = apiBaseUrl.host;
    return urlObj.toString();
  } catch {
    // If URL parsing fails, return original
    return url;
  }
}
