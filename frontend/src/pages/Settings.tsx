import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import RootLayout from '../layouts/RootLayout';
import Input from '../components/atoms/Input';
import Button from '../components/atoms/Button';
import { getUserProfile, updateUserProfile } from '../services/userService';
import { getUser, setAuthData, getAccessToken, getRefreshToken } from '../utils/auth';
import type { User } from '../utils/auth';

export default function Settings() {
  const [activeTab, setActiveTab] = useState<'profile'>('profile');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    institution: '',
    semester: 1,
    profilePhoto: ''
  });

  // Load user profile on component mount
  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getUserProfile();
      const user = response.user;
      
      setProfileData({
        fullName: user.full_name || '',
        email: user.email || '',
        institution: user.institution || '',
        semester: user.semester || 1,
        profilePhoto: user.profile_photo || ''
      });
    } catch (err) {
      console.error('Error loading profile:', err);
      setError('Gagal memuat profil. Silakan coba lagi.');
      
      // Fallback to localStorage user data
      const localUser = getUser();
      if (localUser) {
        setProfileData({
          fullName: localUser.full_name || '',
          email: localUser.email || '',
          institution: localUser.institution || '',
          semester: localUser.semester || 1,
          profilePhoto: localUser.profile_photo || ''
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const response = await updateUserProfile({
        full_name: profileData.fullName,
        email: profileData.email,
        institution: profileData.institution,
        semester: profileData.semester,
        profile_photo: profileData.profilePhoto || undefined
      });
      
      // Update localStorage with new user data
      const accessToken = getAccessToken();
      const refreshToken = getRefreshToken();
      if (accessToken && refreshToken) {
        setAuthData(accessToken, refreshToken, response.user);
      }
      
      setSuccessMessage('Profil berhasil diperbarui!');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err instanceof Error ? err.message : 'Gagal memperbarui profil');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile' as const, label: 'Profil', icon: 'mdi:account-outline' }
  ];

  return (
    <RootLayout>
      <div className="max-w-5xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Pengaturan</h1>
        <p className="text-gray-600 mb-8">Kelola preferensi dan informasi akun Anda</p>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
            <Icon icon="mdi:check-circle" width={24} height={24} className="text-green-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-green-800">
              <p className="font-semibold">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <Icon icon="mdi:alert-circle" width={24} height={24} className="text-red-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-800">
              <p className="font-semibold">{error}</p>
            </div>
          </div>
        )}

        <div className="flex gap-6">
          {/* Sidebar Tabs */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-6 py-4 transition-colors border-l-4 ${
                    activeTab === tab.id
                      ? 'bg-gray-50 border-black text-black font-semibold'
                      : 'border-transparent text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon icon={tab.icon} width={24} height={24} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              {/* Profile Tab */}
              {
                <div>
                  <div className="flex items-center gap-4 mb-8">
                    <Icon icon="mdi:account-outline" width={32} height={32} className="text-gray-700" />
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Informasi Profil</h2>
                      <p className="text-gray-600">Perbarui informasi profil Anda</p>
                    </div>
                  </div>

                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    {/* Profile Picture */}
                    <div className="flex items-center gap-6 pb-6 border-b border-gray-200">
                      <img
                        src={profileData.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.fullName || 'User')}&background=random&size=128`}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover border-4 border-gray-100"
                        onError={(e) => {
                          e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.fullName || 'User')}&background=random&size=128`;
                        }}
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">Foto Profil</h3>
                        <Input
                          type="url"
                          placeholder="Masukkan URL foto profil"
                          value={profileData.profilePhoto}
                          onChange={(e) => setProfileData({ ...profileData, profilePhoto: e.target.value })}
                          disabled={loading}
                          className="mb-2"
                        />
                        <p className="text-xs text-gray-500">Masukkan URL gambar dari internet (contoh: Unsplash, Imgur, dll.)</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <Input
                        label="Nama Lengkap"
                        type="text"
                        value={profileData.fullName}
                        onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                        required
                        disabled={loading}
                      />
                      <Input
                        label="Email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        required
                        disabled={loading}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <Input
                        label="Institusi"
                        type="text"
                        value={profileData.institution}
                        onChange={(e) => setProfileData({ ...profileData, institution: e.target.value })}
                        disabled={loading}
                      />
                      <Input
                        label="Semester"
                        type="number"
                        value={profileData.semester}
                        onChange={(e) => setProfileData({ ...profileData, semester: parseInt(e.target.value) || 1 })}
                        min={1}
                        max={14}
                        disabled={loading}
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                      <Button type="button" variant="outline" onClick={loadUserProfile} disabled={loading}>
                        Batal
                      </Button>
                      <Button type="submit" variant="primary" disabled={loading}>
                        {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                      </Button>
                    </div>
                  </form>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </RootLayout>
  );
}
