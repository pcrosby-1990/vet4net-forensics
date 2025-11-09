export default function Timeline({ fragments }) {
  return (
    <div className="timeline">
      {fragments.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).map((frag) => (
        <div key={frag.id} className="timeline-entry">
          <strong>{new Date(frag.timestamp).toLocaleString()}</strong>
          <p>{frag.title}</p>
        </div>
      ))}
    </div>
  );
}
