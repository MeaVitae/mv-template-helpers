import countries from './countries.json';
export const localeLookupObject = {
    'en-GB': {
        isoCode: 'GBP',
        symbol: '£',
        currencyUnit: ['pound', 'pounds'],
        fractionalUnit: 'pence'
    },
    'en-US': {
        isoCode: 'USD',
        symbol: '$',
        currencyUnit: ['dollar', 'dollars'],
        fractionalUnit: 'cents'
    },
    'en-IE': {
        isoCode: 'EUR',
        symbol: '€',
        currencyUnit: ['euro', 'euros'],
        fractionalUnit: 'cents'
    }
};
export const countriesIsoLookupObject = countries.reduce((accumulator, country) => {
    const locale = country.default_locale.replace('_', '-');
    const newCountryObject = {
        ...country,
        locale,
        isInLocaleLookup: !!localeLookupObject[locale]
    };
    return {
        ...accumulator,
        [country.alpha2]: newCountryObject,
        [country.alpha3]: newCountryObject
    };
}, {});
export const currencyLookupObject = Object.entries(localeLookupObject).reduce((accumulator, localeArray) => {
    return {
        ...accumulator,
        [localeArray[1].isoCode]: {
            ...localeArray[1],
            locale: localeArray[0]
        }
    };
}, {});
export const getValidLocale = (localeOrCurrency) => {
    return (localeLookupObject[localeOrCurrency] && localeOrCurrency) ||
        (countriesIsoLookupObject[localeOrCurrency]?.isInLocaleLookup && countriesIsoLookupObject[localeOrCurrency].locale) ||
        (currencyLookupObject[localeOrCurrency] && currencyLookupObject[localeOrCurrency].locale) ||
        'en-GB';
};
