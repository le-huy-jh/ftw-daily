import React from 'react';
import { arrayOf, bool, func, shape, string } from 'prop-types';
import { compose } from 'redux';
import { Form as FinalForm } from 'react-final-form';
import { intlShape, injectIntl, FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import { propTypes } from '../../util/types';
import {
  Form,
  Button,
  FieldTextInput,
  FieldCurrencyInput,
  FieldRadioButton,
} from '../../components';
import { formatMoney } from '../../util/currency';
import { types as sdkTypes } from '../../util/sdkLoader';
import {
  required,
  composeValidators,
  moneySubUnitAmountAtLeast,
  greaterThanZero,
} from '../../util/validators';

import css from './EditProgramListingPricingForm.module.css';
import config from '../../config';
import { PRICING_TYPE_HOURLY, PRICING_TYPE_PACKAGE } from '../../marketplace-custom-config';

const { Money } = sdkTypes;

const currencyUnit = config.currencyConfig.currency;

const EditProgramListingPricingForm = props => (
  <FinalForm
    {...props}
    render={formRenderProps => {
      const {
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
        values,
      } = formRenderProps;

      const translationKey =
        values.pricingType === PRICING_TYPE_HOURLY
          ? 'EditProgramListingPricingForm.pricePerHour'
          : 'EditProgramListingPricingForm.pricePerPackage';

      const pricePerUnitMessage = intl.formatMessage({
        id: translationKey,
      });

      const pricingTypeRequiredMessage = intl.formatMessage({
        id: 'EditProgramListingPricingForm.pricingTypeRequired',
      });

      const quantityGreaterThanZeroMessage = intl.formatMessage({
        id: 'EditProgramListingPricingForm.quantityGreaterThanZero',
      });

      const pricePlaceholderMessage = intl.formatMessage({
        id: 'EditListingPricingForm.priceInputPlaceholder',
      });

      const quantityRequiredMessage = intl.formatMessage({
        id: 'EditProgramListingPricingForm.quantityRequired',
      });

      const quantityLabel = intl.formatMessage({
        id: 'EditProgramListingPricingForm.quantityLabel',
      });

      const hourlyLabel = intl.formatMessage({
        id: 'EditProgramListingPricingForm.hourlyLabel',
      });

      const hoursLabel = intl.formatMessage({
        id: 'EditProgramListingPricingForm.hoursLabel',
      });

      const packageLabel = intl.formatMessage({
        id: 'EditProgramListingPricingForm.packageLabel',
      });

      const totalPriceMessage = intl.formatMessage({
        id: 'EditProgramListingPricingForm.totalPrice',
      });

      const priceRequired = required(
        intl.formatMessage({
          id: 'EditProgramListingPricingForm.priceRequired',
        })
      );
      const minPrice = new Money(config.listingMinimumPriceSubUnits, config.currency);
      const minPriceRequired = moneySubUnitAmountAtLeast(
        intl.formatMessage(
          {
            id: 'EditProgramListingPricingForm.priceTooLow',
          },
          {
            minPrice: formatMoney(intl, minPrice),
          }
        ),
        config.listingMinimumPriceSubUnits
      );

      const priceValidators = config.listingMinimumPriceSubUnits
        ? composeValidators(priceRequired, minPriceRequired)
        : priceRequired;

      const quantityValidators = composeValidators(
        required(quantityRequiredMessage),
        greaterThanZero(quantityGreaterThanZeroMessage)
      );

      const classes = classNames(css.root, className);
      const submitReady = (updated && pristine) || ready;
      const submitInProgress = updateInProgress;
      const submitDisabled = invalid || disabled || submitInProgress;
      const { updateListingError, showListingsError } = fetchErrors || {};

      const { pricingType = PRICING_TYPE_HOURLY, price, quantity = 0, hours } = values;

      const totalPrice = values.price
        ? new Money(
            pricingType === PRICING_TYPE_PACKAGE ? quantity * price.amount : hours * price.amount,
            currencyUnit
          )
        : new Money(0, currencyUnit);

      return (
        <Form onSubmit={handleSubmit} className={classes}>
          {updateListingError ? (
            <p className={css.error}>
              <FormattedMessage id="EditProgramListingPricingPanel.updateFailed" />
            </p>
          ) : null}
          {showListingsError ? (
            <p className={css.error}>
              <FormattedMessage id="EditProgramListingPricingPanel.showListingFailed" />
            </p>
          ) : null}
          <div>Pricing type</div>
          <FieldRadioButton
            label={packageLabel}
            id={PRICING_TYPE_PACKAGE}
            name="pricingType"
            value={PRICING_TYPE_PACKAGE}
            validate={required(pricingTypeRequiredMessage)}
          />
          <FieldRadioButton
            label={hourlyLabel}
            id={PRICING_TYPE_HOURLY}
            name="pricingType"
            value={PRICING_TYPE_HOURLY}
            validate={required(pricingTypeRequiredMessage)}
          />

          {values.pricingType === PRICING_TYPE_HOURLY && (
            <FieldTextInput
              id="hours"
              name="hours"
              className={css.hours}
              type="text"
              label={hoursLabel}
              disabled
            />
          )}

          {values.pricingType === PRICING_TYPE_PACKAGE && (
            <FieldTextInput
              id="packageQuantity"
              name="packageQuantity"
              className={css.hours}
              type="number"
              label={quantityLabel}
              validate={quantityValidators}
            />
          )}

          <FieldCurrencyInput
            id="price"
            name="price"
            className={css.priceInput}
            autoFocus
            label={pricePerUnitMessage}
            placeholder={pricePlaceholderMessage}
            currencyConfig={config.currencyConfig}
            validate={priceValidators}
          />

          <div>
            {totalPriceMessage}: {totalPrice.amount / 100} {currencyUnit}
          </div>

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

EditProgramListingPricingForm.defaultProps = { className: null, fetchErrors: null };

EditProgramListingPricingForm.propTypes = {
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

export default compose(injectIntl)(EditProgramListingPricingForm);
