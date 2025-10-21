// FileName: Login.tsx
// Path: src/pages/auth/Login.tsx

import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import AuthLayout from '../../layouts/AuthLayout'; // Usa el layout específico

const LoginPage = () => {
  return (
    // AuthLayout maneja el Header, Footer y el contenedor central
    <AuthLayout 
        title="Sign in to Nublink" 
        subtitle={ // Permite JSX para el link
            <>
                Don't have an account?{' '}
                <Link to="/registro-tienda" className="font-medium text-primary hover:underline">
                    Register here
                </Link>
            </>
        }
    >
        <form className="space-y-5">
          <Input 
            id="email"
            label="Email Address"
            type="email"
            placeholder="your.email@example.com"
            required
          />
          <Input 
            id="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            required
          />
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <input id="remember" type="checkbox" className="h-4 w-4 text-primary focus:ring-primary border-line-light rounded"/>
              <label htmlFor="remember" className="text-text-main">Remember me</label>
            </div>
            <Link to="/forgot-password" className="font-medium text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <Button type="submit" className="w-full !mt-8" size="lg">
            Sign In
          </Button>
        </form>
    </AuthLayout>
  );
};

export default LoginPage;