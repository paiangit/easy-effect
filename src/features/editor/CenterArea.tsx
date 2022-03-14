// import { Button } from 'antd';
// import { DesktopOutlined, MobileOutlined } from '@ant-design/icons';
import Simulator from './Simulator';
import style from './CenterArea.module.less';

export default function CenterArea() {
  return (
    <div className={style['editor-center-area']}>
      {/* <div className={ style['toolbar'] }>
        <Button size="small" type="text"><DesktopOutlined /></Button>
        <Button size="small" type="text"><MobileOutlined /></Button>
      </div> */}
      <div className={style['canvas']}>
        <div className={style['canvas-content']}>
          <Simulator />
          {/* <iframe title="设计器" className={ style['simulator'] }></iframe> */}
        </div>
      </div>
    </div>
  );
}
