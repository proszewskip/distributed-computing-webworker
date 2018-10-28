import React from 'react';

import Link from 'next/link';

const Index = () => (
  <div>
    <Link href="/home">
      <a>Home</a>
    </Link>
    <Link href="/table-example">
      <a>Table example</a>
    </Link>
    <Link href="/form-example">
      <a>Form example</a>
    </Link>
    Hello Next.js
  </div>
);

export default Index;
