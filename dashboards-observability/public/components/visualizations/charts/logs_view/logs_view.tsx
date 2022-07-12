/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */
import { EuiAccordion, EuiPanel, EuiSpacer, htmlIdGenerator } from '@elastic/eui';
import React, { useContext } from 'react';
import { TabContext } from '../../../event_analytics/hooks';
import './logs_view.scss';

export const LogsView = ({ visualizations }: any) => {
  const { explorerData } = useContext<any>(TabContext);
  const { dataConfig = {} } = visualizations?.data?.userConfigs;
  const isTimeEnabled =
    dataConfig?.chartStyles?.time !== undefined ? dataConfig?.chartStyles?.time : true;
  const isWrapLinesEnabled =
    dataConfig?.chartStyles?.view !== undefined && dataConfig?.chartStyles?.view === 'wrapLines'
      ? true
      : false;
  const isPrettifyJSONEnabled =
    dataConfig?.chartStyles?.view !== undefined && dataConfig?.chartStyles?.view === 'prettifyJSON'
      ? true
      : false;
  const isLogDetailsEnabled =
    dataConfig?.chartStyles?.enableLogDetails !== undefined
      ? dataConfig?.chartStyles?.enableLogDetails
      : true;
  const isOldestFirst = dataConfig?.chartStyles?.order === 'oldestFirst';
  const labelSize =
    dataConfig?.chartStyles?.labelSize !== undefined
      ? dataConfig?.chartStyles?.labelSize + 'px'
      : '14px';
  const rawData = explorerData.jsonData;
  const sortedRawData = [...rawData];
  sortedRawData.sort(function (firstData: any, secondData: any) {
    if (firstData.timestamp === undefined || secondData.timestamp === undefined) return 1;
    const firstTime = new Date(firstData.timestamp);
    const secondTime = new Date(secondData.timestamp);
    return isOldestFirst ? firstTime - secondTime : secondTime - firstTime;
  });
  const logs =
    sortedRawData &&
    sortedRawData.map((log, index) => {
      let btnContent: JSX.Element;
      if (isWrapLinesEnabled) {
        const column1 = Object.keys(log).reduce((val, key) => {
          if (key === 'timestamp') return log[key] + '  ';
          return val;
        }, '');
        let column2 = '';
        for (const [key, val] of Object.entries(log)) {
          if (key !== 'timestamp') column2 += key + '="' + val + '"  ';
        }
        const jsxContent = column2
          .split('  ')
          .map((ele) => <span className="columnData">{ele}</span>);
        btnContent = (
          <table className="tableContainer">
            <tr>
              {isTimeEnabled && column1 !== '' && (
                <td className="timeColumn">
                  {column1.indexOf('.') !== -1
                    ? column1.substring(0, column1.indexOf('.'))
                    : column1}
                </td>
              )}
              <td className="wrapContent">{jsxContent}</td>
            </tr>
          </table>
        );
      } else if (isPrettifyJSONEnabled) {
        const { timestamp, ...others } = log;
        let columnContent;
        if (isTimeEnabled && timestamp !== undefined) {
          columnContent = JSON.stringify({ timestamp, ...others }, null, '\t');
        } else {
          columnContent = JSON.stringify(others, null, '\t');
        }
        btnContent = (
          <table className="tableContainer">
            <tr>
              <td>
                <pre>{columnContent}</pre>
              </td>
            </tr>
          </table>
        );
      } else {
        let stringContent = '';
        if (isTimeEnabled) {
          stringContent += Object.keys(log).reduce((val, key) => {
            if (key === 'timestamp')
              return log[key].indexOf('.') !== -1
                ? log[key].substring(0, log[key].indexOf('.')) + '  '
                : log[key] + '  ';
            return val;
          });
        }
        for (const [key, val] of Object.entries(log)) {
          if (key === 'timestamp') continue;
          stringContent += key + '="' + val + '"  ';
        }
        const jsxContent = stringContent
          .split('  ')
          .map((ele) => <span className="columnData">{ele}</span>);
        btnContent = (
          <table>
            <tr>
              <td className="noWrapContent">{jsxContent}</td>
            </tr>
          </table>
        );
      }
      if (isLogDetailsEnabled) {
        return (
          <>
            <EuiAccordion
              key={index}
              id={htmlIdGenerator('multipleAccordionsId__1')()}
              buttonContent={btnContent}
              paddingSize="l"
            >
              <EuiPanel color="subdued" className="lvEuiAccordian_Panel">
                <table>
                  <tr>
                    <th>Detected fields</th>
                  </tr>
                  {Object.entries(log).map(([key, value], index) => (
                    <tr key={index}>
                      <td>
                        <p>{key}</p>
                      </td>
                      <td>
                        <p>{value}</p>
                      </td>
                    </tr>
                  ))}
                </table>
              </EuiPanel>
            </EuiAccordion>
            <EuiSpacer />
          </>
        );
      } else {
        return <div className="rawlogData">{btnContent}</div>;
      }
    });

  return <div style={{ fontSize: labelSize }}>{logs}</div>;
};
