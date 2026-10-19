import React from 'react';
import PropTypes from 'prop-types';
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';
import { Layout as SiteLayout } from '@components';
import favicon16 from '@images/favicons/favicon-16x16.png';
import favicon32 from '@images/favicons/favicon-32x32.png';
import appleTouchIcon from '@images/favicons/apple-icon-180x180.png';

export const links = () => [
  { rel: 'icon', type: 'image/png', sizes: '16x16', href: favicon16 },
  { rel: 'icon', type: 'image/png', sizes: '32x32', href: favicon32 },
  { rel: 'apple-touch-icon', sizes: '180x180', href: appleTouchIcon },
  { rel: 'manifest', href: '/manifest.webmanifest' },
];

// Critical shell styles inlined into the prerendered HTML head.
// styled-components injects its CSS client-side only, so without this the
// unstyled "Skip to Content" link and a full-size loader hexagon flash
// on screen before hydration. Keep in sync with GlobalStyle/loader styles.
const criticalShellCss = `
  html, body { margin: 0; }
  html { box-sizing: border-box; }
  *, *::before, *::after { box-sizing: inherit; }
  body {
    background-color: #0a192f;
    color: #8892b0;
    font-family: 'Calibre', 'Inter', 'San Francisco', 'SF Pro Text', -apple-system,
      system-ui, sans-serif;
    font-size: 20px;
    line-height: 1.3;
    overflow-x: hidden;
  }
  .skip-to-content {
    position: absolute;
    top: auto;
    left: -999px;
    width: 1px;
    height: 1px;
    overflow: hidden;
    z-index: -99;
    color: #64ffda;
    background-color: transparent;
    border: 1px solid #64ffda;
    border-radius: 4px;
    font-size: 13px;
    font-family: 'SF Mono', 'Fira Code', 'Fira Mono', 'Roboto Mono', monospace;
    line-height: 1;
    text-decoration: none;
    padding: 1.25rem 1.75rem;
  }
  .loader {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #020c1b;
    z-index: 99;
  }
  .logo-wrapper {
    width: max-content;
    max-width: 100px;
    opacity: 0;
    transition: all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);
  }
  .logo-wrapper svg {
    display: block;
    width: 100%;
    height: 100%;
    margin: 0 auto;
    fill: none;
    user-select: none;
  }
  #logo { color: #64ffda; }
  #logo #P { opacity: 0; }
`;

export function Layout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0a192f" />
        <Meta />
        <Links />
        <style dangerouslySetInnerHTML={{ __html: criticalShellCss }} />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default function App() {
  return (
    <SiteLayout>
      <Outlet />
    </SiteLayout>
  );
}
