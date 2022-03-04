import React, { FC, useState } from 'react';
import { Input } from 'antd';

interface SizeValue {
  width?: number,
  height?: number,
}

interface SizeInputProps {
  value?: SizeValue,
  onChange?: (value: SizeValue) => void;
}

const SizeInput: FC<SizeInputProps> = ({ value = {}, onChange }) => {
  const [width, setWidth] = useState(375);
  const [height, setHeight] = useState(375);

  const triggerChange = (changeValue: { width?: number; height?: number }) => {
    onChange?.({ width, height, ...value, ...changeValue });
  };

  const onWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = parseInt(e.target.value || '375', 10);
    if (Number.isNaN(width)) return;

    if (!('width' in value)) {
      setWidth(newWidth);
    }

    triggerChange({ width: newWidth });
  };

  const onHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = parseInt(e.target.value || '375', 10);
    if (Number.isNaN(width)) return;

    if (!('height' in value)) {
      setHeight(newHeight);
    }
    triggerChange({ height: newHeight });
  };

  return (
    <span>
      <Input
        prefix="宽："
        type="text"
        value={value.width || width}
        onChange={onWidthChange}
        style={{ width: 105 }}
      />
      <Input
        prefix="高："
        type="text"
        value={value.height || height}
        onChange={onHeightChange}
        style={{ width: 105 }}
      />
    </span>
  );
};

export default SizeInput;
