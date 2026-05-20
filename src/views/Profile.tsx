import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'motion/react';
import { User, Mail, ArrowLeft, Loader2, CheckCircle2, AlertCircle, Camera } from 'lucide-react';

export default function Profile() {
  const navigate = useNavigate();
  const { user, updateUser, loading: authLoading } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync state with user context once loaded
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setAvatarUrl(user.user_metadata?.avatar_url || '');
    }
  }, [user]);

  // If user isn't logged in and not loading, redirect to Landing page
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError(null);

    try {
      if (!firstName.trim()) {
        throw new Error('First name cannot be empty');
      }

      if (updateUser) {
        await updateUser({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          avatarUrl: avatarUrl.trim(),
        });
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error('Failed to update profile:', err);
      setError(err.message || 'An error occurred while updating your profile.');
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-brand-soft flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <Loader2 className="w-10 h-10 animate-spin text-brand-primary" />
          <p className="text-zinc-500 font-medium">Loading user details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-soft pt-24 pb-16 px-4 font-sans select-none">
      <div className="max-w-2xl mx-auto">
        
        {/* Back Link */}
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-zinc-500 hover:text-brand-primary text-sm font-medium mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back</span>
        </button>

        {/* Outer Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white border border-brand-border rounded-3xl shadow-xl overflow-hidden"
        >
          {/* Header decoration */}
          <div className="h-32 bg-brand-primary flex items-end justify-between px-8 pb-4 relative">
            <h1 className="text-2xl font-semibold text-white tracking-tight">Your Profile</h1>
            <span className="text-xs font-mono text-zinc-400 bg-zinc-800/50 px-2.5 py-1 rounded-full">
              ID: {user.id.substring(0, 12)}...
            </span>
          </div>

          <div className="p-8 md:p-12">
            <form onSubmit={handleSave} className="space-y-8">
              
              {/* Profile Image & Status */}
              <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-brand-border/60">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full overflow-hidden border border-brand-border bg-brand-soft flex items-center justify-center">
                    {avatarUrl ? (
                      <img 
                        src={avatarUrl} 
                        alt="Avatar" 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                        onError={() => {
                          // Failover to a generic placeholder avatar
                          setAvatarUrl('');
                        }}
                      />
                    ) : (
                      <User className="w-10 h-10 text-zinc-400" />
                    )}
                  </div>
                  <div className="absolute inset-0 bg-brand-primary/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <Camera className="w-5 h-5 text-white" />
                  </div>
                </div>

                <div className="text-center sm:text-left space-y-1">
                  <h3 className="text-xl font-semibold text-brand-primary tracking-tight">
                    {firstName || 'No name'} {lastName}
                  </h3>
                  <p className="text-zinc-500 text-sm flex items-center gap-1.5 justify-center sm:justify-start">
                    <Mail className="w-4 h-4 text-zinc-400" />
                    <span>{user.email || 'No email associated'}</span>
                  </p>
                </div>
              </div>

              {/* Input Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    First Name
                  </label>
                  <div className="relative">
                    <input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="e.g. Alexa"
                      disabled={saving}
                      className="w-full bg-brand-soft border border-brand-border rounded-xl px-4 py-3 text-sm text-brand-primary font-medium focus:outline-none focus:ring-1 focus:ring-brand-primary transition-all disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="lastName" className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    Last Name
                  </label>
                  <div className="relative">
                    <input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="e.g. Vance"
                      disabled={saving}
                      className="w-full bg-brand-soft border border-brand-border rounded-xl px-4 py-3 text-sm text-brand-primary font-medium focus:outline-none focus:ring-1 focus:ring-brand-primary transition-all disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="avatarUrl" className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    Avatar Image URL
                  </label>
                  <div className="relative">
                    <input
                      id="avatarUrl"
                      type="text"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/your-custom-photo"
                      disabled={saving}
                      className="w-full bg-brand-soft border border-brand-border rounded-xl px-4 py-3 text-sm text-brand-primary font-medium focus:outline-none focus:ring-1 focus:ring-brand-primary transition-all disabled:opacity-50 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Feedbacks */}
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-center gap-3 text-emerald-800 text-sm"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span>Profile updated successfully!</span>
                </motion.div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-center gap-3 text-red-800 text-sm"
                >
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 sm:justify-end pt-4 border-t border-brand-border/60">
                <button
                  type="button"
                  onClick={() => navigate('/upload')}
                  className="w-full sm:w-auto px-6 py-3 border border-brand-border hover:bg-brand-soft rounded-xl text-sm font-semibold text-zinc-500 hover:text-brand-primary transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full sm:w-auto bg-brand-primary text-white hover:opacity-90 active:scale-[0.98] transition-all px-8 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
              </div>

            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
