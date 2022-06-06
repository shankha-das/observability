/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { uniqueId } from 'lodash';
import { EuiSpacer, EuiFormRow, EuiSwitch, EuiSwitchEvent } from '@elastic/eui';

interface EUISwitch {
    label: string;
    checked: boolean;
    handleChange: (event: EuiSwitchEvent) => void;
}
export const ConfigSwitch: React.FC<EUISwitch> = ({
    label, checked, handleChange
}) => (
    <>
        <EuiFormRow label={label}>
            <EuiSwitch
                id={uniqueId('switch-button')}
                showLabel={false}
                label={label}
                checked={checked}
                onChange={(e) => handleChange(e.target.checked)}
                compressed
            />
        </EuiFormRow>
        <EuiSpacer size="s" />
    </>
);