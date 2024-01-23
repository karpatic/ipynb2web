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
    title: 'Made for the web',
    img: './img/ipynb2web.png',
    description: (
      <>
        Convert your .ipynb docs into web-templatable json assets with the use of a single <a href='https://karpatic.github.io/ipynb2web/jsdocs/module-convert.html#.nb2json'>command</a>.
      </>
    ),
  },
  {
    title: 'Minimally Opinionated',
    img: './img/ipynb2web.png',
    description: (
      <>
        Ipynb2web's BYO-Template approach means no more fighting a design choice Build your own design or integrate into existing tools.
      </>
    ),
  },
  {
    title: 'Focus on What Matters',
    img: './img/ipynb2web.png',
    description: (
      <>
        Built to handle gritty details other notebook conversion tools leave out. Auto remove system logs, warnings, error messages, and more.
      </>
    ),
  },
  {
    title: 'For all environments',
    img: './img/ipynb2web.png',
    description: (
      <>
        Render assets on the <a href="https://karpatic.github.io/ipynb2web/jsdocs/module-node.html">server</a> or in the <a href="https://karpatic.github.io/ipynb2web/jsdocs/module-browser.html">browser</a>; Using Modules, Vanilla JS, and even your <a href="https://karpatic.github.io/ipynb2web/jsdocs/module-cli.html">terminal</a>.
      </>
    ),
  },
  {
    title: 'Powerful Markup',
    img: './img/ipynb2web.png',
    description: (
      <>
        Choose what to show, what to hide, and how it should appear: Footnotes, Breadcrumbs, Collapsible Content, etc.
      </>
    ),
  },
  {
    title: 'Powerful Markup',
    img: './img/ipynb2web.png',
    description: (
      <>
        Server side implementation can traverse directories, creating python modules, table of contents, sitemaps, cover-photos, and audio transcriptions.
      </>
    ),
  },
];

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <header className={clsx('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <Heading as="h1" className="hero__title">
            {siteConfig.title}
          </Heading>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className="button button--secondary button--lg"
              to="/docs/overview/getting-started">
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
