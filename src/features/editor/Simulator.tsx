import { useRef, FC, useState } from 'react';
import { AnimationItem } from 'lottie-web';
import fetchAndPlayLottie from '../../utils/fetchAndPlayLottie';
// import useWrapperSize from '../../hooks/useWrapperSize';
import Draggable from '../../components/Draggable';
import LottiePlayerController from '../../components/LottiePlayController';
import style from './Simulator.module.less';

const Simulator: FC<{}> = () => {
  const animationRef = useRef();
  const [currentAnimation, setCurrentAnimation] = useState<AnimationItem>();
  const lottieName = 'edit-lottie';

  const onDragOver = (e) => {
    // 注意：这里必须要preventDefault()，才能走到onDrop()中，相当于是让元素可以被drop到其上
    e.preventDefault();
  };

  const onDrop = async (e) => {
    const lottieUrl = e.dataTransfer.getData('lottieUrl');
    if (!lottieUrl) return;
    const res = await fetchAndPlayLottie(lottieUrl, { container: animationRef.current, autoplay: false, name: lottieName });
    res.animation && setCurrentAnimation(res.animation);
  };

  // const { width, wrapperRef } = useWrapperSize();

  return (
    <div className={style.simulator} onDragOver={onDragOver} onDrop={onDrop} id="box">
      <Draggable
        container="#box"
        position={[0, 0]}
        width={375}
        height={375}
        canDrag={true}
      >
        <div ref={animationRef} className={style.animation}></div>
      </Draggable>
      <LottiePlayerController animation={currentAnimation}/>
    </div>
  );
}

export default Simulator;
