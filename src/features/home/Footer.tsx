import style from './Footer.module.less';

const Footer = () => {
  return (
    <div className={style.footer}>
      Thanks to <a className={style.link} href="https://design.alipay.com/emotion">Ma Liang</a> for animation assets and <a className={style.link} href="https://github.com/ant-design/ant-design/">Ant Design</a> for UI Components.
    </div>
  );
};

export default Footer;
