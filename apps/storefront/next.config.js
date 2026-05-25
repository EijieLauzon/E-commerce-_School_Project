/** @type {import('next').NextConfig} */

module.exports = {
    eslint: {
        // Legacy codebase has many lint issues; skip during Vercel/production builds.
        ignoreDuringBuilds: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
    },
    async redirects() {
        return [
            {
                source: '/product',
                destination: '/products',
                permanent: true,
            },
        ]
    },
}
