import { defineConfig } from 'vitepress';

export default defineConfig({
    title: 'Devux.js',
    description: 'An opinionated full-stack TypeScript framework for Node.js by Inas Sirhan. Designed for building highly testable, maintainable, enterprise-grade applications with type-safe RESTful APIs.',
    cleanUrls: true,
    vite: {
        server: {
            host: '127.0.0.1',
            allowedHosts: ['devuxjs.com', 'www.devuxjs.com'],
        }
    },
    sitemap: {
        hostname: 'https://devuxjs.com',
    },
    head: [
        ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
        ['meta', { property: 'og:type', content: 'website' }],
        ['meta', { property: 'og:title', content: 'Devux.js - Full-Stack TypeScript Framework' }],
        ['meta', { property: 'og:description', content: 'An opinionated full-stack TypeScript framework for Node.js by Inas Sirhan. Designed for building highly testable, maintainable, enterprise-grade applications with type-safe RESTful APIs.' }],
        ['meta', { property: 'og:url', content: 'https://devuxjs.com' }],
        ['meta', { name: 'twitter:card', content: 'summary' }],
        ['meta', { name: 'keywords', content: 'Inas Sirhan, nodejs, typescript, full-stack framework, clean architecture, type safety, typesafe api, api client generation, express, dependency injection, zod, testing, domain driven design, ddd' }],
        ['meta', { name: 'author', content: 'Inas Sirhan' }],
        ['script', { type: 'application/ld+json' }, JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Devux.js",
            "description": "An opinionated full-stack TypeScript framework for Node.js",
            "applicationCategory": "DeveloperApplication",
            "operatingSystem": "Cross-platform",
            "author": {
                "@type": "Person",
                "name": "Inas Sirhan",
                "url": "https://linkedin.com/in/inas-sirhan"
            },
            "url": "https://devuxjs.com"
        })],
    ],
    themeConfig: {
        // logo: '/favicon.svg',
        nav: [
            { text: 'Docs', link: '/docs/what-is-devux' },
            { text: 'by Inas Sirhan', link: 'https://linkedin.com/in/inas-sirhan' },
        ],
        sidebar: [
            {
                text: 'Introduction',
                items: [
                    { text: 'What is Devux?', link: '/docs/what-is-devux' },
                    { text: 'Getting Started', link: '/docs/getting-started' },
                ],
            },
            {
                text: 'Core Concepts',
                items: [
                    { text: 'Domains', link: '/docs/domains' },
                    { text: 'Endpoints', link: '/docs/endpoints' },
                    { text: 'Result Pattern', link: '/docs/result-pattern' },
                    { text: 'Automatic Validation', link: '/docs/automatic-validation' },
                    { text: 'Dependency Management', link: '/docs/dependency-management' },
                    {
                        text: 'Repos',
                        collapsed: true,
                        items: [
                            { text: 'Overview', link: '/docs/repos/' },
                            { text: 'Endpoint Repos', link: '/docs/repos/endpoint-repos' },
                            { text: 'Domain Repos', link: '/docs/repos/domain-repos' },
                            { text: 'Domain Service Repos', link: '/docs/repos/domain-service-repos' },
                        ],
                    },
                    { text: 'Scopes', link: '/docs/scopes' },
                    {
                        text: 'Services',
                        collapsed: true,
                        items: [
                            { text: 'Domain Services', link: '/docs/services/domain-services' },
                            { text: 'App Services', link: '/docs/services/app-services' },
                        ],
                    },
                    { text: 'Testers', link: '/docs/testers' },
                    { text: 'Base Classes', link: '/docs/base-classes' },
                    { text: 'Query Builder', link: '/docs/query-builder' },
                    { text: 'Syncing API', link: '/docs/syncing-api' },
                    { text: 'Syncing Translations', link: '/docs/syncing-translations' },
                    { text: 'Global Errors', link: '/docs/global-errors' },
                    { text: 'Core Hooks', link: '/docs/core-hooks' },
                    { text: 'Core Config', link: '/docs/core-config' },
                ],
            },
            {
                text: 'CLI',
                items: [
                    { text: 'Using the CLI', link: '/docs/cli' },
                    { text: 'Visualizer', link: '/docs/visualizer' },
                ],
            },
            {
                text: 'Guide',
                items: [
                    { text: '1. Create a Domain', link: '/docs/guide/first-domain' },
                    { text: '2. Create an Endpoint', link: '/docs/guide/first-endpoint' },
                    { text: '3. Create a Service', link: '/docs/guide/first-service' },
                    { text: '4. Create a Repo', link: '/docs/guide/first-repo' },
                    { text: '5. Add Dependencies', link: '/docs/guide/adding-dependencies' },
                ],
            },
            {
                text: 'Dig Deeper',
                items: [
                    { text: 'Architecture', link: '/docs/architecture' },
                    { text: 'Request Lifecycle', link: '/docs/request-lifecycle' },
                    { text: 'Dependency Injection', link: '/docs/dependency-injection' },
                    { text: 'Transaction Management', link: '/docs/transactions' },
                    { text: '__internals__', link: '/docs/internals' },
                ],
            },
        ],
        socialLinks: [
            { icon: 'github', link: 'https://github.com/inas-sirhan/devuxjs' },
            {
                icon: { svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fill="currentColor" d="M18 2H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zm0 4l-8 5-8-5V4l8 5 8-5v2z"/></svg>' },
                link: 'mailto:inassirhan@gmail.com'
            },
        ],
    },
});
