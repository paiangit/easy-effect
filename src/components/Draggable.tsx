import React, {
  FC,
  ReactNode,
  useState,
  useRef,
  useEffect,
  useCallback,
  memo,
  CSSProperties,
  KeyboardEvent,
} from 'react';
import classnames from 'classnames';
import './Draggable.less';

export interface AnimationStyle {
  left: number;
  top: number;
  width: number;
  height: number;
  zIndex: number;
  transform: string;
}

export interface DraggableProps {
  container: HTMLElement | string; // 画布元素或者画布id
  canDrag?: boolean; // 是否禁止拖拽
  animationStyle: AnimationStyle;
  setAnimationStyle: (animationStyle: AnimationStyle) => void;
  onDragStart?: (params) => void; // 鼠标拖拽开始
  onDragStop?: (params) => void; // 鼠标拖拽结束
  children: ReactNode;
  style: CSSProperties;
  onKeyUp?;
}

interface Position {
  left: number;
  top: number;
  cX: number;
  cY: number;
  [name: string]: any;
}

// 操作手柄
const handles = [
  'east',
  'west',
  'south',
  'north',
  'north-east',
  'north-west',
  'south-east',
  'south-west',
  'rotate',
] as const;
type HandleType = typeof handles[number] | 'move';

const Draggable: FC<DraggableProps> = ({
  container = document.body,
  animationStyle,
  setAnimationStyle,
  canDrag = true,
  onDragStart,
  onDragStop,
  children,
  style,
  onKeyUp = (e: KeyboardEvent<Element>) => {},
}) => {
  const dragContainer = useRef<HTMLElement | null>();

  // 初始数据，因为不需要重新 render 所以用 useRef
  const originPosition = useRef<Position>({
    left: 0, // 元素的坐标
    top: 0,
    cX: 0, // 鼠标的坐标
    cY: 0,
  });

  const handleType = useRef<HandleType>();

  const isMouseDown = useRef(false);

  const getTanDeg = (tan: number) => {
    var result = (Math.atan(tan) * 180) / Math.PI;
    result = Math.round(result);

    return result;
  };

  const getItemStyle = useCallback(
    (
      handleType: HandleType, // 操作类型
      originPosition: Position, // 鼠标按下时所记录的坐标
      position: { x: number; y: number }
    ) => {
      const itemStyle: Partial<AnimationStyle> = {
        ...originPosition,
      };

      const { left, top, width, height } =
        dragContainer.current?.getBoundingClientRect();
      const offsetX =
        Math.min(Math.max(position.x, left), left + width) - originPosition.cX;
      const offsetY =
        Math.min(Math.max(position.y, top), top + height) - originPosition.cY;

      switch (handleType) {
        // 拖拽移动
        case 'move':
          // 元素当前位置 + 偏移量
          itemStyle.left = originPosition.left + offsetX;
          itemStyle.top = originPosition.top + offsetY;
          // 限制必须在这个范围内移动：画板的高度-元素的高度
          itemStyle.left = Math.max(
            0,
            Math.min(itemStyle.left, width - itemStyle.width)
          );
          itemStyle.top = Math.max(
            0,
            Math.min(itemStyle.top, height - itemStyle.height)
          );
          break;
        // 东
        case 'east':
          // 向右拖拽添加宽度
          itemStyle.width += offsetX;
          break;
        // 西
        case 'west':
          // 增加宽度、位置同步左移
          itemStyle.width -= offsetX;
          itemStyle.left += offsetX;
          break;
        // 南
        case 'south':
          itemStyle.height += offsetY;
          break;
        // 北
        case 'north':
          itemStyle.height -= offsetY;
          itemStyle.top += offsetY;
          break;
        // 东北
        case 'north-east':
          itemStyle.height -= offsetY;
          itemStyle.top += offsetY;
          itemStyle.width += offsetX;
          break;
        // 西北
        case 'north-west':
          itemStyle.height -= offsetY;
          itemStyle.top += offsetY;
          itemStyle.width -= offsetX;
          itemStyle.left += offsetX;
          break;
        // 东南
        case 'south-east':
          itemStyle.height += offsetY;
          itemStyle.width += offsetX;
          break;
        // 西南
        case 'south-west':
          itemStyle.height += offsetY;
          itemStyle.width -= offsetX;
          itemStyle.left += offsetX;
          break;
        // 拖拽移动
        case 'rotate':
          // 先计算下元素的中心点, x，y 作为坐标原点
          const x = left + itemStyle.width / 2 + itemStyle.left;
          const y = top + itemStyle.height / 2 + itemStyle.top;
          let angle = getTanDeg((position.y - y) / (position.x - x));

          // const deltaX = position.x - x;
          // const deltaY = position.y - y;
          // if (deltaX < 0 && deltaY < 0) {
          //   console.log(4)
          //   // 左上角，第4象限
          //   angle = -angle;
          // } else if (deltaX < 0 && deltaY > 0) {
          //   console.log(3)
          //   // 左下角，第3象限
          //   angle = -(180 - angle)
          // } else if (deltaX > 0 && deltaY < 0) {
          //   console.log(1)
          //   // 右上角，第1象限
          //   angle = angle;
          // } else if (deltaX > 0 && deltaY > 0) {
          //   console.log(2)
          //   // 右下角，第2象限
          //   angle = 180 - angle;
          // }

          // 运用高中的三角函数
          itemStyle.transform = `rotate(${angle}deg)`;
          break;
        default:
          break;
      }

      return itemStyle;
    },
    []
  );

  // 鼠标被按下
  const onMouseDown = useCallback(
    (dir: HandleType, e: React.MouseEvent<HTMLElement>) => {
      // 对于点击的不是鼠标左键的情况，不做处理
      if (e.button !== 0) return;

      // console.log('mousedown');

      // 阻止事件冒泡
      e.stopPropagation();

      // 保存操作类型
      handleType.current = dir;

      isMouseDown.current = true;

      // 鼠标坐标是
      const cX = e.clientX;
      const cY = e.clientY; // clientX 相对于可视化区域

      originPosition.current = {
        ...animationStyle,
        cX,
        cY,
      };

      onDragStart && onDragStart(originPosition.current);
    },
    [animationStyle, onDragStart]
  );

  // 鼠标移动
  const onMouseMove = useCallback(
    e => {
      // console.log('mousemove');

      // 判断鼠标是否按住
      if (!isMouseDown.current) return;

      const newStyle = getItemStyle(
        handleType.current,
        originPosition.current,
        { x: e.clientX, y: e.clientY }
      );
      setAnimationStyle(newStyle as any);
    },
    [getItemStyle, setAnimationStyle]
  );

  // 鼠标抬起
  const onMouseUp = useCallback(() => {
    // console.log('mouseup');

    isMouseDown.current = false;
    onDragStop && onDragStop(getItemStyle);
  }, [getItemStyle, onDragStop]);

  useEffect(() => {
    dragContainer.current = (
      typeof container === 'object'
        ? container
        : document.querySelector(container)
    ) as HTMLElement;
    // 容器没有定位的时候，添加定位
    if (
      ['relative', 'absolute', 'fixed'].indexOf(
        dragContainer.current.style.position
      ) < 0
    ) {
      dragContainer.current.style.position = 'relative';
    }
  }, [container, onMouseMove, onMouseUp]);

  // 解决拖拽后，鼠标不在.draggable元素面积范围的时候，拖拽标识还在的问题
  useEffect(() => {
    const handleMouseUp = e => {
      if (isMouseDown.current) {
        onMouseUp();
      }
    };
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [container, onMouseMove, onMouseUp]);

  // 解决拖拽时，鼠标不在.draggable元素面积范围的时候，拖不动的问题
  useEffect(() => {
    const handleMouseMove = e => {
      if (isMouseDown.current) {
        onMouseMove(e);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [container, onMouseMove, onMouseUp]);

  // 点击
  const [selected, setSelected] = useState<boolean>(false);
  const onClick = e => {
    e.stopPropagation();
    setSelected(true);
  };

  // keyup事件
  useEffect(() => {
    onKeyUp && window.addEventListener('keyup', onKeyUp);

    return () => {
      onKeyUp && window.removeEventListener('keyup', onKeyUp);
    };
  });

  // 点击其它位置取消选中
  useEffect(() => {
    const handleClick = e => {
      e.stopPropagation();

      setSelected(false);
    };
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, [container, onMouseMove, onMouseUp]);

  return (
    <div
      className={`draggable ${selected ? 'selected' : ''}`}
      style={style}
      onClick={onClick}
      onKeyUp={onKeyUp}
    >
      {canDrag ? (
        <div
          className="draggable-item"
          style={animationStyle}
          onMouseDown={e => onMouseDown('move', e)}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
        >
          <div className="draggable-item-child">{children}</div>
          {canDrag &&
            handles.map(item => (
              <div
                className={classnames('handle', `handle-${item}`)}
                onMouseDown={(e: React.MouseEvent<HTMLElement>) =>
                  onMouseDown(item as HandleType, e)
                }
                key={item}
              ></div>
            ))}
        </div>
      ) : (
        <div className="draggable-item" style={animationStyle}>
          {children}
        </div>
      )}
    </div>
  );
};

export default memo(Draggable);
