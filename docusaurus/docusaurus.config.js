import { themes as prismThemes } from 'prism-react-renderer';

const organizationName = "karpatic";
const projectName = "ipynb2web";

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Ipynb2Web',
  tagline: 'Convert Python Notebooks to Web-Templatable Assets.',
  favicon: 'img/favicon.ico',
  url: `https://${organizationName}.github.io`,
  // baseUrl: `/${projectName}/`, // For Github pages
  baseUrl: '/',
  organizationName,
  projectName,
  onBrokenLinks: 'ignore',
  onBrokenMarkdownLinks: 'warn',
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  presets: [
    [
      'classic',
      ({
        docs: {
          sidebarPath: './sidebars.js',
        },
        blog: {
          showReadingTime: true
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],
  themeConfig:
    ({
      image: 'img/ipynb2web512.png',
      navbar: {
        title: 'Ipynb2Web',
        logo: {
          alt: 'Ipynb2Web Logo',
          src: 'img/ipynb2web.png',
        },
        items: [
          {
            type: 'doc',
            docId: 'overview/getting-started',
            label: 'Getting Started',
            position: 'left'
          },
          {
            to: 'https://ipynb2web.com/jsdocs/module-Ipynb2web_browser.html',
            label: 'API',
            position: 'left'
          },
          {
            href: 'https://ipynb2web.com/test/index.html',
            label: 'Try it out',
            position: 'right',
          },
          {
            href: 'https://github.com/karpatic/ipynb2web',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [],
        copyright: `Copyright © ${new Date().getFullYear()} Karpatic. All rights reserved. Licensed under the MIT License.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
