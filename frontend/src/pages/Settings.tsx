import { useState } from 'react';
import { Icon } from '@iconify/react';
import RootLayout from '../layouts/RootLayout';
import Input from '../components/atoms/Input';
import Button from '../components/atoms/Button';

export default function Settings() {
  const [activeTab, setActiveTab] = useState<'profile' | 'account' | 'notifications'>('profile');
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+62 812-3456-7890',
    bio: 'Saya adalah seorang pelajar yang tertarik dengan budaya dan tradisi Jawa.'
  });

  // Account form state
  const [accountData, setAccountData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    courseUpdates: true,
    weeklyDigest: false,
    progressReminders: true
  });

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement profile update API call
    console.log('Updating profile:', profileData);
    alert('Profil berhasil diperbarui!');
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (accountData.newPassword !== accountData.confirmPassword) {
      alert('Password baru dan konfirmasi password tidak cocok!');
      return;
    }
    
    // TODO: Implement password change API call
    console.log('Changing password');
    alert('Password berhasil diubah!');
    
    // Reset form
    setAccountData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleNotificationToggle = (key: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const tabs = [
    { id: 'profile' as const, label: 'Profil', icon: 'mdi:account-outline' },
    { id: 'account' as const, label: 'Akun & Keamanan', icon: 'mdi:shield-lock-outline' },
    { id: 'notifications' as const, label: 'Notifikasi', icon: 'mdi:bell-outline' }
  ];

  return (
    <RootLayout>
      <div className="max-w-5xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Pengaturan</h1>
        <p className="text-gray-600 mb-8">Kelola preferensi dan informasi akun Anda</p>

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
              {activeTab === 'profile' && (
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
                        src="https://ui-avatars.com/api/?name=User+Account&background=random&size=128"
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover border-4 border-gray-100"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Foto Profil</h3>
                        <div className="flex gap-3">
                          <Button type="button" variant="outline" className="text-sm py-1.5 px-4">
                            Ubah Foto
                          </Button>
                          <Button type="button" variant="secondary" className="text-sm py-1.5 px-4">
                            Hapus
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <Input
                        label="Nama Lengkap"
                        type="text"
                        value={profileData.fullName}
                        onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                        required
                      />
                      <Input
                        label="Email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        required
                      />
                    </div>

                    <Input
                      label="Nomor Telepon"
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    />

                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-gray-700">Bio</label>
                      <textarea
                        value={profileData.bio}
                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                        placeholder="Ceritakan sedikit tentang diri Anda..."
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                      <Button type="button" variant="outline">
                        Batal
                      </Button>
                      <Button type="submit" variant="primary">
                        Simpan Perubahan
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {/* Account & Security Tab */}
              {activeTab === 'account' && (
                <div>
                  <div className="flex items-center gap-4 mb-8">
                    <Icon icon="mdi:shield-lock-outline" width={32} height={32} className="text-gray-700" />
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Akun & Keamanan</h2>
                      <p className="text-gray-600">Kelola password dan keamanan akun Anda</p>
                    </div>
                  </div>

                  <form onSubmit={handlePasswordChange} className="space-y-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                      <Icon icon="mdi:information-outline" width={24} height={24} className="text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-blue-800">
                        <p className="font-semibold mb-1">Tips Keamanan Password</p>
                        <ul className="list-disc list-inside space-y-1 text-blue-700">
                          <li>Gunakan minimal 8 karakter</li>
                          <li>Kombinasikan huruf besar, huruf kecil, angka, dan simbol</li>
                          <li>Jangan gunakan informasi pribadi yang mudah ditebak</li>
                        </ul>
                      </div>
                    </div>

                    <Input
                      label="Password Saat Ini"
                      type="password"
                      value={accountData.currentPassword}
                      onChange={(e) => setAccountData({ ...accountData, currentPassword: e.target.value })}
                      required
                      placeholder="Masukkan password saat ini"
                    />

                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="font-semibold text-gray-900 mb-4">Password Baru</h3>
                      <div className="space-y-4">
                        <Input
                          label="Password Baru"
                          type="password"
                          value={accountData.newPassword}
                          onChange={(e) => setAccountData({ ...accountData, newPassword: e.target.value })}
                          required
                          placeholder="Masukkan password baru"
                        />
                        <Input
                          label="Konfirmasi Password Baru"
                          type="password"
                          value={accountData.confirmPassword}
                          onChange={(e) => setAccountData({ ...accountData, confirmPassword: e.target.value })}
                          required
                          placeholder="Masukkan ulang password baru"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                      <Button type="button" variant="outline" onClick={() => setAccountData({ currentPassword: '', newPassword: '', confirmPassword: '' })}>
                        Batal
                      </Button>
                      <Button type="submit" variant="primary">
                        Ubah Password
                      </Button>
                    </div>
                  </form>

                  {/* Additional Security Options */}
                  <div className="border-t border-gray-200 mt-8 pt-8">
                    <h3 className="font-semibold text-gray-900 mb-4">Opsi Keamanan Lainnya</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">Autentikasi Dua Faktor</h4>
                          <p className="text-sm text-gray-600">Tambahkan lapisan keamanan ekstra ke akun Anda</p>
                        </div>
                        <Button type="button" variant="outline" className="text-sm py-1.5 px-4">
                          Aktifkan
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">Sesi Aktif</h4>
                          <p className="text-sm text-gray-600">Kelola perangkat yang masuk ke akun Anda</p>
                        </div>
                        <Button type="button" variant="outline" className="text-sm py-1.5 px-4">
                          Kelola
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div>
                  <div className="flex items-center gap-4 mb-8">
                    <Icon icon="mdi:bell-outline" width={32} height={32} className="text-gray-700" />
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Preferensi Notifikasi</h2>
                      <p className="text-gray-600">Pilih notifikasi yang ingin Anda terima</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Email Notifications */}
                    <div className="border-b border-gray-200 pb-6">
                      <h3 className="font-semibold text-gray-900 mb-4">Notifikasi Email</h3>
                      <div className="space-y-4">
                        <ToggleOption
                          label="Aktifkan Notifikasi Email"
                          description="Terima notifikasi melalui email"
                          checked={notificationSettings.emailNotifications}
                          onChange={() => handleNotificationToggle('emailNotifications')}
                        />
                        <ToggleOption
                          label="Pembaruan Kursus"
                          description="Dapatkan pemberitahuan ketika ada modul atau konten baru"
                          checked={notificationSettings.courseUpdates}
                          onChange={() => handleNotificationToggle('courseUpdates')}
                          disabled={!notificationSettings.emailNotifications}
                        />
                        <ToggleOption
                          label="Ringkasan Mingguan"
                          description="Terima ringkasan aktivitas dan progres Anda setiap minggu"
                          checked={notificationSettings.weeklyDigest}
                          onChange={() => handleNotificationToggle('weeklyDigest')}
                          disabled={!notificationSettings.emailNotifications}
                        />
                      </div>
                    </div>

                    {/* Push Notifications */}
                    <div className="border-b border-gray-200 pb-6">
                      <h3 className="font-semibold text-gray-900 mb-4">Notifikasi Push</h3>
                      <div className="space-y-4">
                        <ToggleOption
                          label="Aktifkan Notifikasi Push"
                          description="Terima notifikasi langsung di perangkat Anda"
                          checked={notificationSettings.pushNotifications}
                          onChange={() => handleNotificationToggle('pushNotifications')}
                        />
                        <ToggleOption
                          label="Pengingat Progres"
                          description="Dapatkan pengingat untuk melanjutkan pembelajaran Anda"
                          checked={notificationSettings.progressReminders}
                          onChange={() => handleNotificationToggle('progressReminders')}
                          disabled={!notificationSettings.pushNotifications}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                      <Button type="button" variant="primary" onClick={() => alert('Preferensi notifikasi berhasil disimpan!')}>
                        Simpan Preferensi
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </RootLayout>
  );
}

// Toggle Option Component
interface ToggleOptionProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}

function ToggleOption({ label, description, checked, onChange, disabled = false }: ToggleOptionProps) {
  return (
    <div className={`flex items-center justify-between p-4 bg-gray-50 rounded-lg ${disabled ? 'opacity-50' : ''}`}>
      <div className="flex-1">
        <h4 className="font-medium text-gray-900">{label}</h4>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <button
        type="button"
        onClick={onChange}
        disabled={disabled}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 ${
          checked ? 'bg-black' : 'bg-gray-300'
        } ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}
