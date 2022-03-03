import { useRef, FC } from 'react';
import fetchAndPlayLottie from '../../utils/fetchAndPlayLottie';
import useWrapperSize from '../../hooks/useWrapperSize';
import Draggable from './Draggable';
import style from './Simulator.module.less';

const Simulator: FC<{}> = () => {
  const animationRef = useRef();
  const lottieName = 'edit-lottie';

  const onDragOver = (e) => {
    // 注意：这里必须要preventDefault()，才能走到onDrop()中，相当于是让元素可以被drop到其上
    e.preventDefault();
  };

  const onDrop = (e) => {
    const lottieUrl = e.dataTransfer.getData('lottieUrl');
    if (!lottieUrl) return;
    fetchAndPlayLottie(lottieUrl, { container: animationRef.current, autoplay: false, name: lottieName });
  };

  const { width, wrapperRef } = useWrapperSize();

  return (
    <div ref={wrapperRef} className={style.simulator} onDragOver={onDragOver} onDrop={onDrop} id="box">
      <Draggable
        container="#box"
        position={[0, 0]}
        width={375}
        height={375}
        canDrag={true}
      >
        <div ref={animationRef} className={style.animation}>
        </div>
      </Draggable>
    </div>
  );
}

export default Simulator;
