import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api/userApi';
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SuccessMessage';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    userType: 'SHIPPER'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await registerUser(form);
      setSuccess(response.data.message || 'Registration successful');
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h2>Register</h2>
        <ErrorMessage message={error} />
        <SuccessMessage message={success} />
        <form onSubmit={handleSubmit} className="auth-form">
          <label>Name<input name="name" value={form.name} onChange={handleChange} required /></label>
          <label>Email<input name="email" type="email" value={form.email} onChange={handleChange} required /></label>
          <label>Phone<input name="phone" value={form.phone} onChange={handleChange} required /></label>
          <label>Password<input name="password" type="password" value={form.password} onChange={handleChange} required /></label>
          <label>Confirm Password<input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} required /></label>
          <label>User Type
            <select name="userType" value={form.userType} onChange={handleChange}>
              <option value="SHIPPER">Shipper</option>
              <option value="DRIVER">Driver</option>
              <option value="ADMIN">Admin</option>
            </select>
          </label>
          <button type="submit" className="btn primary">Register</button>
        </form>
      </div>
    </main>
  );
}
