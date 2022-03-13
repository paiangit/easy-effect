import {
  useRef,
  FC,
  // useEffect,
  // useCallback,
  useState,
  useCallback
} from 'react';
import fetchAndPlayLottie from '~utils/fetchAndPlayLottie';
import Draggable from '~components/Draggable';
import LottiePlayerController from '~components/LottiePlayController';
import { useAnimation } from '~context/AnimationContext';
import style from './Simulator.module.less';

const Simulator: FC<{}> = () => {
  const animationRef = useRef<HTMLDivElement>();
  const wrapperRef = useRef<HTMLDivElement>();
  const {animation, setAnimation, animationStyle, setAnimationStyle, backgroundConfig } = useAnimation();
  const [
    backgroundTransform,
    // setBackgroundTransform,
  ] = useState('');
  const lottieName = 'edit-lottie';

  const onDragOver = useCallback((e) => {
    // 注意：这里必须要preventDefault()，才能走到onDrop()中，相当于是让元素可以被drop到其上
    e.preventDefault();
  }, []);

  const onDrop = useCallback(async (e) => {
    const lottieUrl = e.dataTransfer.getData('lottieUrl');
    if (!lottieUrl) return;
    const res = await fetchAndPlayLottie(lottieUrl, { container: animationRef.current, autoplay: false, name: lottieName });
    res.animation && setAnimation(res.animation);
  }, [setAnimation]);

  // const initBackgroundTransform = useCallback(() => {
  //   const { width, height } = wrapperRef.current.parentElement.getBoundingClientRect();
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

  return (
    <div className={style.simulator}>
      { !animation && <div className={style.placeholder} style={{width: Math.min(backgroundConfig.width, 700)}}>请从左侧列表中拖入动画到此处编辑</div> }
      <div
        ref={wrapperRef}
        style={{...backgroundConfig, transform: backgroundTransform}}
        className={style['simulator-inner']}
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        <Draggable
          container={wrapperRef.current}
          animationStyle={animationStyle}
          setAnimationStyle={setAnimationStyle}
          canDrag={true}
          style={{display: animation ? 'block' : 'none'}}
        >
          <div ref={animationRef} className={style.animation}></div>
        </Draggable>
      </div>
      <LottiePlayerController animation={animation} width={Math.min(backgroundConfig.width, 700)}/>
    </div>
  );
}

export default Simulator;
