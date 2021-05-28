/* eslint-disable no-restricted-globals */
import {
  saveApplicationStepDataToBackend,
  updateEditApplicationData,
} from '../../../../redux/ApplicationAction';
import { NUMBER_REGEX, SPECIAL_CHARACTER_REGEX } from '../../../../../../constants/RegexConstants';

export const applicationCompanyStepValidations = async (dispatch, data, editApplicationData) => {
  const errors = {};
  let validated = true;

  if (data?.country?.value === 'AUS' || data?.country?.value === 'NZL') {
    if (!data?.abn || data?.abn.trim().length <= 0) {
      validated = false;
      errors.abn = 'Please enter ABN number before continue';
    }
    if (data?.abn && (!NUMBER_REGEX.test(data?.abn) || data?.abn?.trim()?.length !== 11)) {
      validated = false;
      errors.abn = 'Please enter valid ABN number before continue';
    }
    if (data?.acn && (!NUMBER_REGEX.test(data?.acn) || data?.acn?.trim()?.length !== 9)) {
      validated = false;
      errors.acn = 'Please enter valid ACN number before continue';
    }
  } else if (!data?.registrationNumber || data?.registrationNumber?.trim().length <= 0) {
    validated = false;
    errors.registrationNumber = 'Please enter registration number before continue';
  } else if (
    data?.registrationNumber &&
    (data?.registrationNumber?.length <= 5 ||
      data?.registrationNumber?.length >= 30 ||
      !NUMBER_REGEX.test(data?.registrationNumber))
  ) {
    validated = false;
    errors.registrationNumber = 'Please enter valid registration number';
  }
  if (
    !data?.entityName ||
    data?.entityName?.length <= 0 ||
    data?.entityName?.value?.trim()?.length <= 0
  ) {
    validated = false;
    errors.entityName = 'Please enter entity name before continue';
  }
  if (!data?.entityType || Object.entries(data?.entityType).length === 0) {
    validated = false;
    errors.entityType = 'Please select entity type before continue';
  }
  if (!data?.country || Object.entries(data?.country).length === 0) {
    validated = false;
    errors.country = 'Please select country before continue';
  }
  if (!data?.streetNumber || data?.streetNumber.length === 0) {
    validated = false;
    errors.streetNumber = 'Please enter street number before continue';
  }
  if (data?.streetNumber && !NUMBER_REGEX.test(data?.streetNumber)) {
    validated = false;
    errors.streetNumber = 'Street number should be number';
  }
  if (!data?.state || Object.entries(data?.state).length === 0) {
    validated = false;
    if (data?.country?.value === 'AUS' || data?.country?.value === 'NZL') {
      errors.state = 'Please select state before continue';
    } else {
      errors.state = 'Please enter state before continue';
    }
  }
  if (
    !['AUS', 'NZL'].includes(data?.country?.value) &&
    data?.state &&
    !data.state.value &&
    SPECIAL_CHARACTER_REGEX.test(data?.state)
  ) {
    validated = false;
    errors.state = 'Please enter valid state';
  }
  if (
    data?.state?.value &&
    !['AUS', 'NZL'].includes(data?.country?.value) &&
    SPECIAL_CHARACTER_REGEX.test(data?.state.value)
  ) {
    validated = false;
    errors.state = 'Please enter valid state';
  }
  if (!data?.postCode || data?.postCode?.length === 0) {
    validated = false;
    errors.postCode = 'Please enter post code before continue';
  }
  if (data?.postCode && !NUMBER_REGEX.test(data?.postCode)) {
    validated = false;
    errors.postCode = 'Post code should be number';
  }
  if (data?.phoneNumber && !NUMBER_REGEX.test(data?.postCode)) {
    validated = false;
    errors.phoneNumber = 'Phone number should be number';
  }
  if (validated) {
    const {
      postCode,
      state,
      suburb,
      streetType,
      streetName,
      streetNumber,
      unitNumber,
      property,
      entityType,
      phoneNumber,
      entityName,
      acn,
      abn,
      tradingName,
      outstandingAmount,
      debtorId,
      country,
      isActive,
      wipeOutDetails,
      registrationNumber,
    } = data;

    delete country?.name;

    const finalData = {
      stepper: 'company',
      debtorId: debtorId?.value,
      isActive: typeof isActive === 'string' ? isActive === 'Active' : isActive,
      entityName: entityName?.label,
      tradingName,
      contactNumber: phoneNumber,
      outstandingAmount,
      entityType: entityType?.value,
      wipeOutDetails,
      address: {
        property,
        unitNumber,
        streetNumber,
        streetName,
        streetType: streetType?.value,
        suburb,
        state: state?.value ?? state,
        country: { name: country?.label, code: country?.value },
        postCode,
      },
      applicationId: editApplicationData?._id ?? '',
    };

    if (data?.country?.value === 'AUS' || data?.country?.value === 'NZL') {
      finalData.abn = abn ?? '';
      finalData.acn = acn ?? '';
    } else {
      finalData.registrationNumber = registrationNumber ?? '';
    }

    try {
      await dispatch(saveApplicationStepDataToBackend(finalData));
      validated = true;
    } catch (e) {
      /**/
      validated = false;
    }
  }
  dispatch(updateEditApplicationData('company', { errors }));
  return validated;
};
