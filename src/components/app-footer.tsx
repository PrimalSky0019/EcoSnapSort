'use client';

import { useEffect, useState } from 'react';

export function AppFooter() {
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-secondary py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
        <p>&copy; {year} Eco Snap Sort. All Rights Reserved.</p>
        <p className="text-sm mt-2">Making our world cleaner, one community at a time.</p>
      </div>
    </footer>
  );
}
