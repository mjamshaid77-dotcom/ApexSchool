import React, { useState } from 'react';
import { X, Database, Key, ExternalLink, Check, Copy, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';
import {
  getSupabaseCredentials,
  saveSupabaseCredentials,
  clearCustomSupabaseCredentials,
  getSupabaseClient,
  SUPABASE_SQL_SETUP,
} from '../lib/supabase';

interface SupabaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCredentialsUpdated: () => void;
}

export const SupabaseConfigModal: React.FC<SupabaseConfigModalProps> = ({
  isOpen,
  onClose,
  onCredentialsUpdated,
}) => {
  const currentCreds = getSupabaseCredentials();
  const [url, setUrl] = useState(currentCreds.url);
  const [anonKey, setAnonKey] = useState(currentCreds.anonKey);
  const [copied, setCopied] = useState(false);
  const [testStatus, setTestStatus] = useState<{
    loading: boolean;
    success?: boolean;
    message?: string;
  }>({ loading: false });

  if (!isOpen) return null;

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SETUP);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    saveSupabaseCredentials(url, anonKey);
    onCredentialsUpdated();
    handleTestConnection();
  };

  const handleReset = () => {
    clearCustomSupabaseCredentials();
    const defaults = getSupabaseCredentials();
    setUrl(defaults.url);
    setAnonKey(defaults.anonKey);
    setTestStatus({ loading: false });
    onCredentialsUpdated();
  };

  const handleTestConnection = async () => {
    setTestStatus({ loading: true });

    // Save temporary state so getSupabaseClient picks it up
    saveSupabaseCredentials(url, anonKey);
    const client = getSupabaseClient();

    if (!client) {
      setTestStatus({
        loading: false,
        success: false,
        message: 'Please provide a valid Supabase Project URL and Anon/Publishable Key.',
      });
      return;
    }

    try {
      // Test querying students table
      const studentRes = await client.from('students').select('id').limit(1);
      if (studentRes.error) {
        if (studentRes.error.message.includes('relation "public.students" does not exist') ||
            studentRes.error.message.includes('relation "students" does not exist')) {
          setTestStatus({
            loading: false,
            success: false,
            message: 'Connected to Supabase, but the "students" table was not found. Please run the SQL setup script below.',
          });
          return;
        }
        throw studentRes.error;
      }

      // Test querying courses table
      const courseRes = await client.from('courses').select('id').limit(1);
      if (courseRes.error) {
        if (courseRes.error.message.includes('relation "public.courses" does not exist') ||
            courseRes.error.message.includes('relation "courses" does not exist')) {
          setTestStatus({
            loading: false,
            success: false,
            message: 'Connected to Supabase, but the "courses" table was not found. Please run the SQL setup script below.',
          });
          return;
        }
        throw courseRes.error;
      }

      setTestStatus({
        loading: false,
        success: true,
        message: 'Successfully connected! Both "students" and "courses" tables are ready.',
      });
    } catch (err: any) {
      setTestStatus({
        loading: false,
        success: false,
        message: err.message || 'Connection failed. Please check your URL and Anon Key.',
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full my-8 border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Supabase Connection Settings</h2>
              <p className="text-xs text-gray-500">Configure your database credentials and setup tables</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Instructions Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
            <h3 className="font-semibold mb-1 flex items-center gap-1.5">
              <span>Where do I find these credentials?</span>
            </h3>
            <ol className="list-decimal list-inside space-y-1 text-xs text-blue-800">
              <li>Log in to your <strong>Supabase Dashboard</strong> at <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" className="underline inline-flex items-center gap-0.5 font-medium">supabase.com <ExternalLink className="w-3 h-3 inline" /></a></li>
              <li>Select your project, click on <strong>Project Settings (gear icon)</strong> &gt; <strong>API</strong></li>
              <li>Copy the <strong>Project URL</strong> and <strong>anon / public API Key</strong></li>
            </ol>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Supabase Project URL
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="https://your-project-id.supabase.co"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Supabase Publishable / Anon Key
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={anonKey}
                  onChange={(e) => setAnonKey(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Status Message */}
          {testStatus.message && (
            <div
              className={`p-3.5 rounded-lg border text-sm flex items-start gap-2.5 ${
                testStatus.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}
            >
              {testStatus.success ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1 text-xs">
                {testStatus.message}
              </div>
            </div>
          )}

          {/* SQL Setup Script */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-4 py-2.5 bg-gray-100 border-b border-gray-200 flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-700">Database Tables Setup SQL (Run once in Supabase SQL Editor)</span>
              <button
                type="button"
                onClick={handleCopySql}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-white text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-gray-500" />
                    <span>Copy SQL</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-3 text-[11px] font-mono text-gray-800 bg-gray-50 overflow-x-auto max-h-40 leading-relaxed">
              {SUPABASE_SQL_SETUP}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-gray-500 hover:text-gray-800 underline font-medium"
          >
            Clear Stored Credentials
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testStatus.loading || !url || !anonKey}
              className="px-3.5 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors flex items-center gap-1.5"
            >
              {testStatus.loading ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
              ) : (
                <Key className="w-3.5 h-3.5 text-gray-500" />
              )}
              Test Connection
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-xs transition-colors"
            >
              Save & Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
