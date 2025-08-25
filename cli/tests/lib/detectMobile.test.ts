import { isMobileUA } from '@/utils/detectMobile';

describe('isMobileUA', () => {
  it.each([
    ['Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)', true],
    ['Mozilla/5.0 (Linux; Android 12; Pixel 5)', true],
    ['Mozilla/5.0 (Windows NT 10.0; Win64; x64)', false],
  ])('detects mobile for %s', (ua, expected) => {
    expect(isMobileUA(ua)).toBe(expected);
  });
});
