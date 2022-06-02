/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useMemo } from 'react';
import { EuiAccordion, EuiSpacer } from '@elastic/eui';
import { IConfigPanelOptionSection } from '../../../../../../../../common/types/explorer';
import { ButtonGroupItem } from './config_button_group';

export const ConfigLogsView = ({ visualizations, schemas, vizState, handleConfigChange, sectionName, sectionId = 'chartStyles' }) => {
  const handleConfigurationChange = useCallback(
    (stateFiledName) => {
      return (changes) => {
        handleConfigChange({
          ...vizState,
          [stateFiledName]: changes,
        });
      };
    },
    [handleConfigChange, vizState]
  );


  const dimensions = useMemo(() =>
    schemas.map((schema: IConfigPanelOptionSection, index: string) => {
      let params;
      const DimensionComponent = schema.component || ButtonGroupItem;
      if (schema.eleType === 'buttons') {
        params = {
          title: schema.name,
          legend: schema.name,
          groupOptions: schema?.props?.options.map((btn: { name: string }) => ({ ...btn, label: btn.name })),
          idSelected: vizState[schema.mapTo] || schema?.props?.defaultSelections[0]?.id,
          handleButtonChange: handleConfigurationChange(schema.mapTo),
          vizState,
          ...schema.props,
        };
      } else if (schema.eleType === 'switch') {
        params = {
          label: schema.name,
          checked: vizState[schema.mapTo] || schema?.defaultState,
          onChange: handleConfigurationChange(schema.mapTo),
          vizState,
          ...schema.props,
        };
      }
      return (
        <>
          <DimensionComponent key={`viz-series-${index}`} {...params} />
          <EuiSpacer size="s" />
        </>
      )
    })
    , [schemas, vizState, handleConfigurationChange]);

  return (
    <EuiAccordion initialIsOpen id={`configPanel__${sectionId}`} buttonContent={sectionName} paddingSize="s">
      {dimensions}
    </EuiAccordion>
  );
};
