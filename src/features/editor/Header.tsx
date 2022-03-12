import { Button } from 'antd';
// import { useNavigate, useParams } from 'react-router-dom';
import { ThunderboltFilled } from '@ant-design/icons';
import { useAnimation } from '~context/AnimationContext';
import zip, { File } from '~utils/zip';
import generateDemoPage from '~utils/generateDemoPage';
import style from './Header.module.less';

const Header = () => {
  const { animation, animationStyle, backgroundConfig } = useAnimation();

  // 下面两个hook分别将Url中的appId和pageId转成number类型
  // url的格式为：http://localhost/app/editor/${appId}/
  // const useEditorParams = () => {
  //   const params = useParams();
  //   return {
  //     ...params,
  //     appId: Number(params.appId) || undefined,
  //   };
  // };
  // const params = useEditorParams();
  // const navigate = useNavigate();
  // const handlePreview = () => {
  //   navigate(`/app/preview/${params.appId}`);
  // };

  const handleDownload = () => {
    const files = [];
    const data = animation.animationData;
    const blob = new Blob([JSON.stringify(data)]);
    const animationFile: File = {
      path: '',
      filedata: '',
    };
    animationFile.path = 'animation.json';
    animationFile.filedata = blob;
    const demoData = generateDemoPage(
      JSON.stringify(animation.animationData),
      animationStyle,
      backgroundConfig,
    );
    files.push(animationFile);
    files.push({
      path: 'demo.html',
      filedata: demoData,
    })
    zip(files, animation.animationData?.nm || 'animation-demo');
  };
  return (
    <div className={style.header}>
      <div className={style.logo}><a href="/"><ThunderboltFilled /></a><span className={style.text}>Lottie动画编辑</span></div>
      {/* <Button onClick={handlePreview}>预览</Button> */}
      <Button disabled={!animation} className={style.download} onClick={handleDownload} type="primary">下载到本地</Button>
    </div>
  );
};

export default Header;
