import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';
import featureStyles from './styles.module.css';

function HomepageFeatures() {
  return (
    <section className={featureStyles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((feature, idx) => (
            <div key={idx} className={clsx('col col--4')}>
              <div className="text--center">
                <img src={feature.img} className={featureStyles.featureSvg} role="img" alt={feature.title} />
              </div>
              <div className="text--center padding-horiz--md">
                <Heading as="h3">{feature.title}</Heading>
                <p>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const FeatureList = [
  {
    title: 'Made for the Web',
    img: '/img/ipynb2web.png',
    description: (
      <>
        Convert your .ipynb docs into web-templatable JSON assets with a single{' '}
        <a href="https://ipynb2web.com/jsdocs/module-convert.html#.nb2json">command</a>.
      </>
    ),
  },
  {
    title: 'Minimally Opinionated',
    img: '/img/features/minimally-opinionated.svg',
    description: (
      <>
        Ipynb2web’s BYO-template approach means less fighting defaults and more building your design—or integrating with existing tools.
      </>
    ),
  },
  {
    title: 'Focus on What Matters',
    img: '/img/features/focus-matters.svg',
    description: (
      <>
        Built to handle the gritty details other notebook conversion tools leave out. Automatically remove system logs, warnings, error messages, and more.
      </>
    ),
  },
  {
    title: 'For All Environments',
    img: '/img/features/all-environments.svg',
    description: (
      <>
        Render assets on the <a href="https://ipynb2web.com/jsdocs/module-node.html">server</a> or in the{' '}
        <a href="https://ipynb2web.com/jsdocs/module-browser.html">browser</a>, using Modules, Vanilla JS, and even your{' '}
        <a href="https://ipynb2web.com/jsdocs/module-cli.html">terminal</a>.
      </>
    ),
  },
  {
    title: 'Powerful Markup',
    img: '/img/features/powerful-markup.svg',
    description: (
      <>
        Choose what to show, what to hide, and how it should appear: footnotes, breadcrumbs, collapsible content, and more.
      </>
    ),
  },
  {
    title: 'Built-in Automation',
    img: '/img/features/built-in-automation.svg',
    description: (
      <>
        On the server side, traverse directories and generate Python modules, tables of contents, sitemaps, cover photos, and audio transcriptions.
      </>
    ),
  },
];

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={`Hello from ${siteConfig.title}`} description="Description will go into a meta tag in <head />">
      <header className={clsx('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <Heading as="h1" className="hero__title">
            {siteConfig.title}
          </Heading>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link className="button button--secondary button--lg" to="/docs/overview/getting-started">
              5min ⏱️ Tutorial
            </Link>
          </div>
        </div>
      </header>
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
