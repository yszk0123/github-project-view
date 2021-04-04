import { globalStyle } from '@vanilla-extract/css';

globalStyle('html, body', {
  padding: 0,
  margin: 0,
  fontFamily:
    '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
});

globalStyle('a', {
  color: 'inherits',
  textDecoration: 'none',
});

globalStyle('*', {
  boxSizing: 'border-box',
});
