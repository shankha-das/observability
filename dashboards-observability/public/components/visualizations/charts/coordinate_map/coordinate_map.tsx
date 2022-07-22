/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useContext, useMemo } from 'react';

import { Plt } from '../../plotly/plot';
import { TabContext } from '../../../event_analytics/hooks';
import { EmptyPlaceholder } from '../../../event_analytics/explorer/visualizations/shared_components/empty_placeholder';

export const CoordinateMap = ({ visualizations, layout, config }: any) => {
  const { explorerData } = useContext<any>(TabContext);
  const { dataConfig = {}, layoutConfig = {} } = visualizations?.data?.userConfigs;
  const dataConfiguration = visualizations?.data?.rawVizData?.coordinate_map?.dataConfig;
  const rawData = explorerData.jsonData;

  if (dataConfiguration === undefined || rawData.length === 0) {
    return <EmptyPlaceholder icon={visualizations?.vis?.iconType} />;
  }
  const plotNames = rawData.map((data: any) => data?.[dataConfiguration?.metrics[0]?.plotName]);
  const locationLats = rawData.map(
    (data: any) => JSON.parse(data?.[dataConfiguration?.dimensions[0]?.name])?.lat
  );
  const locationLons = rawData.map(
    (data: any) => JSON.parse(data?.[dataConfiguration?.dimensions[0]?.name])?.lon
  );
  const colorDetectorField = rawData.map(
    (data: any) => data?.[dataConfiguration?.metrics[0]?.name]
  );

  const showText =
    dataConfig?.text?.showText !== undefined ? dataConfig?.text?.showText === 'show' : true;
  const textPosition =
    dataConfig?.text?.position !== undefined ? dataConfig?.text?.position : 'top center';
  const fontSize =
    dataConfig?.chartStyles?.labelSize !== undefined ? dataConfig?.chartStyles?.labelSize : 14;
  const latitudeRange =
    dataConfig?.chartStyles?.latitudeRange !== undefined
      ? dataConfig?.chartStyles?.latitudeRange
      : [40, 70];
  const longitudeRange =
    dataConfig?.chartStyles?.longitudeRange !== undefined
      ? dataConfig?.chartStyles?.longitudeRange
      : [-130, -55];
  const scl = useMemo(
    () => [
      [0, 'rgb(5, 10, 172)'],
      [0.35, 'rgb(40, 60, 190)'],
      [0.5, 'rgb(70, 100, 245)'],
      [0.6, 'rgb(90, 120, 245)'],
      [0.7, 'rgb(106, 137, 247)'],
      [1, 'rgb(220, 220, 220)'],
    ],
    []
  );

  const data = useMemo(
    () => [
      {
        type: 'scattergeo',
        mode: `markers${showText ? '+text' : ''}`,
        text: plotNames,
        lon: locationLons,
        lat: locationLats,
        marker: {
          size: 10,
          line: { width: 1 },
          reversescale: true,
          autocolorscale: false,
          colorscale: scl,
          cmin: 0,
          color: colorDetectorField,
          colorbar: {
            title: 'Range',
          },
        },
        name: 'Coordinate Map',
        textposition: textPosition,
      },
    ],
    [plotNames, locationLons, locationLats, colorDetectorField, scl, showText, textPosition]
  );

  const layoutMap = {
    height: 600,
    font: {
      family: 'Droid Serif, serif',
      size: fontSize,
    },
    geo: {
      scope: 'world',
      resolution: '50',
      lonaxis: { range: longitudeRange },
      lataxis: { range: latitudeRange },
      showrivers: true,
      rivercolor: '#fff',
      showlakes: true,
      lakecolor: '#fff',
      showland: true,
      landcolor: '#EAEAAE',
      countrycolor: '#d3d3d3',
      countrywidth: 1.5,
      subunitcolor: '#d3d3d3',
    },
  };
  return <Plt data={data} layout={layoutMap} />;
};
