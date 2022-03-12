import style from './Footer.module.less';

const Footer = () => {
  return (
    <div className={style.footer}>
      Animation assets are from <a className={style.link} href="https://design.alipay.com/emotion">MaLiang</a>
    </div>
  );
};

export default Footer;
