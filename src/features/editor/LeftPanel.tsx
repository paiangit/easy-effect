import { FixedSizeGrid as Grid } from 'react-window';
import useWrapperHeight from '../../hooks/useWrapperHeight';
import style from './LeftPanel.module.less';

export default function LeftPanel(props) {
  const rowCount = Math.ceil(props.data.length / 2);
  const { height, wrapperRef } = useWrapperHeight();

  function handleDragStart(id: number) {
    return (e, id) => {
      console.log(e, id);
    }
  }

  function handleDragEnd(id: number) {
    return (e, id) => {
      console.log(e, id);
    }
  }

  const Cell = (cellProps) => {
    const { rowIndex, columnIndex } = cellProps;
    const cellStyle = cellProps.style;
    const index = Math.min(rowIndex * 2 + columnIndex, props.data.length - 1);

    return (
      <div
        className={style['left-panel-item']}
        style={cellStyle}
        draggable={true}
      >
        <div
          className={style.thumbnail}
          style={{ backgroundImage: `url(${props.data[index].thumbnail})` }}
        >
        </div>
      </div>
    );
  };

  return (
    <div className={ `${style['left-panel']} ${props.className}` } ref={wrapperRef}>
      <Grid
        width={184}
        height={height}
        columnCount={2}
        columnWidth={86}
        rowCount={rowCount}
        rowHeight={90}
      >
        {Cell}
      </Grid>
    </div>
  );
}
