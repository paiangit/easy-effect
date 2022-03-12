import React, { FC, useCallback, useMemo } from 'react';
import { Form, Input, Collapse, Upload, Button } from 'antd';
import { CaretRightOutlined, UploadOutlined } from '@ant-design/icons';
import { useAnimation } from '../../context/AnimationContext';
import SizeInput, { SizeValue } from './SizeInput';
import { playAnimation } from '../../utils/fetchAndPlayLottie';
import style from './AnimationSetting.module.less';

const { Panel } = Collapse;

const AnimationSetting: FC<{}> = () => {
  const { animation, setAnimation, animationStyle, setAnimationStyle, backgroundConfig, setBackgroundConfig } = useAnimation();
  const assets = animation?.animationData.assets.filter(item => item.p);

  // 因为直接修改数据是不会渲染到界面上的，所以需要先销毁旧的动画实例，再创建新的动画实例，以渲染更新后的数据到界面上
  const updateAnimation = useCallback(() => {
    const animationData = animation.animationData;
    const container = animation.wrapper;
    const isPaused = animation.isPaused;
    animation.destroy();
    const newAnimation = playAnimation({
      animationData,
      container,
      autoplay: isPaused === true || isPaused === undefined ? false : true,
    });
    setAnimation(newAnimation);
  }, [animation, setAnimation]);

  const onTextChange = useCallback((e, layerIndex) => {
    animation.animationData.layers[layerIndex].t.d.k[0].s.t = e.target.value;
    updateAnimation();
  }, [animation, updateAnimation]);

  const beforeUpdate = useCallback(async (file, assetIndex) => {
    function getBase64(file) {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    }

    const base64Url = await getBase64(file);
    animation.animationData.assets[assetIndex].p = base64Url;
    updateAnimation();
    return false;
  }, [animation, updateAnimation]);

  const onBackgroundColorChange = useCallback((e) => {
    setBackgroundConfig({
      ...backgroundConfig,
      backgroundColor: e.target.value,
    });
  }, [backgroundConfig, setBackgroundConfig]);

  const BackgroundConfigPanel = useMemo(() => (
    <Panel header="背景设置" key="1" className="site-collapse-custom-panel">
      <Form.Item label="尺寸">
        <SizeInput value={backgroundConfig} onChange={setBackgroundConfig as (value: SizeValue) => void}></SizeInput>
      </Form.Item>
      <Form.Item label="背景">
        <Input
          onChange={onBackgroundColorChange}
          type="text"
          value={backgroundConfig.backgroundColor}
          style={{ width: 220 }}
        />
      </Form.Item>
    </Panel>
  ), [backgroundConfig, onBackgroundColorChange, setBackgroundConfig]);

  const AnimationEditPanel = useMemo(() => {
    const texts = [];

    animation?.animationData.layers.forEach((item, index) => {
      const text = item.t?.d?.k[0]?.s?.t;
      // 这里当为空字符串的时候也仍然要展示，否则会导致一个文字层被清空的时候，在配置列表中再也找不到该配置项，从而导致再也没法改回来了，所以用!=null判断
      text != null && texts.push({
        text,
        index,
      });
    });
    return (
      <Panel header="Lottie动画编辑" key="2" className="site-collapse-custom-panel">
        <Form.Item label="尺寸">
          <SizeInput value={animationStyle} onChange={setAnimationStyle as (value: SizeValue) => void}></SizeInput>
        </Form.Item>
        {
          texts && texts.map((text) => {
            return (
              <Form.Item label="文字" key={text.index}>
                <Input
                  onChange={(e) => onTextChange(e, text.index)}
                  type="text"
                  value={text.text}
                  style={{ width: 220 }}
                />
              </Form.Item>
            )
          })
        }
        {
          assets && assets.map((asset, index) => {
            return (
              <Form.Item
                label="图片"
                valuePropName="fileList"
                key={asset.id}
              >
                <div
                  className={style.thumnail}
                  style={{ backgroundImage: `url(${asset.p})` }}
                />
                <Upload name="logo" beforeUpload={(e) => beforeUpdate(e, index)} listType="picture" showUploadList={false}>
                  <Button icon={<UploadOutlined />}>替换图片</Button>
                </Upload>
              </Form.Item>
            );
          })
        }
      </Panel>
    )
  }, [animation, animationStyle, assets, beforeUpdate, onTextChange, setAnimationStyle]);

  return (
    <div className={style['animation-setting']}>
      <Form colon={false}>
        <Collapse
          bordered={false}
          defaultActiveKey={['1', '2']}
          expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
          className="site-collapse-custom-collapse"
        >
          {BackgroundConfigPanel}
          {AnimationEditPanel}
        </Collapse>
      </Form>
    </div>
  );
};

export default AnimationSetting;
