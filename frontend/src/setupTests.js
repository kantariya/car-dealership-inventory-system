import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React from 'react';

// Mock heavy background media components globally to prevent JSDOM test runner memory thrashing and timeouts
vi.mock('./components/common/BackgroundVideo', () => ({
  default: () => React.createElement('div', { 'data-testid': 'bg-video-mock' })
}));

vi.mock('./components/common/BackgroundAudio', () => ({
  default: () => React.createElement('div', { 'data-testid': 'bg-audio-mock' })
}));

vi.mock('/src/components/common/BackgroundVideo', () => ({
  default: () => React.createElement('div', { 'data-testid': 'bg-video-mock' })
}));

vi.mock('/src/components/common/BackgroundAudio', () => ({
  default: () => React.createElement('div', { 'data-testid': 'bg-audio-mock' })
}));
