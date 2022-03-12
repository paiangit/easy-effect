import LeftArea from './LeftArea';
import CenterArea from './CenterArea';
import RightArea from './RightArea';
import useDocumentTitle from '~hooks/useDocumentTitle';
import { AnimationProvider } from '../../context/AnimationContext';
import Header from './Header';
import style from './EditorPage.module.less';

export default function EditorPage() {
  useDocumentTitle('Lottie动画编辑');

  return (
    <AnimationProvider>
      <div className={style['editor-page']}>
        <div className={style.header}>
          <Header/>
        </div>
        <div className={style.body}>
          <LeftArea></LeftArea>
          <CenterArea></CenterArea>
          <RightArea></RightArea>
        </div>
      </div>
    </AnimationProvider>
  );
}
