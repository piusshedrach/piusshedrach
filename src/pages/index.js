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
import { getProjects } from '../../tools/content.server.js';

const StyledMainContainer = styled.main`
  counter-reset: section;
`;

export async function loader() {
  const projects = await getProjects();
  return { projects: projects.filter(project => project.frontmatter.featured === true) };
}

export const meta = createMeta();

const IndexPage = ({ loaderData }) => (
  <StyledMainContainer className="fillHeight">
    <Hero />
    <About />
    <Services />
    <Featured projects={loaderData.projects} />
    <Process />
    <Technologies />
    <Contact />
  </StyledMainContainer>
);

export default IndexPage;
