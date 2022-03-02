import { useRef, useState } from 'react';
import { FixedSizeGrid as Grid } from 'react-window';
import { debounce } from 'lodash';
import useWrapperSize from '~hooks/useWrapperSize';
import lottiePlayer from '~utils/lottiePlayer';
import fetchAndPlayLottie from '~utils/fetchAndPlayLottie';
import style from './LeftPanel.module.less';

export default function LeftPanel(props) {
  const [ previewVisible, setPreviewVisible ] = useState(false);
  const { height, wrapperRef } = useWrapperSize();
  const previewRef = useRef();
  const rowCount = Math.ceil(props.data.length / 2);
  const lottieName = 'preview-template';

  const destroyLottie = () => lottiePlayer.destroy(lottieName);

  const onMouseEnter = (lottieUrl) => {
    return debounce(async () => {
      destroyLottie();
      await fetchAndPlayLottie(lottieUrl, { container: previewRef.current, name: lottieName });
      setPreviewVisible(true);
    }, 20);
  };

  const removePreview = debounce(() => {
    destroyLottie();
    setPreviewVisible(false);
  }, 20);

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
        onMouseEnter={onMouseEnter(props.data[index].lottieUrl)}
        onMouseLeave={removePreview}
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
      <div className={style.preview} ref={previewRef} style={{display: `${previewVisible ? 'block': 'none'}`}}></div>
    </div>
  );
}
