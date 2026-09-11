import { useEffect, useState } from 'react';
import { getUsers } from '../api/userApi';
import { getBookings } from '../api/bookingApi';
import { getDrivers } from '../api/driverApi';
import { getVehicles } from '../api/vehicleApi';
import DashboardCard from '../components/DashboardCard';
import Sidebar from '../components/Sidebar';
import StatusBadge from '../components/StatusBadge';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, driversRes, vehiclesRes, bookingsRes] = await Promise.all([
          getUsers(),
          getDrivers(),
          getVehicles(),
          getBookings()
        ]);

        setUsers(usersRes.data.data || []);
        setDrivers(driversRes.data.data || []);
        setVehicles(vehiclesRes.data.data || []);
        setBookings(bookingsRes.data.data || []);
      } catch (error) {
        console.error('Admin dashboard fetch failed', error);
      }
    };

    fetchData();
  }, []);

  const stats = {
    totalUsers: users.length,
    totalDrivers: drivers.length,
    totalShippers: users.filter((u) => u.userType === 'SHIPPER').length,
    totalVehicles: vehicles.length,
    totalBookings: bookings.length,
    pendingBookings: bookings.filter((b) => b.status === 'PENDING').length,
    completedBookings: bookings.filter((b) => b.status === 'DELIVERED').length,
    revenue: bookings.reduce((sum, booking) => sum + Number(booking.price || 0), 0)
  };

  return (
    <div className="dashboard-shell">
      <Sidebar userType="ADMIN" />
      <main className="dashboard-main">
        <div className="page-header">
          <h2>Admin Dashboard</h2>
        </div>

        <div className="stats-grid">
          <DashboardCard title="Total Users" value={stats.totalUsers} icon="👥" />
          <DashboardCard title="Total Drivers" value={stats.totalDrivers} icon="🚚" />
          <DashboardCard title="Total Shippers" value={stats.totalShippers} icon="📦" />
          <DashboardCard title="Total Vehicles" value={stats.totalVehicles} icon="🚛" />
          <DashboardCard title="Total Bookings" value={stats.totalBookings} icon="🧾" />
          <DashboardCard title="Pending Bookings" value={stats.pendingBookings} icon="⏳" />
          <DashboardCard title="Completed Bookings" value={stats.completedBookings} icon="✅" />
          <DashboardCard title="Revenue" value={`$${stats.revenue.toFixed(2)}`} icon="💰" />
        </div>

        <div className="card-grid two-col">
          <div className="card">
            <h3>Recent Bookings</h3>
            <table>
              <thead>
                <tr><th>Booking</th><th>Status</th></tr>
              </thead>
              <tbody>
                {bookings.slice(0, 5).map((booking) => (
                  <tr key={booking.id}><td>{booking.bookingNumber}</td><td><StatusBadge status={booking.status} /></td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="card">
            <h3>Drivers</h3>
            <table>
              <thead>
                <tr><th>Name</th><th>Availability</th></tr>
              </thead>
              <tbody>
                {drivers.slice(0, 5).map((driver) => (
                  <tr key={driver.id}><td>{driver.name}</td><td>{driver.availability}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
