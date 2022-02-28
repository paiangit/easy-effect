import { ArrowRightOutlined, ThunderboltFilled } from '@ant-design/icons';
import './MainPage.less';

function MainPage() {
  return (
    <div className="main-page">
      <h2 className="logo"><ThunderboltFilled /><span>Lottie Editor</span></h2>
      <p className="brief">快速制作精美动效</p>
      <p className="description">通过精美的动效模版和可视化编辑界面，让你轻松获得满意的动效～</p>
      <a href="/editor" className="button">立即使用<ArrowRightOutlined /></a>
    </div>
  );
}

export default MainPage;
