import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import Input from '../components/atoms/Input';
import Button from '../components/atoms/Button';
import Select from '../components/atoms/Select';

interface RegisterForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  full_name: string;
  institution: string;
  semester: string;
  role: string;
}

// Zod validation schema
const registerSchema = z.object({
  username: z.string({
    message: 'Nama pengguna wajib diisi',
  }).min(3, { message: 'Nama pengguna minimal 3 karakter' }),
  email: z.string({
    message: 'Email wajib diisi',
  }).email({ message: 'Format email tidak valid' }),
  password: z.string({
    message: 'Kata sandi wajib diisi',
  }).min(8, { message: 'Kata sandi minimal 8 karakter' }),
  confirmPassword: z.string({
    message: 'Konfirmasi kata sandi wajib diisi',
  }),
  full_name: z.string({
    message: 'Nama lengkap wajib diisi',
  }).min(1, { message: 'Nama lengkap wajib diisi' }),
  institution: z.string({
    message: 'Institusi wajib diisi',
  }).min(1, { message: 'Institusi wajib diisi' }),
  semester: z.string({
    message: 'Semester wajib dipilih',
  }).min(1, { message: 'Semester wajib dipilih' }),
  role: z.string({
    message: 'Peran wajib dipilih',
  }).min(1, { message: 'Peran wajib dipilih' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Kata sandi tidak cocok',
  path: ['confirmPassword'],
});

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterForm>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    institution: '',
    semester: '',
    role: '',
  });
  const [errors, setErrors] = useState<Partial<RegisterForm>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof RegisterForm]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    try {
      registerSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<RegisterForm> = {};
        error.issues.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof RegisterForm] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsLoading(true);

    try {
      // Prepare data for API (exclude confirmPassword)
      const { confirmPassword, ...registerData } = formData;
      
      const response = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...registerData,
          semester: parseInt(registerData.semester),
          role: parseInt(registerData.role),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store tokens in localStorage
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Redirect to home page or login
        navigate('/');
      } else {
        // Handle validation errors from backend
        if (data.errors) {
          const backendErrors: Partial<RegisterForm> = {};
          Object.keys(data.errors).forEach((key) => {
            backendErrors[key as keyof RegisterForm] = data.errors[key][0];
          });
          setErrors(backendErrors);
        } else {
          setErrors({ username: data.message || 'Pendaftaran gagal' });
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ username: 'Terjadi kesalahan. Silakan coba lagi.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Semester options (1-12)
  const semesterOptions = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: `Semester ${i + 1}`,
  }));

  // Role options (based on the seeded data: Admin, Teacher, Student)
  const roleOptions = [
    { value: '1', label: 'Admin' },
    { value: '2', label: 'Pengajar' },
    { value: '3', label: 'Siswa' },
  ];

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 w-full max-w-2xl p-8 my-8">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Buat Akun</h1>
          <p className="text-gray-600 mt-2">Bergabung dengan Taneyan Lanjeng</p>
        </div>

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Nama Pengguna"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              error={errors.username}
              placeholder="Pilih nama pengguna"
              required
              autoComplete="username"
            />

            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="email.anda@contoh.com"
              required
              autoComplete="email"
            />
          </div>

          <Input
            label="Nama Lengkap"
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            error={errors.full_name}
            placeholder="Masukkan nama lengkap Anda"
            required
            autoComplete="name"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Kata Sandi"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="Buat kata sandi"
              required
              autoComplete="new-password"
            />

            <Input
              label="Konfirmasi Kata Sandi"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              placeholder="Masukkan ulang kata sandi"
              required
              autoComplete="new-password"
            />
          </div>

          <Input
            label="Institusi"
            type="text"
            name="institution"
            value={formData.institution}
            onChange={handleChange}
            error={errors.institution}
            placeholder="Masukkan nama institusi Anda"
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Select
              label="Semester"
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              error={errors.semester}
              options={semesterOptions}
              required
            />

            <Select
              label="Peran"
              name="role"
              value={formData.role}
              onChange={handleChange}
              error={errors.role}
              options={roleOptions}
              required
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={isLoading}
            >
              {isLoading ? 'Membuat Akun...' : 'Daftar'}
            </Button>
          </div>
        </form>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Sudah punya akun?{' '}
            <Link to="/login" className="text-black hover:text-gray-700 font-bold">
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
