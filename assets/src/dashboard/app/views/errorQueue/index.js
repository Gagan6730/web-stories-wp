/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * External dependencies
 */
import { useContext, useEffect } from 'react';

/**
 * Internal dependencies
 */
import { ApiContext } from '../../api/apiProvider';
import { Alert } from '../../../components/alert';
import { ALERT_SEVERITY } from '../../../constants';

function ErrorQueue() {
  const {
    state: {
      stories: { error },
    },
  } = useContext(ApiContext);

  const {
    actions: { removeAlert, addAlert },
    state: { activeAlerts },
  } = Alert.useAlertContext();

  useEffect(() => {
    if (error?.message) {
      addAlert({
        message: error.message,
        severity: ALERT_SEVERITY.ERROR,
        errorId: error.errorId,
      });
    }
  }, [error, addAlert]);

  return (
    <Alert.Wrapper>
      {activeAlerts.map((activeAlert, index) => (
        <Alert.Container
          key={`alert_${index}`}
          message={activeAlert.message}
          severity={activeAlert.severity}
          handleDismissClick={() => removeAlert(index)}
        />
      ))}
    </Alert.Wrapper>
  );
}

export default ErrorQueue;
