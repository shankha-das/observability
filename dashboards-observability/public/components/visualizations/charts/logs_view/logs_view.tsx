/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */
import './logs_view.scss'
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
  console.log("explorerData:: ", explorerData)
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
          <EuiPanel color="subdued" className='lvEuiAccordian_Panel'>
            <table>
              <tr>
                <th>Detected fields</th>
              </tr>
              {Object.entries(log).map(([key, value], index) => (
                <tr key={index}>
                  <td>
                    <EuiText size="s">
                      <p>{key}</p>
                    </EuiText>
                  </td>
                  <td>
                    <EuiText size="s">
                      <p>{value}</p>
                    </EuiText>
                  </td>
                </tr>
              ))}
            </table>
          </EuiPanel>
        </EuiAccordion>
        <EuiSpacer />
      </>
    ));

  return <div>{logs}</div>;
};
