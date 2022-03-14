import { FC } from 'react';
import { Button } from 'antd';
// import { useNavigate, useParams } from 'react-router-dom';
import { ThunderboltFilled } from '@ant-design/icons';
import { useAnimation } from '~context/AnimationContext';
import zip, { File } from '~utils/zip';
import generateDemoPage from '~utils/generateDemoPage';
import style from './Header.module.less';

const Header: FC<{}> = () => {
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
      backgroundConfig
    );
    files.push(animationFile);
    files.push({
      path: 'demo.html',
      filedata: demoData,
    });
    zip(files, animation.animationData?.nm || 'animation-demo');
  };

  return (
    <div className={style.header}>
      <div className={style.logo}>
        <a href="/">
          <ThunderboltFilled />
        </a>
        <span className={style.text}>Lottie动效编辑</span>
      </div>
      {/* <Button onClick={handlePreview}>预览</Button> */}
      <Button
        disabled={!animation}
        className={style.download}
        onClick={handleDownload}
        type="primary"
      >
        导出
      </Button>
      <Button
        className={style.github}
        href="https://github.com/paiangit/easy-effect"
        target="_blank"
      >
        <svg
          height="32"
          aria-hidden="true"
          viewBox="0 0 16 16"
          version="1.1"
          width="32"
          data-view-component="true"
        >
          <path
            fillRule="evenodd"
            d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
          ></path>
        </svg>
      </Button>
    </div>
  );
};

export default Header;
