import { ThunderboltFilled } from '@ant-design/icons';
import style from './Logo.module.less';

function Logo(props) {
  return (
    <div className={`${style.logo} ${props.className}`}>
      <ThunderboltFilled />
      <span className={style.text}>动效易</span>
    </div>
  );
}

export default Logo;
