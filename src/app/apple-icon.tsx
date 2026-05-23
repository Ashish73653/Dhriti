import { ImageResponse } from 'next/og';

export const size = {
  width: 180,
  height: 180,
};

export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #05050a 0%, #0c0c14 55%, #121826 100%)',
        }}
      >
        <div
          style={{
            width: 140,
            height: 140,
            borderRadius: 36,
            background: 'rgba(16,185,129,0.14)',
            border: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              fontSize: 82,
              fontWeight: 900,
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