import React from 'react';
import PropTypes from 'prop-types';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'react-router';
import { Layout } from '@components';
import favicon16 from '@images/favicons/favicon-16x16.png';
import favicon32 from '@images/favicons/favicon-32x32.png';
import appleTouchIcon from '@images/favicons/apple-icon-180x180.png';

export const links = () => [
  { rel: 'icon', type: 'image/png', sizes: '16x16', href: favicon16 },
  { rel: 'icon', type: 'image/png', sizes: '32x32', href: favicon32 },
  { rel: 'apple-touch-icon', sizes: '180x180', href: appleTouchIcon },
  { rel: 'manifest', href: '/manifest.webmanifest' },
];

export function LayoutDocument({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0a192f" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

LayoutDocument.propTypes = {
  children: PropTypes.node.isRequired,
};

export default function App() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}
