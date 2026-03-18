import { useEffect, useState } from 'react';

const MOBILE_BREAKPOINT = 480;
const MOBILE_PAGE_SIZE = 6;
const DESKTOP_PAGE_SIZE = 9;

export function usePageSize() {
  const [pageSize, setPageSize] = useState(() =>
    window.innerWidth <= MOBILE_BREAKPOINT
      ? MOBILE_PAGE_SIZE
      : DESKTOP_PAGE_SIZE,
  );

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);

    function handleChange(e) {
      setPageSize(e.matches ? MOBILE_PAGE_SIZE : DESKTOP_PAGE_SIZE);
    }

    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, []);

  return pageSize;
}
