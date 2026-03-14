import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  allowedDevOrigins: ['http://localhost:3000', '192.168.1.15'],
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
};

export default withNextIntl(nextConfig);
