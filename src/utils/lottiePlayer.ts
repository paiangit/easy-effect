import LottiePlayer, {
  AnimationItem,
  AnimationConfigWithPath,
  AnimationConfigWithData,
  AnimationDirection,
} from 'lottie-web/build/player/lottie_light';

/**
 * lottie提供的方法
 *
  play(animationName?: string): void
  pause(animationName?: string): void
  togglePause(animationName?: string): void
  stop(animationName?: string): void
  goToAndPlay(value: number, isFrame: boolean, animationName): void
  goToAndStop(value: number, isFrame: boolean, animationName): void
  setSpeed(speed: number, animationName?: string): void
  setDirection(direction: AnimationDirection, animationName?: string): void
  searchAnimations(
    animationData?: any,
    standalone?: boolean,
    renderer?: string
  ): void
  loadAnimation(
    params: AnimationConfigWithPath | AnimationConfigWithData
  ): AnimationItem
  destroy(animationName?: string): void
  registerAnimation(element: Element, animationData?: any): void
  getRegisteredAnimations(): Array<any>
  setQuality(quality: string | number): void
  setLocationHref(href: string): void
  resize(): void
  freeze(): void
  unfreeze(): void
  inBrowser(): void
  installPlugin(type, plugin): void
  setSubframeRendering(flag): void
 */
class AnimationsPlayer {
  // @ts-ignore
  protected version: string = LottiePlayer.version;

  /**
   * 播放所有/某一个动效
   *
   * @param {string} [animationName]
   * @memberof AnimationsPlayer
   */
  public play(animationName?: string): void {
    LottiePlayer.play(animationName);
  }

  /**
   * 暂停所有/某一个动效
   *
   * @param {string} [animationName]
   * @memberof AnimationsPlayer
   */
  public pause(animationName?: string): void {
    LottiePlayer.pause(animationName);
  }

  /**
   * 切换所有/某一个动效的播放状态
   */
  public togglePause(animationName?: string): void {
    // @ts-ignore
    LottiePlayer.togglePause(animationName);
  }

  /**
   * 停止所有/某一个动效
   */
  public stop(animationName?: string): void {
    LottiePlayer.stop(animationName);
  }

  /**
   * 指定所有/某一个动效跳转到指定的位置并停止播放
   */
  public goToAndPlay(value: number, isFrame: boolean, animationName?: string): void {
    const regAnimations = this.getRegisteredAnimations(animationName);

    if (regAnimations.length) {
      regAnimations.forEach((regAnimation) => {
        const { playSpeed, animationData } = regAnimation;
        const { ip, op } = animationData;
        let destValue;
        if (isFrame) {
          destValue = value < ip ? ip : (value > op ? op : value);
        } else {
          const duration = regAnimation.getDuration() * 1000 / playSpeed;
          destValue = value < 0 ? 0 : (value > duration ? duration : value);
        }
        regAnimation.goToAndPlay(destValue);
      });
    }
  }

  /**
   * 指定所有/某一个动效跳转到指定的位置并停止播放
   */
  public goToAndStop(value: number, isFrame: boolean, animationName?: string): void {
    // @ts-ignore
    LottiePlayer.goToAndStop(value, isFrame, animationName);
    this.setDisplayStatus(animationName, 'block');
  }

  /**
   * 设置所有/某一个动效的播放倍速
   */
  public setSpeed(speed: number, animationName?: string): void {
    LottiePlayer.setSpeed(speed, animationName);
  }

  /**
   * 设置所有/某一个动效的播放方向
   */
  public setDirection(direction: AnimationDirection, animationName?: string): void {
    LottiePlayer.setDirection(direction, animationName);
  }

  /**
   * 查找DOM元素上具有class“lottie”或“bodymovin”的元素
   */
  public searchAnimations(animationData?: any, standalone?: boolean, renderer?: string): void {
    LottiePlayer.searchAnimations(animationData, standalone, renderer);
  }

  /**
   * 开始一个动效
   */
  public startOneAnimation(
    options: AnimationConfigWithPath | AnimationConfigWithData,
    useSubFrames: boolean = false,
    speed: number = 1
  ) {
    const regAnimations = this.getRegisteredAnimations([options.name]);

    // 销毁同名动效
    if (regAnimations.length) {
      regAnimations.forEach((regAnimation) => {
        regAnimation.destroy();
      });
    }

    this.setDisplayStatus(options.name, 'block');
    const animation = this.loadAnimation(options);
    animation.setSubframe(useSubFrames);
    animation.setSpeed(speed);
    animation.addEventListener('enterFrame', (e) => {
      if (e.currentTime === e.totalTime - 1) {
        setTimeout(() => {
          this.setDisplayStatus(options.name, 'none');
        }, 20);
      }
    });

    return animation;
  }

  /**
   * 设置元素display样式
   * @private
   * @param {*} id
   * @param {*} status
   */
  private setDisplayStatus(id: string, status: string) {
    if (!id || !status) {
      return;
    }
    const $el = document.getElementById(id);
    if (!$el) {
      return;
    }
    if ($el.style.display === 'none') {
      $el.style.display = status;
    }
  }

  /**
   * 返回动效实例，以单独控制
   *
   * 注意：这是一个相对比较耗时的操作，使用的时候值得注意，避免不必要的loadAnimation
   *
   * @param {(AnimationConfigWithPath | AnimationConfigWithData)} params
   * @returns {AnimationItem}
   * @memberof AnimationsPlayer
   */
  public loadAnimation(params: AnimationConfigWithPath | AnimationConfigWithData): AnimationItem {
    return LottiePlayer.loadAnimation(params);
  }

  /**
   * 销毁所有/某一指定名称的动效
   *
   * @param {string} [animationName]
   * @memberof AnimationsPlayer
   */
  public destroy(animationName?: string): void {
    LottiePlayer.destroy(animationName);
  }

  /**
   * 您可以直接使用registerAnimation注册元素。其中，element参数必须是具有指向data.json URL的“data-animation-path”属性的DOM元素。另外，当项目中要使用svg或html渲染器时，该元素还需要指定“data-anim-type”属性，属性值为svg或html。
   */
  public registerAnimation(element: Element, animationData?: any): void {
    LottiePlayer.registerAnimation(element, animationData);
  }

  /**
   * 返回所有动效实例
   */
  public getRegisteredAnimations(name?: Array<string> | string): Array<any> {
    // @ts-ignore
    const animations = LottiePlayer.getRegisteredAnimations();
    if (!name) {
      return animations;
    }

    let nameArr;
    if (typeof name === 'string') {
      nameArr = [name];
    } else {
      nameArr = name;
    }
    const result = [];
    animations.forEach((animation) => {
      nameArr.forEach((nm) => {
        if (animation.name === nm) {
          result.push(animation);
        }
      });
    });

    return result;
  }

  /**
   * 默认为“高”，设置为“高”，“中”，“低”或数字> 1以提高播放器性能。在某些动效中，低至2不会显示任何差异。
   */
  public setQuality(quality: string | number): void {
    LottiePlayer.setQuality(quality);
  }

  /**
   * 设置引用具有ID的svg元素的相对位置。当您在Safari中遇到遮罩问题时，此功能非常有用。
   */
  public setLocationHref(href: string): void {
    LottiePlayer.setLocationHref(href);
  }

  /**
   * 调整所有动效实例的大小
   */
  public resize(): void {
    // @ts-ignore
    LottiePlayer.resize();
  }

  /**
   * 冻结所有正在播放的动效或将要加载的动效
   */
  public freeze(): void {
    // @ts-ignore
    LottiePlayer.freeze();
  }

  /**
   * 取消所有动效的冻结
   *
   * @memberof AnimationsPlayer
   */
  public unfreeze(): void {
    // @ts-ignore
    LottiePlayer.unfreeze();
  }

  /**
   * 如果该库在浏览器中运行
   */
  public inBrowser(): boolean {
    // @ts-ignore
    return LottiePlayer.inBrowser();
  }

  /**
   * 安装插件
   */
  public installPlugin(type, plugin): void {
    // @ts-ignore
    LottiePlayer.installPlugin(type, plugin);
  }

  /**
   * 设置SubframeRendering
   */
  public setSubframeRendering(flag): void {
    // @ts-ignore
    LottiePlayer.setSubframeRendering(flag);
  }
}

// animationsPlayer可播放一组lottie动效
const animationsPlayer = new AnimationsPlayer();

export default animationsPlayer;
