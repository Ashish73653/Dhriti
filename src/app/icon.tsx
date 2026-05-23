import { ImageResponse } from 'next/og';

export const size = {
  width: 512,
  height: 512,
};

export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background:
            'radial-gradient(circle at 30% 20%, rgba(16,185,129,0.35), transparent 35%), linear-gradient(135deg, #05050a 0%, #0c0c14 55%, #121826 100%)',
        }}
      >
        <div
          style={{
            width: 384,
            height: 384,
            borderRadius: 96,
            border: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255,255,255,0.04)',
            boxShadow: '0 24px 80px rgba(0,0,0,0.45)',
          }}
        >
          <span
            style={{
              fontSize: 180,
              fontWeight: 900,
              letterSpacing: -12,
              color: '#f8fafc',
              lineHeight: 1,
              fontFamily: 'sans-serif',
            }}
          >
            D
          </span>
        </div>
      </div>
    ),
    size
  );
}