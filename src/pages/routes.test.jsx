import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { ThemeProvider } from 'styled-components';
import { describe, expect, it } from 'vitest';
import theme from '@styles/theme';
import ArchivePage from './archive';
import InsightsPage from './pensieve';
import TagsPage from './pensieve/tags';

function renderRoute(component, path = '/') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <ThemeProvider theme={theme}>{component}</ThemeProvider>
    </MemoryRouter>,
  );
}

describe('static routes', () => {
  it('renders projects on the archive route', () => {
    renderRoute(
      <ArchivePage
        projects={[
          {
            frontmatter: {
              title: 'Example Project',
              category: 'Consultancy',
              services: ['Strategy'],
            },
          },
        ]}
      />,
      '/archive',
    );

    expect(screen.getByRole('heading', { name: 'All Work' })).toBeInTheDocument();
    expect(screen.getByText('Example Project')).toBeInTheDocument();
  });

  it('renders the empty Insights state', () => {
    renderRoute(<InsightsPage posts={[]} />, '/pensieve');

    expect(screen.getByText('Original articles are being prepared.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Return home' })).toHaveAttribute('href', '/');
  });

  it('renders populated tags', () => {
    renderRoute(
      <TagsPage tags={[{ name: 'Design', slug: 'design', totalCount: 2 }]} />,
      '/pensieve/tags',
    );

    expect(screen.getByRole('link', { name: /Design/ })).toHaveAttribute(
      'href',
      '/pensieve/tags/design',
    );
  });
});
