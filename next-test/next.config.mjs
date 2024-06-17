import analyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = analyzer({
  enabled: process.env.ANALYZE === 'true',
});

  /** @type {import('next').NextConfig} */
  let nextConfig = {}
   
  nextConfig = withBundleAnalyzer(nextConfig)
  export default nextConfig