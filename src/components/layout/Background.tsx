export function Background() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      {/* Clean dark gradient base */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, #0a0e1a 0%, #060a12 100%)',
        }}
      />

      {/* Very subtle cyan accent at top */}
      <div
        className="absolute top-0 left-0 right-0"
        style={{
          height: '400px',
          background: 'linear-gradient(180deg, rgba(103, 232, 249, 0.03) 0%, transparent 100%)',
        }}
      />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(rgba(103, 232, 249, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(103, 232, 249, 0.03) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse at center, black 0%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 0%, transparent 80%)',
        }}
      />

      {/* Subtle noise texture */}
      <div
        className="absolute inset-0"
        style={{
          opacity: 0.02,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
