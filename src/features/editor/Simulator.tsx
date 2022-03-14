import {
  FC,
  // useEffect,
  // useCallback,
  useState,
  useCallback,
} from 'react';
import fetchAndPlayLottie from '~utils/fetchAndPlayLottie';
import Draggable from '~components/Draggable';
import LottiePlayerController from '~components/LottiePlayController';
import { useAnimation } from '~context/AnimationContext';
import style from './Simulator.module.less';

const Simulator: FC<{}> = () => {
  const {
    animation,
    setAnimation,
    animationRef,
    animationWrapperRef,
    animationStyle,
    setAnimationStyle,
    backgroundConfig,
  } = useAnimation();
  const [
    backgroundTransform,
    // setBackgroundTransform,
  ] = useState('');
  const lottieName = 'edit-animation';

  const onDragOver = useCallback(e => {
    // 注意：这里必须要preventDefault()，才能走到onDrop()中，相当于是让元素可以被drop到其上
    e.preventDefault();
  }, []);

  const onDrop = useCallback(
    async e => {
      const lottieUrl = e.dataTransfer.getData('lottieUrl');
      if (!lottieUrl) return;
      const { clientX, clientY } = e;
      const res = await fetchAndPlayLottie(lottieUrl, {
        container: animationRef.current,
        autoplay: false,
        name: lottieName,
      });
      res.animation && setAnimation(res.animation);
      // 计算放置后动效的坐标
      const { left, top, width, height } =
        animationWrapperRef.current.getBoundingClientRect();
      let newLeft = clientX - left - animationStyle.width / 2;
      let newTop = clientY - top - animationStyle.height / 2;
      newLeft = Math.min(Math.max(0, newLeft), width - animationStyle.width);
      newTop = Math.min(Math.max(0, newTop), height - animationStyle.height);
      setAnimationStyle(
        Object.assign({}, animationStyle, { left: newLeft, top: newTop })
      );
    },
    [
      animationRef,
      animationStyle,
      animationWrapperRef,
      setAnimation,
      setAnimationStyle,
    ]
  );

  // const initBackgroundTransform = useCallback(() => {
  //   const { width, height } = animationWrapperRef.current.parentElement.getBoundingClientRect();
  //   const containerAspectRatio = width / height;
  //   const currentWidth = backgroundConfig.width;
  //   const currentHeight = backgroundConfig.height;
  //   const currentAspectRatio = currentWidth / currentHeight;

  //   let destScale;
  //   if (containerAspectRatio > currentAspectRatio) {
  //     destScale = height / currentHeight;
  //   } else {
  //     destScale = width / currentWidth;
  //   }
  //   setBackgroundTransform(`scale(${destScale}) translate(-50%, -50%)`);
  // }, [backgroundConfig.height, backgroundConfig.width, setBackgroundTransform]);

  // // 初始化画布大小
  // useEffect(() => {
  //   initBackgroundTransform();
  // }, [initBackgroundTransform]);

  // useEffect(() => {
  //   window.addEventListener('resize', initBackgroundTransform);

  //   return () => {
  //     window.removeEventListener('resize', initBackgroundTransform);
  //   }
  // }, [initBackgroundTransform]);

  // 删除动效
  const onKeyUp = useCallback(
    e => {
      if (e.keyCode === 8 || e.keyCode === 46) {
        setAnimation(null);
      }
    },
    [setAnimation]
  );

  return (
    <div className={style.simulator}>
      {!animation && (
        <div
          className={style.tip}
          style={{ width: Math.min(backgroundConfig.width, 480) }}
        >
          <p className={style['tip-text']}>
            请从左侧列表中挑选动效到下面画板中编辑
          </p>
        </div>
      )}
      <div
        ref={animationWrapperRef}
        style={{ ...backgroundConfig, transform: backgroundTransform }}
        className={style['simulator-inner']}
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        <Draggable
          container={animationWrapperRef.current}
          animationStyle={animationStyle}
          setAnimationStyle={setAnimationStyle}
          canDrag={true}
          style={{ display: animation ? 'block' : 'none' }}
          onKeyUp={onKeyUp}
        >
          <div ref={animationRef} className={style.animation}></div>
        </Draggable>
      </div>
      <LottiePlayerController
        animation={animation}
        width={Math.min(backgroundConfig.width, 480)}
      />
    </div>
  );
};

export default Simulator;
