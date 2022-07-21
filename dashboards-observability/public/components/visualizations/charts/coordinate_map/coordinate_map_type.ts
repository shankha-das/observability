/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { CoordinateMap } from './coordinate_map';
import { getPlotlySharedConfigs, getPlotlyCategory } from '../shared/shared_configs';
import { LensIconChartBar } from '../../assets/chart_bar';
import { VizDataPanel } from '../../../event_analytics/explorer/visualizations/config_panel/config_panes/default_vis_editor';
import { ConfigEditor } from '../../../event_analytics/explorer/visualizations/config_panel/config_panes/json_editor';
import {
  ConfigLegend,
  DualRangeSlider,
  InputFieldItem,
} from '../../../event_analytics/explorer/visualizations/config_panel/config_panes/config_controls';
import { ConfigBarChartStyles } from '../../../event_analytics/explorer/visualizations/config_panel/config_panes/config_controls/config_bar_chart_styles';

const sharedConfigs = getPlotlySharedConfigs();
const VIS_CATEGORY = getPlotlyCategory();

export const createCoordinatedMapTypeDefinition = (params: any) => ({
  name: 'coordinate_map',
  type: 'coordinate_map',
  id: 'coordinate_map',
  label: 'Coordinate Map',
  fullLabel: 'Coordinate Map',
  iconType: 'visMapCoordinate',
  selection: {
    dataLoss: 'nothing',
  },
  category: VIS_CATEGORY.BASICS,
  icon: LensIconChartBar,
  categoryAxis: 'xaxis',
  seriesAxis: 'yaxis',
  orientation: 'v',
  mode: 'group',
  labelAngle: 0,
  lineWidth: 1,
  fillOpacity: 80,
  groupWidth: 0.7,
  barWidth: 0.97,
  component: CoordinateMap,
  editorConfig: {
    panelTabs: [
      {
        id: 'data-panel',
        name: 'Data',
        mapTo: 'dataConfig',
        editor: VizDataPanel,
        sections: [
          {
            id: 'text',
            name: 'Text',
            editor: ConfigLegend,
            mapTo: 'text',
            schemas: [
              {
                name: 'Show Text',
                mapTo: 'showText',
                component: null,
                props: {
                  options: [
                    { name: 'Show', id: 'show' },
                    { name: 'Hidden', id: 'hidden' },
                  ],
                  defaultSelections: [{ name: 'Show', id: 'show' }],
                },
              },
              {
                name: 'Position',
                mapTo: 'position',
                component: null,
                props: {
                  options: [
                    { name: 'Top', id: 'top center' },
                    { name: 'Right', id: 'middle right' },
                    { name: 'Bottom', id: 'bottom center' },
                    { name: 'Left', id: 'middle left' },
                  ],
                  defaultSelections: [{ name: 'Top', id: 'top center' }],
                },
              },
            ],
          },
          {
            id: 'chart_styles',
            name: 'Chart styles',
            editor: ConfigBarChartStyles,
            mapTo: 'chartStyles',
            schemas: [
              {
                name: 'Label Size',
                component: InputFieldItem,
                mapTo: 'labelSize',
                eleType: 'input',
              },
              {
                name: 'Latitude Range',
                component: DualRangeSlider,
                mapTo: 'latitudeRange',
                eleType: 'dual_slider',
                defaultState: [40, 70],
                props: {
                  min: -90,
                  max: 90,
                  step: 1,
                },
              },
              {
                name: 'Longitude Range',
                component: DualRangeSlider,
                mapTo: 'longitudeRange',
                eleType: 'dual_slider',
                defaultState: [-130, -55],
                props: {
                  min: -180,
                  max: 180,
                  step: 1,
                },
              },
            ],
          },
        ],
      },
      {
        id: 'style-panel',
        name: 'Layout',
        mapTo: 'layoutConfig',
        editor: ConfigEditor,
        content: [],
      },
    ],
  },
  visConfig: {
    layout: {
      ...sharedConfigs.layout,
    },
    config: {
      ...sharedConfigs.config,
    },
    isUniColor: false,
  },
});
