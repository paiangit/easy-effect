import { useRef, FC } from 'react';
import fetchAndPlayLottie from '../../utils/fetchAndPlayLottie';
// import useWrapperSize from '../../hooks/useWrapperSize';
import Draggable from '../../components/Draggable';
import LottiePlayerController from '../../components/LottiePlayController';
import { useAnimation } from '../../context/AnimationContext';
import style from './Simulator.module.less';

const Simulator: FC<{}> = () => {
  const animationRef = useRef();
  const {animation, setAnimation, animationStyle, setAnimationStyle} = useAnimation();
  const lottieName = 'edit-lottie';

  const onDragOver = (e) => {
    // 注意：这里必须要preventDefault()，才能走到onDrop()中，相当于是让元素可以被drop到其上
    e.preventDefault();
  };

  const onDrop = async (e) => {
    const lottieUrl = e.dataTransfer.getData('lottieUrl');
    if (!lottieUrl) return;
    const res = await fetchAndPlayLottie(lottieUrl, { container: animationRef.current, autoplay: false, name: lottieName });
    res.animation && setAnimation(res.animation);
  };

  // const { width, wrapperRef } = useWrapperSize();

  return (
    <div className={style.simulator} onDragOver={onDragOver} onDrop={onDrop} id="box">
      <Draggable
        container="#box"
        animationStyle={animationStyle}
        setAnimationStyle={setAnimationStyle}
        canDrag={true}
      >
        <div ref={animationRef} className={style.animation}></div>
      </Draggable>
      <LottiePlayerController animation={animation}/>
    </div>
  );
}

export default Simulator;
