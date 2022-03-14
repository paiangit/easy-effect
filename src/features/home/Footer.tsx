import style from './Footer.module.less';

const Footer = () => {
  return (
    <div className={style.footer}>
      Thanks to{' '}
      <a
        className={style['external-link']}
        href="https://design.alipay.com/emotion"
      >
        Ma Liang
      </a>{' '}
      for animation assets.
    </div>
  );
};

export default Footer;
