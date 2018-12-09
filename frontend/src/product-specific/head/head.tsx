import NextHead from 'next/head';
import React, { StatelessComponent } from 'react';

import 'styles.css';

interface HeadProps {
  title?: string;
}

export const Head: StatelessComponent<HeadProps> = ({ title, children }) => {
  return (
    <NextHead>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>{title}</title>

      {children}
    </NextHead>
  );
};

Head.defaultProps = {
  title: 'Distributed Computing',
};
