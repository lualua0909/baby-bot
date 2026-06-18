'use client';

/** Playful floating clouds & stars — Talking Tom style ambience */
export default function FloatingDecor() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <span className="absolute top-[12%] left-[8%] text-4xl opacity-40 animate-float-slow">☁️</span>
      <span className="absolute top-[8%] right-[12%] text-3xl opacity-30 animate-float" style={{ animationDelay: '1s' }}>
        ☁️
      </span>
      <span className="absolute top-[25%] right-[5%] text-2xl opacity-50 animate-float-slow" style={{ animationDelay: '2s' }}>
        ✨
      </span>
      <span className="absolute top-[40%] left-[4%] text-xl opacity-40 animate-float" style={{ animationDelay: '0.5s' }}>
        ⭐
      </span>
      <span className="absolute bottom-[28%] right-[8%] text-3xl opacity-35 animate-float-slow" style={{ animationDelay: '1.5s' }}>
        🌈
      </span>
      <span className="absolute bottom-[35%] left-[10%] text-2xl opacity-30 animate-float" style={{ animationDelay: '3s' }}>
        ☁️
      </span>
    </div>
  );
}
