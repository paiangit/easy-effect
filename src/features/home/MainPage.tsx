import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import useDocumentTitle from '~hooks/useDocumentTitle';
import Logo from '~components/Logo';
import Footer from './Footer';
import style from './MainPage.module.less';

function MainPage() {
  useDocumentTitle('动效易');

  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/editor');
  };

  return (
    <div className={style['main-page']}>
      <Logo className={style.logo}/>
      <div className={style.body}>
        <p className={style.brief}>快速制作精美动效</p>
        <p className={style.description}>
          基于精美的动效模版，进行动效可视化编辑，导出的动效支持跨平台（H5/iOS/Android/ReactNative）。开源免费，支持独立部署和二次开发。助您盘活动效资产，告别低效沟通和重复劳动～
        </p>
        <Button className={style.button} type="primary" onClick={handleClick}>立即使用<ArrowRightOutlined /></Button>
      </div>
      <Footer/>
    </div>
  );
}

export default React.memo(MainPage, () => false);
