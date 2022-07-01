/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useCallback, useContext } from 'react';
import {
  EuiInMemoryTable,
  EuiDataGrid,
  EuiAccordion,
  EuiText,
  EuiPanel,
  EuiSpacer,
} from '@elastic/eui';
import { TabContext } from '../../../event_analytics/hooks';

export const LogsView = ({ visualizations }: any) => {
 
  const { explorerData } = useContext<any>(TabContext);
  const rawData = explorerData.jsonData;
  const logs =
    rawData &&
    rawData.map((log, index) => (
      <>
        <EuiAccordion
          key={index}
          id={'multipleAccordionsId__1'}
          buttonContent="An accordion with padding applied through props"
          paddingSize="l"
        >
          <EuiPanel color="subdued">
            {Object.entries(log).map((logObj: any) => (
              <>
                <EuiText size="s">
                  <p>{logObj[0]}</p>
                </EuiText>
                <EuiText size="s">
                  <p>{logObj[1]}</p>
                </EuiText>
              </>
            ))}
          </EuiPanel>
        </EuiAccordion>
        <EuiSpacer />
      </>
    ));

  return <div>{logs}</div>;
};
