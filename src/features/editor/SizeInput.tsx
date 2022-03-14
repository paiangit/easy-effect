import React, { FC, useCallback, useState } from 'react';
import { Input } from 'antd';

export interface SizeValue {
  width?: number;
  height?: number;
}

export interface SizeInputProps {
  value?: SizeValue;
  onChange?: (value: SizeValue) => void;
}

const SizeInput: FC<SizeInputProps> = ({ value = {}, onChange }) => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const triggerChange = useCallback(
    (changeValue: { width?: number; height?: number }) => {
      onChange?.({ width, height, ...value, ...changeValue });
    },
    [height, onChange, value, width]
  );

  const onWidthChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newWidth = parseInt(e.target.value || '0', 10);
      if (Number.isNaN(width)) return;

      if (!('width' in value)) {
        setWidth(newWidth);
      }

      triggerChange({ width: newWidth });
    },
    [triggerChange, value, width]
  );

  const onHeightChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newHeight = parseInt(e.target.value || '0', 10);
      if (Number.isNaN(width)) return;

      if (!('height' in value)) {
        setHeight(newHeight);
      }
      triggerChange({ height: newHeight });
    },
    [triggerChange, value, width]
  );

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
