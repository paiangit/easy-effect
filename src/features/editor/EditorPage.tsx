import { useParams, useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import LeftArea from './LeftArea';
import CenterArea from './CenterArea';
import RightArea from './RightArea';
import { ThunderboltFilled } from '@ant-design/icons';
import useDocumentTitle from '~hooks/useDocumentTitle';
import { AnimationProvider } from '../../context/AnimationContext';
import style from './EditorPage.module.less';

export default function EditorPage() {
  useDocumentTitle('编辑动画');

  // 下面两个hook分别将Url中的appId和pageId转成number类型
  // url的格式为：http://localhost/app/editor/${appId}/
  const useEditorParams = () => {
    const params = useParams();
    return {
      ...params,
      appId: Number(params.appId) || undefined,
    };
  };

  const params = useEditorParams();
  const navigate = useNavigate();

  const handlePreview = () => {
    navigate(`/app/preview/${params.appId}`);
  };

  const handleSave = () => {

  };

  return (
    <AnimationProvider>
      <div className={style['editor-page']}>
        <div className={style.header}>
          <div className={style.logo}><ThunderboltFilled /><span className={style.text}>动画编辑</span></div>
          <Button onClick={handlePreview}>预览</Button>
          <Button onClick={handleSave} type="primary">保存</Button>
        </div>
        <div className={style.body}>
          <LeftArea></LeftArea>
          <CenterArea></CenterArea>
          <RightArea></RightArea>
        </div>
      </div>
    </AnimationProvider>
  );
}
