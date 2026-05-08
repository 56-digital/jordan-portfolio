export default function AdminPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#000', padding: 32, color: '#fff', fontSize: 14, fontFamily: 'monospace' }}>
      <p style={{ marginBottom: 12 }}>The Sanity studio is hosted on sanity.io.</p>
      <p>
        Open it at:{' '}
        <a
          href="https://www.sanity.io/manage"
          style={{ textDecoration: 'underline', color: '#fff' }}
          target="_blank"
          rel="noreferrer"
        >
          sanity.io/manage
        </a>
      </p>
    </main>
  );
}
