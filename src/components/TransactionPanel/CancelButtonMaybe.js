import React from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import { SecondaryButton } from '../../components';

import css from './TransactionPanel.module.css';

const CancelButtonMaybe = props => {
  const { className, rootClassName, showButton, cancelInProgress, cancelError, onCancel } = props;

  const classes = classNames(rootClassName || css.actionButtons, className);

  const cancelErrorMessage = cancelError ? (
    <p className={css.actionError}>
      <FormattedMessage id="TransactionPanel.cancelFailed" />
    </p>
  ) : null;
  return showButton ? (
    <div className={classes}>
      <div className={css.actionErrors}>
        {cancelErrorMessage}
      </div>
      <div className={css.actionButtonWrapper}>
        <SecondaryButton
          inProgress={cancelInProgress}
          disabled={cancelInProgress}
          onClick={onCancel}
        >
          <FormattedMessage id="TransactionPanel.cancelButton" />
        </SecondaryButton>
      </div>
    </div>
  ) : null;
};

export default CancelButtonMaybe;
