import AnimationSetting from './AnimationSetting';
import style from './RightArea.module.less';

export default function RightArea() {
  return (
    <div className={ style['right-area'] }>
      <AnimationSetting/>
    </div>
  );
}
