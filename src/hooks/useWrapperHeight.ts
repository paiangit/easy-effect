import { useCallback, useEffect, useRef, useState } from 'react';

export default function useWrapperHeight() {
  const [height, setHeight] = useState(0);
  const wrapperRef = useRef(null);

  const handleResize = useCallback(() => {
    const computedStyle = window.getComputedStyle(wrapperRef.current);
    const paddingTop = (computedStyle.paddingTop || '').replace('px', '');
    const paddingBottom = (computedStyle.paddingTop || '').replace('px', '');

    setHeight(
      wrapperRef.current.getBoundingClientRect().height
      - (+paddingTop || 0)
      - (+paddingBottom || 0)
    );
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
  }, [handleResize]);

  return {
    height,
    wrapperRef,
  }
}
