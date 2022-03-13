import { AnimationConfigWithData, AnimationItem } from 'lottie-web/build/player/lottie_light';
import http from './http';
import lottiePlayer from './lottiePlayer';
import generateUUID from './generateUUID';

export function playAnimation({
  animationData,
  container,
  autoplay,
  loop,
  name,
  useSubFrames,
  speed,
}: AnimationConfigWithData & { useSubFrames?: boolean, speed?: number }) {
  return lottiePlayer.startOneAnimation({
    animationData,
    container,
    renderer: 'svg',
    autoplay: autoplay === undefined ? true : autoplay,
    loop: loop === undefined ? true : loop,
    name: name || generateUUID(),
  }, useSubFrames === undefined ? false : useSubFrames, speed || 1);
};

export default function fetchAndPlayLottie(lottieUrl: string, options: AnimationConfigWithData & { useSubFrames?: boolean, speed?: number }) {
  return new Promise<{animation: AnimationItem, animationData: any}>((resolve, reject) => {
    http(lottieUrl)
      .then(animationData => {
        const animation = playAnimation({
          ...options,
          animationData,
        });

        resolve({
          animation,
          animationData,
        });
      })
      .catch(err => {
        console.error(err);
        reject(err);
      });
  });
}
