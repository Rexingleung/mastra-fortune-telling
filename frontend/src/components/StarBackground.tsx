export default function StarBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {Array.from({ length: 100 }).map((_, i) => (
        <div
          key={i}
          className="absolute bg-white rounded-full star"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 3 + 1}px`,
            height: `${Math.random() * 3 + 1}px`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${Math.random() * 4 + 2}s`
          }}
        />
      ))}
      
      {/* 流星效果 */}
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={`meteor-${i}`}
          className="absolute w-1 h-20 bg-gradient-to-t from-transparent to-white opacity-30"
          style={{
            left: `${Math.random() * 100}%`,
            top: '-20px',
            transform: `rotate(45deg)`,
            animation: `meteors ${Math.random() * 10 + 5}s linear infinite`,
            animationDelay: `${Math.random() * 10}s`
          }}
        />
      ))}
      
      <style jsx>{`
        @keyframes meteors {
          0% {
            transform: translateY(-100vh) rotate(45deg);
            opacity: 0;
          }
          10% {
            opacity: 0.3;
          }
          90% {
            opacity: 0.3;
          }
          100% {
            transform: translateY(100vh) rotate(45deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}