/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useCallback } from 'react';
import { EuiInMemoryTable, EuiDataGrid, EuiAccordion, EuiText, EuiPanel, EuiSpacer } from '@elastic/eui';

export const LogsView = ({ visualizations }: any) => {
  const {
    data: vizData,
    jsonData,
    metadata: { fields = [] },
  } = visualizations.data.rawVizData;

  const raw_data = [...jsonData];

  console.log("raw_data:: ", raw_data);
  const logs = raw_data && raw_data.map((log, index) => (
    <>
      <EuiAccordion
        key={index}
        id={'multipleAccordionsId__1'}
        buttonContent="An accordion with padding applied through props"
        paddingSize="l"
      >
        <EuiPanel color="subdued">
          <EuiText size="s">
            <p>{JSON.stringify(log)}</p>
          </EuiText>
        </EuiPanel>
      </EuiAccordion>
      <EuiSpacer />
    </>
  ));

  return (
    <div>
      {logs}
    </div>
  );
};
