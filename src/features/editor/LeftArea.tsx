import { useCallback, useEffect, useState } from 'react';
import LeftAreaNav from './LeftAreaNav';
import style from './LeftArea.module.less';
import LeftPanel from './LeftPanel';
import mockData from './LeftArea.mock';

export default function LeftArea() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [templates, setTemplates] = useState([]);
  const data = mockData.results[0].categoryList;

  useEffect(() => {
    setTemplates(data[0].children[0].children);
  }, [data]);

  const handleActiveIndexChange = useCallback(
    index => {
      setActiveIndex(index);
      setTemplates(data[index].children[0].children);
    },
    [data]
  );

  return (
    <div className={style['left-area']}>
      <LeftAreaNav
        data={data}
        activeIndex={activeIndex}
        onActiveIndexChange={handleActiveIndexChange}
      ></LeftAreaNav>
      <LeftPanel
        className={style.panel}
        data={templates}
        activeIndex={activeIndex}
      ></LeftPanel>
    </div>
  );
}
