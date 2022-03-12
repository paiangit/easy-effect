import { FC } from 'react';
import AnimationSetting from './AnimationSetting';
import style from './RightArea.module.less';

const RightArea: FC<{}> = () => {
  return (
    <div className={ style['right-area'] }>
      <AnimationSetting/>
    </div>
  );
};

export default RightArea;
