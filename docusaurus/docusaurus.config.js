// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from 'prism-react-renderer';

const organizationName = "karpatic";
const projectName = "ipynb2web";

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Ipynb2Web',
  tagline: 'Convert Notebook to Web Assets',
  favicon: 'img/favicon.ico',
  url: `https://${organizationName}.github.io`,
  baseUrl: `/${projectName}/`,
  organizationName,
  projectName,
  onBrokenLinks: 'ignore',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
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
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
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
            type: 'doc',
            docId: 'overview/README',
            label: 'Docs',
            position: 'left'
          },
          {
            to: 'https://karpatic.github.io/ipynb2web/jsdocs/',
            label: 'API',
            position: 'left'
          },
          // { to: '/blog', label: 'Blog', position: 'left' },
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
