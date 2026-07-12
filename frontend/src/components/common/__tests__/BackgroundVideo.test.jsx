import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../../../theme';
import BackgroundVideo from '../BackgroundVideo';

describe('BackgroundVideo', () => {
  it('should render a video element with autoplay, loop, muted, and playsinline attributes', () => {
    render(
      <ThemeProvider theme={theme}>
        <BackgroundVideo />
      </ThemeProvider>
    );

    const videoEl = screen.getByTestId('bg-video');
    expect(videoEl).toBeInTheDocument();
    expect(videoEl.tagName).toBe('VIDEO');
    expect(videoEl).toHaveAttribute('autoplay');
    expect(videoEl).toHaveAttribute('loop');
    expect(videoEl).toHaveAttribute('muted');
    expect(videoEl).toHaveAttribute('playsinline');
    expect(videoEl).toHaveAttribute('src');
  });

  it('should render a dark overlay above the video', () => {
    render(
      <ThemeProvider theme={theme}>
        <BackgroundVideo />
      </ThemeProvider>
    );

    const overlay = screen.getByTestId('bg-video-overlay');
    expect(overlay).toBeInTheDocument();
  });
});
