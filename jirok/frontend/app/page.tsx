'use client';

import Navbar from '@/components/Navbar';
import { useEffect, useState } from 'react';

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/test')
      .then(res => res.json())
      .then(data => {console.log(data);setData(data);})
      .catch(err => console.error('FETCH ERROR', err));
  }, []);

  return ( <div className='min-h-screen bg-linear-to-br from-blue-100 via-white to-purple-100'>
      <Navbar/>
    </div>
  );
}