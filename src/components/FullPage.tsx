import style from './FullPage.module.less';

function FullPage(props) {
  return <div className={style['full-page']}>{props.children}</div>;
}

export default FullPage;
