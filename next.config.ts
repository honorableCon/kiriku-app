import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  allowedDevOrigins: ['http://localhost:3000', '192.168.1.15'],
};

export default withNextIntl(nextConfig);
