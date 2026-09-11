import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <main>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <p className="eyebrow">Trusted logistics partner</p>
            <h1>Move Your Cargo. Move Your Business.</h1>
            <p className="subtitle">Fast, reliable and secure logistics solutions for every shipment.</p>
            <div className="hero-actions">
              <Link to="/register" className="btn primary">Book a Shipment</Link>
              <Link to="/shipper/tracking" className="btn secondary">Track Shipment</Link>
            </div>
          </div>
          <div className="hero-card">
            <h3>Live Shipment Summary</h3>
            <div className="mini-metrics">
              <div><strong>12k+</strong><span>Shipments</span></div>
              <div><strong>98%</strong><span>On-Time</span></div>
              <div><strong>24/7</strong><span>Support</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Our Services</h2>
          <div className="card-grid three-col">
            <div className="info-card"><h3>Parcel Delivery</h3><p>Scheduled and express delivery across cities.</p></div>
            <div className="info-card"><h3>Fleet Management</h3><p>Track vehicles and manage drivers in real time.</p></div>
            <div className="info-card"><h3>Secure Logistics</h3><p>Protected cargo handling with status monitoring.</p></div>
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <div className="card-grid three-col">
            <div className="step-card"><span>1</span><h3>Book</h3><p>Create shipment details with pickup and delivery.</p></div>
            <div className="step-card"><span>2</span><h3>Assign</h3><p>Admins match your order with the right driver and vehicle.</p></div>
            <div className="step-card"><span>3</span><h3>Track</h3><p>Monitor journey progress until successful delivery.</p></div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Why CargoConnect</h2>
          <div className="card-grid four-col">
            <div className="info-card"><h3>Fast</h3><p>Time-sensitive deliveries from door to door.</p></div>
            <div className="info-card"><h3>Reliable</h3><p>Professional drivers and optimized routes.</p></div>
            <div className="info-card"><h3>Transparent</h3><p>Clear booking updates and real-time tracking.</p></div>
            <div className="info-card"><h3>Secure</h3><p>Safe handling with payment and logs support.</p></div>
          </div>
        </div>
      </section>

      <section className="section alt testimonials">
        <div className="container">
          <h2 className="section-title">Testimonials</h2>
          <div className="card-grid three-col">
            <div className="quote-card"><p>“CargoConnect has improved our delivery speed dramatically.”</p><strong>— Retail Partner</strong></div>
            <div className="quote-card"><p>“Professional and punctual service every time.”</p><strong>— E-commerce Store</strong></div>
            <div className="quote-card"><p>“The tracking experience is excellent and very reliable.”</p><strong>— Logistics Manager</strong></div>
          </div>
        </div>
      </section>
    </main>
  );
}
