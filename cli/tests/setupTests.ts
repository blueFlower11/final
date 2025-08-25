import '@testing-library/jest-dom/vitest';

vi.mock('next/link', async () => {
  const React = await import('react');
  return {
    __esModule: true,
    default: React.forwardRef<HTMLAnchorElement, any>(function Link({ href, children, ...props }, ref) {
      return <a ref={ref} href={typeof href === 'string' ? href : (href?.pathname || '#')} {...props}>{children}</a>;
    }),
  };
});

vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img alt={props.alt || ''} {...props} />;
  },
}));

vi.mock('next/navigation', () => ({
  __esModule: true,
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}));

vi.mock('framer-motion', async () => {
  const React = await import('react');
  const passthrough = new Proxy({}, {
    get: (_target, prop: string) => (prop === 'motion' ? new Proxy({}, {
      get: () => (props: any) => React.createElement('div', props),
    }) : () => React.createElement('div', {}))
  });
  return { __esModule: true, ...passthrough };
});

vi.mock('react-qr-code', () => ({
  __esModule: true,
  default: (props: any) => <div data-testid="qrcode" data-value={props.value} />,
}));
