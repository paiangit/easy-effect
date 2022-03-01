import { ThunderboltFilled } from '@ant-design/icons';
import style from './Logo.module.less';

function Logo(props) {
  return (
    <div className={`${style.logo} ${props.className}`}><ThunderboltFilled /><span className={style.text}>Lottie Editor</span></div>
  );
}

export default Logo;
