export default function TrackingTimeline({ steps = [] }) {
  return (
    <div className="timeline">
      {steps.map((step, idx) => (
        <div key={step} className={`timeline-item ${idx === 0 ? 'active' : ''}`}>
          <div className="timeline-dot" />
          <div className="timeline-content">
            <strong>{step}</strong>
          </div>
        </div>
      ))}
    </div>
  );
}
