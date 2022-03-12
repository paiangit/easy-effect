import { Tooltip } from 'antd';
import { useCallback } from 'react';
import style from './LeftAreaNav.module.less';

export default function LeftAreaNav(props) {
  const handleClick = useCallback((index: number) => {
    return () => {
      props.onActiveIndexChange(index);
    };
  }, [props]);

  const generateList = useCallback((data) => {
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
  }, [handleClick, props.activeIndex]);

  return (
    <ul className={ `${style['left-area-nav']} ${props.className}` }>
      { generateList(props.data) }
    </ul>
  );
}
