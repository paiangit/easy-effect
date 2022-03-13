import { useCallback, useEffect, useRef, useState } from 'react';
import { FixedSizeGrid as Grid } from 'react-window';
import { debounce } from 'lodash';
import useWrapperSize from '~hooks/useWrapperSize';
import lottiePlayer from '~utils/lottiePlayer';
import fetchAndPlayLottie from '~utils/fetchAndPlayLottie';
import style from './LeftPanel.module.less';
import { useAnimation } from '~/context/AnimationContext';

export default function LeftPanel(props) {
  const [previewVisible, setPreviewVisible] = useState(false);
  const { setAnimation, animationRef, animationWrapperRef, animationStyle, setAnimationStyle } = useAnimation();
  const { height, wrapperRef } = useWrapperSize();
  const previewRef = useRef();
  const rowCount = Math.ceil(props.data.length / 2);
  const lottieName = 'preview-template';

  const destroyLottie = () => lottiePlayer.destroy(lottieName);

  const onMouseEnter = (lottieUrl) => {
    // console.log('mouseenter');
    return debounce(async () => {
      destroyLottie();
      await fetchAndPlayLottie(lottieUrl, { container: previewRef.current, name: lottieName });
      setPreviewVisible(true);
    }, 20);
  };

  const removePreview = debounce(() => {
    // console.log('removePreview');
    destroyLottie();
    setPreviewVisible(false);
  }, 20);

  const onDragStart = (lottieUrl) => {
    return (e) => {
      e.dataTransfer.setData('lottieUrl', lottieUrl);
    };
  };

  const onMouseMove = useCallback((e) => {
    const x = e.clientX;
    const y = e.clientY;
    const { left, top, width, height } = wrapperRef.current.getBoundingClientRect();
    if (x > (left + width) || x < left || y > (top + height) || y < top) {
      removePreview();
    }
  }, [removePreview, wrapperRef]);
  // fix bug:
  // when switch preview extremely fastly,
  // the last preview animation not be destroyed because loading lottie data is async
  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
    }
  }, [onMouseMove]);

  const onClick = useCallback((lottieUrl) => {
    return async () => {
      console.log(lottieUrl);
      if (!lottieUrl) return;
      const res = await fetchAndPlayLottie(lottieUrl, { container: animationRef.current, autoplay: false, name: 'edit-animation' });
      res.animation && setAnimation(res.animation);

      // 计算放置后动画的坐标
      const { width } = animationWrapperRef.current.getBoundingClientRect();
      const parentHeight = animationWrapperRef.current.parentElement.parentElement.getBoundingClientRect().height;
      let newLeft = width/2 - animationStyle.width / 2;
      let newTop = parentHeight / 2 - animationStyle.height / 2;
      setAnimationStyle(Object.assign({}, animationStyle, { left: newLeft, top: newTop }));
    };
  }, [animationRef, animationStyle, setAnimation, setAnimationStyle, animationWrapperRef]);

  const Cell = (cellProps) => {
    const { rowIndex, columnIndex } = cellProps;
    const cellStyle = cellProps.style;
    const index = Math.min(rowIndex * 2 + columnIndex, props.data.length - 1);

    return (
      <div
        className={style['left-panel-item']}
        style={cellStyle}
        draggable={true}
        onMouseEnter={onMouseEnter(props.data[index].lottieUrl)}
        onMouseLeave={removePreview}
        onDragStart={onDragStart(props.data[index].lottieUrl)}
        onDragEnd={removePreview}
        onClick={onClick(props.data[index].lottieUrl)}
      >
        <div
          className={style.thumbnail}
          style={{ backgroundImage: `url(${props.data[index].thumbnail})` }}
        >
        </div>
      </div>
    );
  };

  return (
    <div className={`${style['left-panel']} ${props.className}`} ref={wrapperRef}>
      <Grid
        width={184}
        height={height}
        columnCount={2}
        columnWidth={86}
        rowCount={rowCount}
        rowHeight={90}
      >
        {Cell}
      </Grid>
      <div className={style.preview} ref={previewRef} style={{ display: `${previewVisible ? 'block' : 'none'}` }}></div>
    </div>
  );
}
