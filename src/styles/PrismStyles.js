import { css } from 'styled-components';

const codeColors = {
  bg: '#112340',
  lineHighlight: '#1d2d50',
  blue: '#5ccfe6',
  purple: '#c3a6ff',
  green: '#bae67e',
  yellow: '#ffd580',
  orange: '#ffae57',
  red: '#ef6b73',
  grey: '#a2aabc',
  comment: '#8695b799',
};

const PrismStyles = css`
  .markdown-content .code-block {
    position: relative;
    min-width: 100%;
    margin: 2em 0;
    padding: 3.25em 1.25em 1.25em;
    overflow: auto;
    border-radius: var(--border-radius);
    background-color: ${codeColors.bg};
    color: ${codeColors.grey};
    font-family: var(--font-mono);
    font-size: var(--fz-sm);
    line-height: 1.5;
  }

  .markdown-content .code-title {
    margin-bottom: -2em;
    padding: 1em 1.5em;
    border-bottom: 1px solid ${codeColors.lineHighlight};
    border-radius: var(--border-radius) var(--border-radius) 0 0;
    background-color: ${codeColors.bg};
    color: ${codeColors.grey};
    font-family: var(--font-mono);
    font-size: var(--fz-xs);

    & + .code-block {
      border-radius: 0 0 var(--border-radius) var(--border-radius);
    }
  }

  .markdown-content .code-block code {
    display: block;
    min-width: max-content;
    padding: 0;
    background: transparent;
    color: inherit;
    white-space: pre;
    tab-size: 2;
  }

  .markdown-content .code-block:has(code[class*='language-'])::before {
    position: absolute;
    top: 0;
    left: 1.25rem;
    padding: 0.25rem 0.5rem;
    border-radius: 0 0 3px 3px;
    background: var(--lightest-navy);
    color: var(--white);
    content: 'code';
    font-family: var(--font-mono);
    font-size: var(--fz-xxs);
    letter-spacing: 0.1em;
    line-height: 1.5;
    text-transform: uppercase;
  }

  .markdown-content .code-block:has(code.language-javascript)::before,
  .markdown-content .code-block:has(code.language-js)::before {
    content: 'js';
  }

  .markdown-content .code-block:has(code.language-jsx)::before {
    content: 'jsx';
  }

  .markdown-content .code-block:has(code.language-html)::before {
    content: 'html';
  }

  .markdown-content .code-block:has(code.language-css)::before {
    content: 'css';
  }

  .markdown-content .code-block:has(code.language-shell)::before,
  .markdown-content .code-block:has(code.language-sh)::before,
  .markdown-content .code-block:has(code.language-bash)::before {
    content: 'shell';
  }

  .markdown-content .code-block:has(code.language-yaml)::before {
    content: 'yaml';
  }

  .markdown-content .code-block:has(code.language-markdown)::before {
    content: 'md';
  }

  .markdown-content .code-block:has(code.language-json)::before,
  .markdown-content .code-block:has(code.language-json5)::before {
    content: 'json';
  }

  .hljs-comment,
  .hljs-quote {
    color: ${codeColors.comment};
  }

  .hljs-keyword,
  .hljs-selector-tag,
  .hljs-literal,
  .hljs-number {
    color: ${codeColors.purple};
  }

  .hljs-string,
  .hljs-regexp,
  .hljs-addition,
  .hljs-attribute {
    color: ${codeColors.green};
  }

  .hljs-title,
  .hljs-section,
  .hljs-name,
  .hljs-selector-id,
  .hljs-selector-class {
    color: ${codeColors.yellow};
  }

  .hljs-type,
  .hljs-built_in,
  .hljs-builtin-name,
  .hljs-symbol,
  .hljs-bullet {
    color: ${codeColors.blue};
  }

  .hljs-meta,
  .hljs-link,
  .hljs-deletion {
    color: ${codeColors.red};
  }

  .hljs-variable,
  .hljs-template-variable,
  .hljs-attr {
    color: ${codeColors.orange};
  }
`;

export default PrismStyles;
