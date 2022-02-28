import { ArrowRightOutlined, ThunderboltFilled } from '@ant-design/icons';
import style from './MainPage.module.less';

function MainPage() {
  return (
    <div className={style['main-page']}>
      <h2 className={style.logo}><ThunderboltFilled /><span>Lottie Editor</span></h2>
      <p className={style.brief}>快速制作精美动效</p>
      <p className={style.description}>通过精美的动效模版和可视化编辑界面，让你轻松获得满意的动效～</p>
      <a href="/editor" className={style.button}>立即使用<ArrowRightOutlined /></a>
    </div>
  );
}

export default MainPage;
