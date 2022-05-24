import React from 'react';
import { arrayOf, bool, func, shape, string } from 'prop-types';
import { compose } from 'redux';
import { Form as FinalForm } from 'react-final-form';
import { intlShape, injectIntl, FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import { propTypes } from '../../util/types';
import {
  maxLength,
  required,
  composeValidators,
  requiredNumber,
  greaterThanZero,
} from '../../util/validators';
import {
  Form,
  Button,
  FieldTextInput,
  FieldCheckboxGroup,
  FieldRadioButton,
} from '../../components';
import { findOptionsForSelectFilter } from '../../util/search';
import { filters as filterConfig } from '../../marketplace-custom-config';
import arrayMutators from 'final-form-arrays';
import config from '../../config';

import css from './EditProgramListingGeneralForm.module.css';

const { customHoursMessage, difficultyKey } = config;
const TITLE_MAX_LENGTH = 60;

const TWO_HOUR_OPTION = '2';
const FOUR_HOUR_OPTION = '4';
const EIGHT_HOUR_OPTION = '8';

const EditProgramListingGeneralForm = props => {
  return (
    <FinalForm
      {...props}
      mutators={{ ...arrayMutators }}
      render={formRenderProps => {
        const {
          values,
          className,
          disabled,
          ready,
          handleSubmit,
          intl,
          invalid,
          pristine,
          saveActionMsg,
          updated,
          updateInProgress,
          fetchErrors,
        } = formRenderProps;

        const customHoursRequiredNumberMessage = intl.formatMessage({
          id: 'EditProgramListingGeneralForm.hoursCustomPlaceholderRequiredNumber',
        });
        const hoursRequiredMessage = intl.formatMessage({
          id: 'EditProgramListingGeneralForm.hoursPlaceholderRequiredNumber',
        });
        const titleMessage = intl.formatMessage({ id: 'EditProgramListingGeneralForm.title' });
        const titlePlaceholderMessage = intl.formatMessage({
          id: 'EditProgramListingGeneralForm.titlePlaceholder',
        });
        const titleRequiredMessage = intl.formatMessage({
          id: 'EditProgramListingGeneralForm.titleRequired',
        });
        const maxLengthMessage = intl.formatMessage(
          { id: 'EditProgramListingGeneralForm.maxLength' },
          {
            maxLength: TITLE_MAX_LENGTH,
          }
        );

        const hoursPlaceholder = intl.formatMessage({
          id: 'EditProgramListingGeneralForm.hoursCustomPlaceholder',
        });

        const descriptionMessage = intl.formatMessage({
          id: 'EditProgramListingGeneralForm.description',
        });
        const descriptionPlaceholderMessage = intl.formatMessage({
          id: 'EditProgramListingGeneralForm.descriptionPlaceholder',
        });
        const tagsMessage = intl.formatMessage({
          id: 'EditProgramListingGeneralForm.tags',
        });
        const tagsPlaceholder = intl.formatMessage({
          id: 'EditProgramListingGeneralForm.tagsPlaceholder',
        });
        const maxLength60Message = maxLength(maxLengthMessage, TITLE_MAX_LENGTH);
        const descriptionRequiredMessage = intl.formatMessage({
          id: 'EditProgramListingGeneralForm.descriptionRequired',
        });
        const difficultyMessage = intl.formatMessage({
          id: 'EditProgramListingGeneralForm.difficultyLabel',
        });
        const difficultyRequiredMessage = intl.formatMessage({
          id: 'EditProgramListingGeneralForm.difficultyRequired',
        });
        const tagsRequiredMessage = intl.formatMessage({
          id: 'EditProgramListingGeneralForm.tagsRequired',
        });
        const hoursGreaterThanZero = intl.FormattedMessage({
          id: 'EditProgramListingGeneralForm.hoursGreaterThanZero',
        });

        const { updateListingError, createListingDraftError, showListingsError } =
          fetchErrors || {};
        const errorMessageUpdateListing = updateListingError ? (
          <p className={css.error}>
            <FormattedMessage id="EditProgramListingGeneralForm.updateFailed" />
          </p>
        ) : null;

        // This error happens only on first tab (of EditListingWizard)
        const errorMessageCreateListingDraft = createListingDraftError ? (
          <p className={css.error}>
            <FormattedMessage id="EditProgramListingGeneralForm.createListingDraftError" />
          </p>
        ) : null;

        const errorMessageShowListing = showListingsError ? (
          <p className={css.error}>
            <FormattedMessage id="EditProgramListingGeneralForm.showListingFailed" />
          </p>
        ) : null;

        const classes = classNames(css.root, className);
        const submitReady = (updated && pristine) || ready;
        const submitInProgress = updateInProgress;
        const submitDisabled = invalid || disabled || submitInProgress;

        const difficultyOptions = findOptionsForSelectFilter(difficultyKey, filterConfig);

        return (
          <Form className={classes} onSubmit={handleSubmit}>
            {errorMessageCreateListingDraft}
            {errorMessageUpdateListing}
            {errorMessageShowListing}
            <FieldTextInput
              id="title"
              name="title"
              className={css.title}
              type="text"
              label={titleMessage}
              placeholder={titlePlaceholderMessage}
              maxLength={TITLE_MAX_LENGTH}
              validate={composeValidators(required(titleRequiredMessage), maxLength60Message)}
              autoFocus
            />

            <FieldTextInput
              id="description"
              name="description"
              className={css.description}
              type="textarea"
              label={descriptionMessage}
              placeholder={descriptionPlaceholderMessage}
              validate={required(descriptionRequiredMessage)}
            />

            <FieldTextInput
              id="tags"
              name="tags"
              className={css.description}
              type="text"
              label={tagsMessage}
              placeholder={tagsPlaceholder}
              validate={required(tagsRequiredMessage)}
            />

            <FieldCheckboxGroup
              label={difficultyMessage}
              className={css.difficulty}
              id={difficultyKey}
              name={difficultyKey}
              options={difficultyOptions}
              validate={required(difficultyRequiredMessage)}
            />

            <div>Hours</div>
            <FieldRadioButton
              label={TWO_HOUR_OPTION}
              id={TWO_HOUR_OPTION}
              name="hours"
              value={TWO_HOUR_OPTION}
              validate={required(hoursRequiredMessage)}
            />
            <FieldRadioButton
              label={FOUR_HOUR_OPTION}
              id={FOUR_HOUR_OPTION}
              name="hours"
              value={FOUR_HOUR_OPTION}
              validate={required(hoursRequiredMessage)}
            />
            <FieldRadioButton
              label={EIGHT_HOUR_OPTION}
              id={EIGHT_HOUR_OPTION}
              name="hours"
              value={EIGHT_HOUR_OPTION}
              validate={required(hoursRequiredMessage)}
            />
            <FieldRadioButton
              label={customHoursMessage}
              id={customHoursMessage}
              name="hours"
              value={customHoursMessage}
              validate={required(hoursRequiredMessage)}
            />
            {values.hours === customHoursMessage && (
              <FieldTextInput
                id="customHoursInput"
                name="customHours"
                className={css.title}
                type="number"
                placeholder={hoursPlaceholder}
                validate={composeValidators(
                  required(customHoursRequiredNumberMessage),
                  greaterThanZero(hoursGreaterThanZero)
                )}
              />
            )}

            <Button
              className={css.submitButton}
              type="submit"
              inProgress={submitInProgress}
              disabled={submitDisabled}
              ready={submitReady}
            >
              {saveActionMsg}
            </Button>
          </Form>
        );
      }}
    />
  );
};

EditProgramListingGeneralForm.defaultProps = { className: null, fetchErrors: null };

EditProgramListingGeneralForm.propTypes = {
  className: string,
  intl: intlShape.isRequired,
  onSubmit: func.isRequired,
  saveActionMsg: string.isRequired,
  disabled: bool.isRequired,
  ready: bool.isRequired,
  updated: bool.isRequired,
  updateInProgress: bool.isRequired,
  fetchErrors: shape({
    createListingDraftError: propTypes.error,
    showListingsError: propTypes.error,
    updateListingError: propTypes.error,
  }),
};

export default compose(injectIntl)(EditProgramListingGeneralForm);
