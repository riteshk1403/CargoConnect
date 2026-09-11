import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/userApi';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await loginUser(form);
      const payload = response.data;
      localStorage.setItem('token', payload.token);
      localStorage.setItem('user', JSON.stringify(payload.user));

      const userType = payload.user.userType;
      if (userType === 'ADMIN') navigate('/admin');
      else if (userType === 'DRIVER') navigate('/driver');
      else navigate('/shipper');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h2>Login</h2>
        <ErrorMessage message={error} />
        <form onSubmit={handleSubmit} className="auth-form">
          <label>Email<input name="email" type="email" value={form.email} onChange={handleChange} required /></label>
          <label>Password<input name="password" type="password" value={form.password} onChange={handleChange} required /></label>
          <button type="submit" className="btn primary" disabled={loading}>{loading ? <LoadingSpinner /> : 'Login'}</button>
        </form>
      </div>
    </main>
  );
}
