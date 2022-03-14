import React, { ReactNode, useState, useRef, MutableRefObject } from 'react';
import { AnimationItem } from 'lottie-web/build/player/lottie_light';
import { AnimationStyle } from '~components/Draggable';

export type Animation = AnimationItem & {
  animationData?: any;
  wrapper?: HTMLElement;
};
export interface BackGroundConfig {
  width: number;
  height: number;
  backgroundColor: string;
}

const AnimationContext = React.createContext<
  | {
      animation: Animation;
      setAnimation: (animation: Animation) => void;
      animationRef: MutableRefObject<HTMLDivElement | undefined>;
      animationWrapperRef: MutableRefObject<HTMLDivElement | undefined>;
      animationStyle: AnimationStyle;
      setAnimationStyle: (animationStyle: AnimationStyle) => void;
      backgroundConfig: BackGroundConfig;
      setBackgroundConfig: (backgroundConfig: BackGroundConfig) => void;
    }
  | undefined
>(undefined);

AnimationContext.displayName = 'AnimationContext';

export const AnimationProvider = ({ children }: { children: ReactNode }) => {
  const animationRef = useRef<HTMLDivElement>();
  const animationWrapperRef = useRef<HTMLDivElement>();
  const [animation, setAnimation] = useState<Animation>();
  const [animationStyle, setAnimationStyle] = useState<AnimationStyle>({
    left: 0, // 初始x坐标
    top: 0, // 初始y坐标
    width: 375, // 元素宽
    height: 375, // 元素高
    zIndex: 1, // 层级
    transform: '', // 变换（用于旋转）
  });
  const [backgroundConfig, setBackgroundConfig] = useState<BackGroundConfig>({
    width: 750, // 背景宽
    height: 1334, // 背景高
    backgroundColor: 'rgba(65, 65, 65, .5)', // 背景色
  });

  return (
    <AnimationContext.Provider
      children={children}
      value={{
        animation,
        setAnimation, // 设置画板区域的动效实例
        animationRef,
        animationWrapperRef,
        animationStyle,
        setAnimationStyle, // 设置画板区包裹动效的可拖拽容器的样式（包括位置、大小、旋转角度等）
        backgroundConfig,
        setBackgroundConfig, // 设置动效背景样式（包括大小、背景色等）
      }}
    />
  );
};

export const useAnimation = () => {
  const context = React.useContext(AnimationContext);

  if (!context) {
    throw new Error('useAnimation必须在AnimationProvider中使用');
  }

  return context;
};
