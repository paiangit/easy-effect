import { useCallback, useEffect, useRef, useState } from 'react';

export default function useWrapperSize() {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const wrapperRef = useRef(null);

  const handleResize = useCallback(() => {
    const computedStyle = window.getComputedStyle(wrapperRef.current);
    const paddingLeft = (computedStyle.paddingLeft || '').replace('px', '');
    const paddingRight = (computedStyle.paddingRight || '').replace('px', '');
    const paddingTop = (computedStyle.paddingTop || '').replace('px', '');
    const paddingBottom = (computedStyle.paddingTop || '').replace('px', '');

    setWidth(
      wrapperRef.current.getBoundingClientRect().width
      - (+paddingLeft || 0)
      - (+paddingRight || 0)
    );
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
    width,
    height,
    wrapperRef,
  };
}
