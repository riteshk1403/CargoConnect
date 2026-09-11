import { useState } from 'react';
import { trackBooking } from '../api/trackingApi';
import ErrorMessage from '../components/ErrorMessage';
import TrackingTimeline from '../components/TrackingTimeline';

export default function TrackingPage() {
  const [bookingNumber, setBookingNumber] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  const handleTrack = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await trackBooking(bookingNumber);
      setData(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to track booking');
    }
  };

  return (
    <main className="page-shell">
      <div className="container tracking-layout">
        <div className="card full-width">
          <h2>Track Shipment</h2>
          <form onSubmit={handleTrack} className="inline-form">
            <input value={bookingNumber} onChange={(e) => setBookingNumber(e.target.value)} placeholder="Enter booking number" />
            <button type="submit" className="btn primary">Track</button>
          </form>
          <ErrorMessage message={error} />
        </div>

        {data && (
          <div className="card full-width">
            <h3>Booking: {data.bookingNumber}</h3>
            <p><strong>Current status:</strong> {data.status}</p>
            <TrackingTimeline steps={data.timeline || []} />
            <div className="tracking-meta">
              <p><strong>Pickup:</strong> {data.pickupAddress}</p>
              <p><strong>Delivery:</strong> {data.deliveryAddress}</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
