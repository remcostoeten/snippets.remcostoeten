import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#030303',
          fontSize: 32,
          fontWeight: 600,
        }}
      >
        <div
          style={{
            display: 'flex',
            padding: '20px 40px',
            width: '100%',
            backgroundColor: '#0F0F0F',
            color: '#FFFFFF',
            fontSize: 48,
            fontWeight: 800,
            textAlign: 'center',
          }}
        >
          RemcoStoeten Code Snippets
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            color: '#CCCCCC',
          }}
        >
          Development Tools & Programming Resources
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
