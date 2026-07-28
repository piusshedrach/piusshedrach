import React from 'react';
import styled from 'styled-components';
import {
  Hero,
  About,
  Services,
  Featured,
  Process,
  Technologies,
  Contact,
} from '@components';
import { createMeta } from '@utils/seo';
import portfolioData from 'virtual:portfolio-data';

const StyledMainContainer = styled.main`
  counter-reset: section;
`;

export const meta = createMeta();

const featuredProjects = portfolioData.projects.filter(
  project => project.frontmatter.featured === true,
);

const IndexPage = ({ projects = featuredProjects }) => (
  <StyledMainContainer className="fillHeight">
    <Hero />
    <About />
    <Services />
    <Featured projects={projects} />
    <Process />
    <Technologies />
    <Contact />
  </StyledMainContainer>
);

export default IndexPage;
