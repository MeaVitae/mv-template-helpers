import countries from './countries.json';
export declare const localeLookupObject: {
    'en-GB': {
        isoCode: string;
        symbol: string;
        currencyUnit: string[];
        fractionalUnit: string;
    };
    'en-US': {
        isoCode: string;
        symbol: string;
        currencyUnit: string[];
        fractionalUnit: string;
    };
    'en-IE': {
        isoCode: string;
        symbol: string;
        currencyUnit: string[];
        fractionalUnit: string;
    };
};
type CountriesObject = typeof countries[0];
type CountriesIsoLookupObject = {
    [iso: string]: CountriesObject & {
        locale: string;
        isInLocaleLookup: boolean;
    };
};
export declare const countriesIsoLookupObject: CountriesIsoLookupObject;
export declare const currencyLookupObject: [string, {
    isoCode: string;
    symbol: string;
    currencyUnit: string[];
    fractionalUnit: string;
} | {
    isoCode: string;
    symbol: string;
    currencyUnit: string[];
    fractionalUnit: string;
} | {
    isoCode: string;
    symbol: string;
    currencyUnit: string[];
    fractionalUnit: string;
}];
export declare const getValidLocale: (localeOrCurrency: string) => any;
export type LocaleLookupKeys = keyof typeof localeLookupObject;
export {};
