import { Box } from '@mui/material';
import videoSrc from '../../assets/video.mp4';

export default function BackgroundVideo() {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        zIndex: -2,
        pointerEvents: 'none',
      }}
    >
      <Box
        component="video"
        data-testid="bg-video"
        autoPlay
        loop
        muted
        playsInline
        src={videoSrc}
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
      <Box
        data-testid="bg-video-overlay"
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.10)',
          backdropFilter: 'blur(6px)',
        }}
      />
    </Box>
  );
}
