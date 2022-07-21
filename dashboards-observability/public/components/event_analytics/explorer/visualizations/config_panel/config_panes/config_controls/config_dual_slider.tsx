import React from 'react';
import { EuiDualRange, EuiSpacer, EuiTitle, htmlIdGenerator } from '@elastic/eui';

export const DualRangeSlider = ({
  title,
  currentRange,
  handleSliderChange,
  minRange,
  maxRange,
  step,
}: any) => {
  return (
    <>
      <EuiTitle size="xxs">
        <h3>{title}</h3>
      </EuiTitle>
      <EuiSpacer size="s" />
      <EuiDualRange
        id={htmlIdGenerator('dualInputRangeSlider')()}
        value={currentRange}
        onChange={(val) => handleSliderChange(val)}
        min={minRange}
        max={maxRange}
        step={step}
        showInput
        minInputProps={{ 'aria-label': 'Min value' }}
        maxInputProps={{ 'aria-label': 'Max value' }}
        aria-label="Dual Range Slider"
      />
    </>
  );
};
