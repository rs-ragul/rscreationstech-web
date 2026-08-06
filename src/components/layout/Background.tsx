export function Background() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Base dark gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, hsl(225 50% 4%) 0%, hsl(225 50% 3%) 50%, hsl(225 60% 2%) 100%)',
        }}
      />

      {/* Large cyan glow top-left */}
      <div
        className="absolute"
        style={{
          top: '-10%',
          left: '-10%',
          width: '60vw',
          height: '60vw',
          maxWidth: '900px',
          maxHeight: '900px',
          background: 'radial-gradient(circle, hsl(187 85% 53% / 0.15) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Purple glow top-right */}
      <div
        className="absolute"
        style={{
          top: '5%',
          right: '-5%',
          width: '50vw',
          height: '50vw',
          maxWidth: '800px',
          maxHeight: '800px',
          background: 'radial-gradient(circle, hsl(260 60% 50% / 0.12) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Cyan glow bottom-left */}
      <div
        className="absolute"
        style={{
          bottom: '10%',
          left: '5%',
          width: '45vw',
          height: '45vw',
          maxWidth: '700px',
          maxHeight: '700px',
          background: 'radial-gradient(circle, hsl(174 72% 56% / 0.1) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Blue glow center */}
      <div
        className="absolute"
        style={{
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80vw',
          height: '80vw',
          maxWidth: '1000px',
          maxHeight: '1000px',
          background: 'radial-gradient(circle, hsl(210 80% 50% / 0.08) 0%, transparent 60%)',
          filter: 'blur(80px)',
        }}
      />

      {/* Grid pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(hsl(187 85% 53% / 0.03) 1px, transparent 1px), linear-gradient(90deg, hsl(187 85% 53% / 0.03) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse at center, black 0%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 0%, transparent 70%)',
        }}
      />

      {/* Floating orbs */}
      <div
        className="absolute animate-pulse"
        style={{
          top: '20%',
          left: '25%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, hsl(187 85% 53% / 0.12) 0%, transparent 70%)',
          filter: 'blur(40px)',
          animation: 'float 8s ease-in-out infinite',
        }}
      />
      <div
        className="absolute"
        style={{
          top: '60%',
          right: '20%',
          width: '250px',
          height: '250px',
          background: 'radial-gradient(circle, hsl(260 60% 50% / 0.1) 0%, transparent 70%)',
          filter: 'blur(40px)',
          animation: 'float 10s ease-in-out infinite 2s',
        }}
      />
      <div
        className="absolute"
        style={{
          top: '75%',
          left: '35%',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, hsl(174 72% 56% / 0.1) 0%, transparent 70%)',
          filter: 'blur(40px)',
          animation: 'float 12s ease-in-out infinite 4s',
        }}
      />

      {/* Noise texture */}
      <div
        className="absolute inset-0"
        style={{
          opacity: 0.03,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '256px 256px',
        }}
      />
    </div>
  );
}
