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
    'fr-FR': {
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
export const getValidLocale = (locale) => {
    return (localeLookupObject[locale] && locale) ||
        (countriesIsoLookupObject[locale]?.isInLocaleLookup && countriesIsoLookupObject[locale].locale) ||
        'en-GB';
};
