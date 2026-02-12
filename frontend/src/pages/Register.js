import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { UserPlus, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { API } from '../App';
const React = require('react');
const { AuthContext } = require('../App');

export default function Register() {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${API}/auth/register`, formData);
      localStorage.setItem('token', response.data.access_token);
      setUser(response.data.user);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F0E9] via-[#FAFAF9] to-[#E8ECE6] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-white/50 p-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold font-heading mb-2">Create Account</h1>
            <p className="text-muted-foreground">Join us to book your first cleaning service</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-foreground/80 mb-2 block">
                Full Name
              </Label>
              <Input
                id="name"
                data-testid="register-name-input"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="h-12 bg-white/50 border-border focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-xl transition-all"
                placeholder="John Doe"
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-sm font-medium text-foreground/80 mb-2 block">
                Email
              </Label>
              <Input
                id="email"
                data-testid="register-email-input"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="h-12 bg-white/50 border-border focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-xl transition-all"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-sm font-medium text-foreground/80 mb-2 block">
                Password
              </Label>
              <Input
                id="password"
                data-testid="register-password-input"
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="h-12 bg-white/50 border-border focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-xl transition-all"
                placeholder="••••••••"
                minLength="6"
              />
            </div>

            <Button
              data-testid="register-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 rounded-full font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            >
              {loading ? 'Creating account...' : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Create Account
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}