import React, {ReactNode, useState} from 'react';
import { AnimationItem } from 'lottie-web';
import { AnimationStyle } from '../components/Draggable';

export type Animation = AnimationItem & {animationData?: any, wrapper?: HTMLElement};

const AnimationContext = React.createContext<
  | {
    animation: Animation;
    setAnimation: (animation: Animation) => void;
    animationStyle: AnimationStyle;
    setAnimationStyle: (animationStyle: AnimationStyle) => void;
  }
  | undefined
>(undefined);

AnimationContext.displayName = 'AnimationContext';

export const AnimationProvider = ({ children }: { children: ReactNode }) => {
  const [animation, setAnimation] = useState<Animation>();
  const [animationStyle, setAnimationStyle] = useState<AnimationStyle>({
    left: 0, // 初始x坐标
    top: 0, // 初始y坐标
    width: 375, // 元素宽
    height: 375, // 元素高
    zIndex: 1, // 层级
    transform: '', // 变换（用于旋转）
  });

  return (
    <AnimationContext.Provider children={children} value={{animation, setAnimation, animationStyle, setAnimationStyle}}/>
  );
}

export const useAnimation = () => {
  const context = React.useContext(AnimationContext);

  if (!context) {
    throw new Error('useAnimation必须在AnimationProvider中使用');
  }

  return context;
}
