import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import useDocumentTitle from '~hooks/useDocumentTitle';
import Logo from '~components/Logo';
import Footer from './Footer';
import style from './MainPage.module.less';

function MainPage() {
  useDocumentTitle('动画易');

  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/editor');
  };

  return (
    <div className={style['main-page']}>
      <Logo className={style.logo}/>
      <p className={style.brief}>快速制作跨平台精美动效</p>
      <p className={style.description}>通过精美的动效模版和可视化编辑界面，让你轻松获得满意的动效，支持H5、iOS、Android三平台～</p>
      <Button className={style.button} type="primary" onClick={handleClick}>立即使用<ArrowRightOutlined /></Button>
      <Footer/>
    </div>
  );
}

export default React.memo(MainPage, () => false);
