'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/test')
      .then(res => res.json())
      .then(data => {console.log(data);setData(data);})
      .catch(err => console.error('FETCH ERROR', err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Frontend → Backend Test</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}