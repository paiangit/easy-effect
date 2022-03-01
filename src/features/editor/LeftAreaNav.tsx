import { Tooltip } from 'antd';
import style from './LeftAreaNav.module.less';

export default function LeftAreaNav(props) {
  function handleClick(index: number) {
    return () => {
      props.onActiveIndexChange(index);
    };
  }

  function generateList(data) {
    return data.map((item, index) => (
      <li
        className={props.activeIndex === index ? `${style['nav-item']} ${style['active']}` : style['nav-item']}
        onClick={handleClick(index)}
        key={index}
        >
        <Tooltip title={item.title} placement="right">
          <button className={ style['button'] }>
            <span className={`iconfont ${item.category}`}></span>
          </button>
        </Tooltip>
      </li>
    ));
  }

  return (
    <ul className={ `${style['left-area-nav']} ${props.className}` }>
      { generateList(props.data) }
    </ul>
  );
}
