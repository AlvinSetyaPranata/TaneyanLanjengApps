import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import Input from '../components/atoms/Input';
import Button from '../components/atoms/Button';
import { setAuthData } from '../utils/auth';
import { login } from '../services/authService';

interface LoginForm {
  username: string;
  password: string;
}

// Zod validation schema
const loginSchema = z.object({
  username: z.string({
    message: 'Nama pengguna wajib diisi',
  }).min(1, { message: 'Nama pengguna wajib diisi' }),
  password: z.string({
    message: 'Kata sandi wajib diisi',
  }).min(6, { message: 'Kata sandi minimal 6 karakter' }),
});

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginForm>({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState<Partial<LoginForm>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof LoginForm]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    try {
      loginSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<LoginForm> = {};
        error.issues.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof LoginForm] = err.message;
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
      // Call login service
      const data = await login(formData);

      // Store tokens and user data in localStorage
      setAuthData(data.access_token, data.refresh_token, data.user);
      
      // Redirect to home page
      navigate('/');
    } catch (error: any) {
      console.error('Login error:', error);
      setErrors({ username: error.message || 'Terjadi kesalahan. Silakan coba lagi.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 w-full max-w-md p-8">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Selamat Datang</h1>
          <p className="text-gray-600 mt-2">Masuk ke Taneyan Lanjeng</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Username"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            error={errors.username}
            placeholder="Masukkan nama pengguna"
            required
            autoComplete="username"
          />

          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="Masukkan password"
            required
            autoComplete="current-password"
          />

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="w-4 h-4 text-black border-gray-300 rounded focus:ring-gray-500"
              />
              <span className="ml-2 text-sm text-gray-600">Ingat saya</span>
            </label>
            <a href="#" className="text-sm text-black hover:text-gray-700 font-medium">
              Lupa kata sandi?
            </a>
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={isLoading}
          >
            {isLoading ? 'Sedang masuk...' : 'Masuk'}
          </Button>
        </form>

        {/* Register Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Belum punya akun?{' '}
            <Link to="/register" className="text-black hover:text-gray-700 font-bold">
              Daftar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
