import genderLookup from './utils/genderLookup';
import groupStringLookup from './utils/groupStringLookup';
import { Liquid } from 'liquidjs';
import { ToWords } from 'to-words';
import { format } from 'date-fns';
import { formatMoney } from 'accounting';
import { localeLookupObject, getValidLocale } from './utils/locales';
import { titleCase } from 'title-case';
export default async function (template, data) {
    const engine = new Liquid();
    let clauseArray = [0, 0, 0];
    const tableOfContentsArray = [];
    const getCurrentClause = () => clauseArray;
    const setCurrentClause = (updatedTitleNumber) => { clauseArray = updatedTitleNumber; };
    const addEntryToTOC = (entry) => tableOfContentsArray.push(entry);
    engine.registerTag('majorNum', {
        parse: function (tagToken) {
            this.majorNumTitle = String(tagToken.args);
        },
        render: function () {
            const currentClause = getCurrentClause();
            const updatedMajorNum = currentClause[0] + 1;
            setCurrentClause([updatedMajorNum, 0, 0]);
            addEntryToTOC({
                clause: updatedMajorNum,
                title: this.majorNumTitle
            });
            return `${updatedMajorNum}.${this.majorNumTitle && (' ' + this.majorNumTitle)}`;
        }
    });
    engine.registerTag('minorNum', {
        render: function () {
            const currentClause = getCurrentClause();
            const updatedNum = currentClause[1] + 1;
            setCurrentClause([currentClause[0], updatedNum, 0]);
            return `${currentClause[0]}.${updatedNum}.`;
        }
    });
    engine.registerTag('subMinorNum', {
        render: function () {
            const currentClause = getCurrentClause();
            const updatedNum = currentClause[2] + 1;
            setCurrentClause([currentClause[0], currentClause[1], updatedNum]);
            return `${currentClause[0]}.${currentClause[1]}.${updatedNum}.`;
        }
    });
    engine.registerFilter('numberToWords', (numberToConvert, locale = 'en-GB') => {
        try {
            if (!numberToConvert)
                throw new Error('No number provided');
            if (typeof numberToConvert !== 'number')
                throw new Error('It is not a number');
            locale = getValidLocale(locale);
            const toWords = new ToWords({ localeCode: locale });
            return engine.filters.capitalize(toWords.convert((numberToConvert)));
        }
        catch (error) {
            return String(numberToConvert);
        }
    });
    engine.registerFilter('numberToMoneyWords', (numberToConvert, localeOrCurrency = 'en-GB') => {
        try {
            if (!numberToConvert)
                throw new Error('No number provided');
            if (typeof numberToConvert !== 'number')
                throw new Error('It is not a number');
            const locale = getValidLocale(localeOrCurrency);
            const numberAsWords = engine.filters.numberToWords(numberToConvert, locale);
            const pointIndex = numberAsWords.indexOf('point');
            const currencyUnit = localeLookupObject[locale].currencyUnit[numberToConvert > 1.99 || numberToConvert < 1 ? 1 : 0];
            const fractionalUnit = localeLookupObject[locale].fractionalUnit;
            return pointIndex > -1
                ? `${numberAsWords.substring(0, pointIndex)}${currencyUnit} ${numberAsWords.substring(pointIndex)} ${fractionalUnit}`
                : `${numberAsWords} ${currencyUnit}`;
        }
        catch (error) {
            return String(numberToConvert);
        }
    });
    engine.registerFilter('formatDate', (date) => {
        try {
            if (!date)
                throw new Error('No date provided');
            return format(new Date(Number(date)), "do 'day of' MMMM, yyyy");
        }
        catch (error) {
            return String(date);
        }
    });
    engine.registerFilter('formatMoney', (moneyNumber, localeOrCurrency) => {
        try {
            if (!moneyNumber)
                throw new Error('No money number provided');
            const locale = getValidLocale(localeOrCurrency);
            const localeObject = localeLookupObject[locale];
            if (!localeObject)
                throw new Error('Locale not found');
            return formatMoney(Number(moneyNumber), localeObject.symbol, 2);
        }
        catch (error) {
            return moneyNumber;
        }
    });
    engine.registerFilter('fullName', (contact) => {
        return [contact.firstName, contact.middleNames, contact.lastName]
            .filter(name => !!name)
            .join(' ');
    });
    engine.registerFilter('address', (addresses) => {
        const address = addresses?.[0];
        if (!address)
            return '';
        return [address.street, address.city, address.region, address.postalCode, address.country]
            .filter(value => !!value)
            .join(', ');
    });
    engine.registerFilter('phoneNumber', (phoneNumbers) => {
        return phoneNumbers?.[0]?.phoneNumber || '';
    });
    engine.registerFilter('emailAddress', (emailAddresses) => {
        return emailAddresses?.[0]?.email || '';
    });
    engine.registerFilter('genderLookup', (genderType) => {
        return genderLookup[genderType] || genderLookup.unknown;
    });
    engine.registerFilter('groupNameRelationship', (groupName) => {
        if (!groupName)
            return '';
        return groupStringLookup[groupName]
            ? groupStringLookup[groupName]
            : `my ${groupName}`;
    });
    engine.registerFilter('contactsToNameAndAddressString', (contacts) => {
        if (!Array.isArray(contacts))
            return '';
        return contacts.reduce((accumulator, currentContact, index, sourceArray) => {
            const selectedAddress = titleCase(engine.filters.address(currentContact.addresses));
            const delimiter = (index + 1) < sourceArray.length ? ',' : ' and';
            return accumulator
                ? accumulator.concat(`${delimiter} `, `${engine.filters.fullName((currentContact))} of ${selectedAddress}`)
                : `${engine.filters.fullName((currentContact))} of ${selectedAddress}`;
        }, '');
    });
    engine.registerTag('pageBreak', {
        render: function () {
            return '<div class="page-break">&nbsp</div>';
        }
    });
    engine.registerFilter('titlecase', (title) => {
        return titleCase(String(title));
    });
    const openTagTOC = '<nav id="toc">';
    const closeTagTOC = '</nav>';
    engine.registerTag('toc', {
        render: function () {
            return `${openTagTOC}${closeTagTOC}`;
        }
    });
    const renderedTemplate = (await engine.parseAndRender(template, data));
    const tableOfContentsHtml = tableOfContentsArray.length
        ? openTagTOC + 'Table of Contents' + '<ol>' + tableOfContentsArray.reduce((accumulator, { title }) => `${accumulator}<li>${title}</li>`, '') + '</ol>' + closeTagTOC
        : '';
    return renderedTemplate.replace(`${openTagTOC}${closeTagTOC}`, tableOfContentsHtml);
}
