import { describe, it, expect, vi, beforeEach } from 'vitest';
vi.unmock('../BackgroundAudio');
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BackgroundAudio from '../BackgroundAudio';

describe('BackgroundAudio', () => {
  beforeEach(() => {
    // Stub play/pause on HTMLMediaElement prototype for JSDOM
    window.HTMLMediaElement.prototype.play = vi.fn().mockImplementation(() => Promise.resolve());
    window.HTMLMediaElement.prototype.pause = vi.fn();
  });

  it('should render a hidden audio element with loop and src attributes', () => {
    render(<BackgroundAudio />);
    const audioEl = screen.getByTestId('bg-audio');
    expect(audioEl).toBeInTheDocument();
    expect(audioEl.tagName).toBe('AUDIO');
    expect(audioEl).toHaveAttribute('loop');
    expect(audioEl).toHaveAttribute('src');
    expect(audioEl.volume).toBeGreaterThanOrEqual(0.05);
    expect(audioEl.volume).toBeLessThanOrEqual(0.08);
  });

  it('should start playing audio after first user interaction', async () => {
    const playSpy = vi.spyOn(window.HTMLMediaElement.prototype, 'play');
    render(<BackgroundAudio />);
    const user = userEvent.setup();

    // Trigger user interaction
    await user.click(document.body);

    expect(playSpy).toHaveBeenCalled();
  });
});
