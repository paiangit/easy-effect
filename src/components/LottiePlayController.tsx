/**
 * Lottie 动效播放控制器
 */
import { FC, useEffect, useState, useRef, useCallback } from 'react';
import { Button, Progress } from 'antd';
import classNames from 'classnames';
import {
  AnimationItem,
  AnimationDirection,
} from 'lottie-web/build/player/lottie_light';
import style from './LottiePlayController.module.less';

// 速度增减的步长
// const speedStepLength = 0.5;

const LottiePlayController: FC<{ animation: AnimationItem; width: number }> = ({
  animation,
  width,
}) => {
  const [isPaused, setIsPaused] = useState<boolean>();
  const [loop, setLoop] = useState<boolean | number>();
  const [percent, setPercent] = useState<number>(0);
  const directionRef = useRef<AnimationDirection>(1);
  // const speedRef = useRef<number>(1);

  // 播放和暂停切换
  const togglePause = () => {
    if (!animation) return;

    if (animation.isPaused) {
      animation.play();
      setIsPaused(false);
    } else {
      animation.pause();
      setIsPaused(true);
    }
  };

  // 停止播放
  const stop = useCallback(() => {
    if (!animation) return;

    animation.goToAndStop(
      directionRef.current === 1 ? 0 : animation.totalFrames
    );
    setIsPaused(true);
  }, [animation]);

  // 设置动效进度条百分比
  // const setPercent = (progress) => {
  //   if (!animation) return;

  //   animation.goToAndStop(animation.totalFrames);
  //   setIsPaused(true);
  // }

  // 加速
  // const speedUp = () => {
  //   if (!animation) return;

  //   speedRef.current += speedStepLength;
  //   animation.setSpeed(speedRef.current);
  // };

  // 减速
  // const slowDown = () => {
  //   if (!animation) return;

  //   speedRef.current -= speedStepLength;
  //   animation.setSpeed(speedRef.current);
  // };

  // 跳转到某位置继续播放
  // const goToAndPlay = (n, isFrame) => {
  //   if (!animation) return;

  //   animation.goToAndPlay(n, isFrame);
  // };

  // 跳转到某位置并停止播放
  const goToAndStop = useCallback(
    (n, isFrame) => {
      if (!animation) return;

      animation.goToAndStop(n, isFrame);
      setIsPaused(true);
    },
    [animation]
  );

  // const toggleDirection = () => {
  //   if (!animation) return;
  //   directionRef.current = -directionRef.current as AnimationDirection;
  //   animation.setDirection(directionRef.current);
  // };

  // // 销毁动效
  // const destroy = () => {
  //   if (!animation) return;

  //   animation.destroy();
  // };

  // resize动效
  // const resize = () => {
  //   animation.resize();
  // };

  // 切换是否循环播放标记
  const toggleLoop = () => {
    setLoop(!loop);
    animation.loop = !loop;
  };

  // 根据animation中的对应数据初始化状态：isPaused和loop
  useEffect(() => {
    animation && setIsPaused(animation.isPaused);
    animation && setLoop(animation.loop);
  }, [animation]);

  const onEnterframe = useCallback(
    e => {
      // console.log('enterFrame', e);
      if (directionRef.current === 1) {
        setPercent(Math.floor((e.currentTime * 100) / e.totalTime));

        if (e.currentTime >= e.totalTime - 1 && !animation.loop) {
          stop();
        }
      } else {
        setPercent(100 - Math.floor((e.currentTime * 100) / e.totalTime));
        if (e.currentTime <= 1 && !animation.loop) {
          goToAndStop(animation.totalFrames, true);
        }
      }
    },
    [animation, goToAndStop, stop]
  );

  // 当不循环时，在播放结束时，跳转至动效开头，并切换暂停按钮状态为播放，便于直接点击播放按钮再次播放，增强体验
  useEffect(() => {
    animation && animation.addEventListener('enterFrame', onEnterframe);
    return () => {
      // TODO: 这里有个报错，_cbs为null，待排查处理
      (animation as any)?._cbs && animation.removeEventListener('enterFrame');
    };
  }, [animation, stop, goToAndStop, onEnterframe]);

  if (!animation) {
    return <></>;
  }

  return (
    <div className={style['lottie-player-controller']} style={{ width: width }}>
      <div className={style['percent-wrap']}>
        <Progress
          percent={percent}
          showInfo={false}
          size="small"
          strokeColor={'#877d7d'}
          strokeWidth={1}
        />
      </div>
      <div className={style.buttons}>
        <Button type="link" className={style.button} onClick={togglePause}>
          {isPaused ? (
            <span
              title="播放"
              className={classNames('iconfont', 'icon-bofang')}
            />
          ) : (
            <span
              title="暂停"
              className={classNames('iconfont', 'icon-zanting')}
            ></span>
          )}
        </Button>
        <Button type="link" className={style.button} onClick={stop}>
          <span
            title="停止"
            className={classNames('iconfont', 'icon-tingzhi')}
          />
        </Button>
        {/* <Button
          type="link"
          className={style.button}
          onClick={() => slowDown()}
        ><span title="加速" className={classNames('iconfont', 'icon-jiansu')} /></Button>
        <Button
          type="link"
          className={style.button}
          onClick={() => speedUp()}
        ><span title="减速" className={classNames('iconfont', 'icon-jiasu')} /></Button> */}
        {/* <Button
          type="link"
          className={style.button}
          onClick={() => goToAndStop(20, true)}
        ><span title="跳转" className={classNames('iconfont', 'icon-tiaozhuan')} /></Button> */}
        {/* <Button
          type="link"
          className={style.button}
          onClick={() => toggleDirection()}
        ><span title="反方向" className={classNames('iconfont', 'icon-fanxiang')} /></Button> */}
        <Button
          type="link"
          className={style.button}
          onClick={() => toggleLoop()}
        >
          {loop ? (
            <span
              title="不循环"
              className={classNames('iconfont', 'icon-buxunhuan')}
            ></span>
          ) : (
            <span
              title="循环"
              className={classNames('iconfont', 'icon-xunhuan')}
            />
          )}
        </Button>
      </div>
    </div>
  );
};

export default LottiePlayController;
