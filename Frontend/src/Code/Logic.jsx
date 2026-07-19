import React, { useState } from 'react';
import { Copy, ExternalLink, BarChart3, Zap } from 'lucide-react';
import Header from './Header';
import Navigation from './Navigation';
import Footer from './Footer';

const Logic = () => {
  const [isAdmin, setIsAdmin] = useState(false); // permanent role
const [showAdminView, setShowAdminView] = useState(false);
  const [longUrl, setLongUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState([]);

  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://source-1-5u78.onrender.com';

  // URL validation function
  const validateUrl = (url) => {
    try {
      const trimmedUrl = url.trim();
      if (!trimmedUrl) return false;
      
      let urlToValidate = trimmedUrl;
      if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
        urlToValidate = 'https://' + trimmedUrl;
      }
      
      const urlObj = new URL(urlToValidate);
      return ['http:', 'https:'].includes(urlObj.protocol);
    } catch (error) {
      return false;
    }
  };

  // Copy to clipboard function
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Reset form function
  const resetForm = () => {
    setLongUrl('');
    setCustomCode('');
    setShortUrl('');
    setError('');
    setCopied(false);
  };

  // Shorten URL function
  const shortenUrl = async () => {
    if (!longUrl.trim()) {
      setError('Please enter a URL');
      return;
    }

    if (!validateUrl(longUrl)) {
      setError('Please enter a valid URL');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // Add protocol if missing
      let urlToSubmit = longUrl.trim();
      if (!urlToSubmit.startsWith('http://') && !urlToSubmit.startsWith('https://')) {
        urlToSubmit = 'https://' + urlToSubmit;
      }

      const response = await fetch(`${API_BASE}/shorten`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ originalUrl: urlToSubmit, customCode }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to shorten URL');
      }

      const data = await response.json();
      setShortUrl(`${API_BASE}/${data.data.shortUrl}`);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch analytics/stats data
  const fetchStats = async () => {
    try {
      setLoading(true);
      console.log('Fetching analytics data...');
      
      const response = await fetch(`${API_BASE}/admin/stats`);
      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }
      
      const data = await response.json();
      console.log('Stats data received:', data);
      
      setStats(data.urls || []);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
       
        <Navigation
  isAdmin={isAdmin}
  showAdminView={showAdminView}
  setShowAdminView={setShowAdminView}
  fetchStats={fetchStats}
/>

        {!showAdminView ? (
          /* URL Shortener Form */
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-blue-100 mb-2">
                    Enter your long URL
                  </label>
                  <input
                    type="url"
                    value={longUrl}
                    onChange={(e) => setLongUrl(e.target.value)}
                    placeholder="https://www.example.com/some/very/long/path"
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                    disabled={loading}
                    onKeyDown={(e) => e.key === 'Enter' && !loading && shortenUrl()}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-100 mb-2 mt-4">
                    Custom Code (optional)
                  </label>
                  <input
                    type="text"
                    value={customCode}
                    onChange={(e) => setCustomCode(e.target.value)}
                    placeholder="my-custom-link"
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                    disabled={loading}
                    onKeyDown={(e) => e.key === 'Enter' && !loading && shortenUrl()}
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">
                    {error}
                  </div>
                )}

                <button
                  onClick={shortenUrl}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Shortening...
                    </div>
                  ) : (
                    'Shorten URL'
                  )}
                </button>
              </div>

              {shortUrl && (
                <div className="mt-8 p-6 bg-green-500/20 border border-green-500/50 rounded-xl">
                  <h3 className="text-lg font-semibold text-green-200 mb-3">Your shortened URL:</h3>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={shortUrl}
                      readOnly
                      className="flex-1 px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white"
                    />
                    <button
                      onClick={copyToClipboard}
                      className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition-colors duration-200"
                      title="Copy to clipboard"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <a
                      href={shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors duration-200"
                      title="Open in new tab"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                  {copied && (
                    <p className="text-green-300 text-sm mt-2">✓ Copied to clipboard!</p>
                  )}
                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={resetForm}
                      className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                    >
                      Shorten Another
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Admin Analytics Panel */
          <div className="max-w-6xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-6">URL Analytics Dashboard</h2>
              
              {stats.length === 0 ? (
                <div className="text-center py-12">
                  <BarChart3 className="h-12 w-12 text-blue-300 mx-auto mb-4" />
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-300 mr-2"></div>
                      <p className="text-blue-200">Loading analytics...</p>
                    </div>
                  ) : (
                    <>
                      <p className="text-blue-200">No data available yet</p>
                      <p className="text-blue-300 text-sm mt-2">Create some short URLs to see analytics here</p>
                    </>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-white/20">
                        <th className="pb-3 text-blue-200 font-semibold">Short Code</th>
                        <th className="pb-3 text-blue-200 font-semibold">Original URL</th>
                        <th className="pb-3 text-blue-200 font-semibold">Clicks</th>
                        <th className="pb-3 text-blue-200 font-semibold">Created</th>
                        <th className="pb-3 text-blue-200 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.map((url, index) => (
                        <tr key={url._id || index} className="border-b border-white/10 hover:bg-white/5">
                          <td className="py-4">
                            <code className="bg-blue-500/20 text-blue-200 px-2 py-1 rounded">
                              {url.shortUrl}
                            </code>
                          </td>
                          <td className="py-4 text-white max-w-md">
                            <div className="truncate" title={url.originalUrl}>
                              {url.originalUrl}
                            </div>
                          </td>
                          <td className="py-4">
                            <span className="bg-green-500/20 text-green-200 px-3 py-1 rounded-full">
                              {url.totalClicks || 0}
                            </span>
                          </td>
                          <td className="py-4 text-blue-200">
                            {new Date(url.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-4">
                            <a
                              href={`${API_BASE}/${url.shortUrl}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                              title="Open short URL"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        
      </div>
    </div>
  );
};

export default Logic;