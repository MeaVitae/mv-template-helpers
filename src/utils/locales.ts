import countries from './countries.json'

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
}

type CountriesObject = typeof countries[0]
type CountriesIsoLookupObject = { [iso: string]: CountriesObject & { locale: string; isInLocaleLookup: boolean; } }

export const countriesIsoLookupObject = countries.reduce((accumulator, country) => {
  const locale = country.default_locale.replace('_', '-')
  const newCountryObject = {
    ...country,
    locale,
    isInLocaleLookup: !!localeLookupObject[locale]
  }

  return {
    ...accumulator,
    [country.alpha2]: newCountryObject,
    [country.alpha3]: newCountryObject
  }
}, {} as CountriesIsoLookupObject)

type CurrencyLookupObject = { [currency: string]: CountriesObject & { locale: string; } }

export const currencyLookupObject = Object.entries(localeLookupObject).reduce((accumulator, localeArray) => {
  return {
    ...accumulator,
    [localeArray[1].isoCode]: {
      ...localeArray[1],
      locale: localeArray[0]
    }
  }
}, {} as CurrencyLookupObject)

export const getValidLocale = (localeOrCurrency: string) => {
  return (localeLookupObject[localeOrCurrency] && localeOrCurrency) ||
    (countriesIsoLookupObject[localeOrCurrency]?.isInLocaleLookup && countriesIsoLookupObject[localeOrCurrency].locale) ||
    (currencyLookupObject[localeOrCurrency] && currencyLookupObject[localeOrCurrency].locale) ||
    'en-GB'
}

export type LocaleLookupKeys = keyof typeof localeLookupObject
