import { CloudOutlined, FrownOutlined } from '@ant-design/icons';
import style from './NotFoundPage.module.less';

function NotFoundPage() {
  return (
    <div className={style['not-found-page']}>
      <CloudOutlined />
      <p className={style.info}>
        <FrownOutlined />
        &nbsp;页面去火星啦……
      </p>
    </div>
  );
}

export default NotFoundPage;
