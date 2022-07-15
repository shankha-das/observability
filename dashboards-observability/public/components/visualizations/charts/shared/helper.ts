/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { ConfigTooltip } from '../../../event_analytics/explorer/visualizations/config_panel/config_panes/config_controls';

export const fetchConfigObject = (editor: string, propsOptions: any) => {
  switch (editor) {
    case 'Tooltip':
      return {
        id: 'tooltip_options',
        name: 'Tooltip options',
        editor: ConfigTooltip,
        mapTo: 'tooltipOptions',
        schemas: [
          {
            name: 'Tooltip mode',
            component: null,
            mapTo: 'tooltipMode',
            props: {
              options: [
                { name: 'Show', id: 'show' },
                { name: 'Hidden', id: 'hidden' },
              ],
              defaultSelections: [{ name: 'Show', id: 'show' }],
            },
          },
          {
            name: 'Tooltip text',
            component: null,
            mapTo: 'tooltipText',
            props: propsOptions,
          },
        ],
      };
    default:
      return null;
  }
};
