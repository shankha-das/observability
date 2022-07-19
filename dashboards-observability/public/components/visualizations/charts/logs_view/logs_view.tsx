/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */
import {
  EuiAccordion,
  EuiPanel,
  EuiSpacer,
  EuiTablePagination,
  htmlIdGenerator,
} from '@elastic/eui';
import React, { useContext, useEffect, useState } from 'react';
import { TabContext } from '../../../event_analytics/hooks';
import './logs_view.scss';

export const LogsView = ({ visualizations }: any) => {
  const { explorerData } = useContext<any>(TabContext);
  const { dataConfig = {} } = visualizations?.data?.userConfigs;
  const isTimeEnabled =
    dataConfig?.chartStyles?.time !== undefined ? dataConfig?.chartStyles?.time : true;
  const isWrapLinesEnabled =
    dataConfig?.chartStyles?.view !== undefined && dataConfig?.chartStyles?.view === 'wrapLines';
  const isPrettifyJSONEnabled =
    dataConfig?.chartStyles?.view !== undefined && dataConfig?.chartStyles?.view === 'prettifyJSON';
  const isLogDetailsEnabled =
    dataConfig?.chartStyles?.enableLogDetails !== undefined
      ? dataConfig?.chartStyles?.enableLogDetails
      : true;
  const labelSize =
    dataConfig?.chartStyles?.labelSize !== undefined
      ? dataConfig?.chartStyles?.labelSize + 'px'
      : '14px';
  const rawData = explorerData.jsonData;
  const {
    queriedFields = [],
    availableFields = [],
    selectedFields = [],
  } = visualizations?.data?.indexFields;

  const selectedFieldsNames = selectedFields.map((field: any) => field.name);

  const totalEntries = rawData.length;
  const [activePage, setActivePage] = useState(0);
  const [rowSize, setRowSize] = useState(20);
  const [pageCount, setPageCount] = useState(Math.ceil(totalEntries / rowSize));

  useEffect(() => {
    setPageCount(Math.ceil(totalEntries / rowSize));
  }, [totalEntries, rowSize]);

  const goToPage = (pageNumber: number) => setActivePage(pageNumber);
  const changeItemsPerPage = (pageSize: number) => {
    setPageCount(Math.ceil(totalEntries / pageSize));
    setRowSize(pageSize);
    setActivePage(0);
  };

  const isTimestamp = (key: any) => {
    if (queriedFields.length !== 0) {
      for (const { name, type } of queriedFields) {
        if (name === key && type === 'timestamp') return true;
      }
    } else if (selectedFields.length !== 0) {
      for (const { name, type } of selectedFields) {
        if (name === key && type === 'timestamp') return true;
      }
    } else {
      for (const { name, type } of availableFields) {
        if (name === key && type === 'timestamp') return true;
      }
    }
    return false;
  };

  const fetchTimestamp = (obj: any) => {
    for (const key of Object.keys(obj)) {
      if (queriedFields.length !== 0) {
        for (const { name, type } of queriedFields) {
          if (name === key && type === 'timestamp') return key;
        }
      }
    }
    return null;
  };

  const logs =
    rawData &&
    rawData.slice(activePage * rowSize, activePage * rowSize + rowSize).map((log, index) => {
      let btnContent: JSX.Element;
      let updatedLog: any = {};
      if (selectedFieldsNames.length > 0) {
        for (const [key, val] of Object.entries(log)) {
          if (selectedFieldsNames.includes(key)) {
            updatedLog[key] = val;
          }
        }
      } else {
        updatedLog = { ...log };
      }
      if (isWrapLinesEnabled) {
        const column1 = Object.keys(updatedLog).reduce((val, key) => {
          if (isTimestamp(key)) return `${updatedLog[key]}  `;
          return val;
        }, '');
        let column2 = '';
        for (const [key, val] of Object.entries(updatedLog)) {
          if (!isTimestamp(key)) column2 += `${key}="${val}"  `;
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
        let columnContent;
        let { timestamp } = updatedLog;
        if (timestamp === undefined) timestamp = fetchTimestamp(updatedLog);

        let newLog: any = {};
        for (const key of Object.keys(updatedLog)) {
          if (key !== timestamp) newLog[key] = updatedLog[key];
        }

        if (isTimeEnabled && timestamp !== null) {
          columnContent = JSON.stringify(
            { timestamp: updatedLog[timestamp], ...newLog },
            null,
            '\t'
          );
        } else {
          columnContent = JSON.stringify(newLog, null, '\t');
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
          stringContent += Object.keys(updatedLog).reduce((val, key) => {
            if (isTimestamp(key))
              return updatedLog[key].indexOf('.') !== -1
                ? updatedLog[key].substring(0, updatedLog[key].indexOf('.')) + '  '
                : updatedLog[key] + '  ';
            return val;
          }, '');
        }
        for (const [key, val] of Object.entries(updatedLog)) {
          if (isTimestamp(key)) continue;
          stringContent += `${key}="${val}"  `;
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

  return (
    <div style={{ fontSize: labelSize }}>
      {logs}
      <EuiTablePagination
        aria-label="Logs View Pagination"
        pageCount={pageCount}
        activePage={activePage}
        onChangePage={goToPage}
        itemsPerPage={rowSize}
        onChangeItemsPerPage={changeItemsPerPage}
        itemsPerPageOptions={[10, 20]}
      />
    </div>
  );
};
