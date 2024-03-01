import genderLookup from './utils/genderLookup';
import groupStringLookup from './utils/groupStringLookup';
import localeLookupObject from './utils/localeLookupObject';
import n2words from 'n2words';
import { format } from 'date-fns';
import { formatMoney } from 'accounting';
import { titleCase } from 'title-case';
export default function () {
    let clauseArray = [0, 0, 0];
    const tableOfContentsArray = [];
    const getCurrentClause = () => clauseArray;
    const setCurrentClause = (updatedTitleNumber) => { clauseArray = updatedTitleNumber; };
    const addEntryToTOC = (entry) => tableOfContentsArray.push(entry);
    this.registerTag('majorNum', {
        parse: function (tagToken) {
            this.majorNumTitle = String(tagToken.args);
        },
        render: function () {
            const currentClause = getCurrentClause();
            const updatedMajorNum = currentClause[0] + 1;
            setCurrentClause([updatedMajorNum, 0, 0]);
            addEntryToTOC({
                clause: updatedMajorNum,
                title: this.updatedMajorTitle
            });
            return `${updatedMajorNum}.${this.majorNumTitle && (' ' + this.majorNumTitle)}`;
        }
    });
    this.registerTag('minorNum', {
        render: function () {
            const currentClause = getCurrentClause();
            const updatedNum = currentClause[1] + 1;
            setCurrentClause([currentClause[0], updatedNum, 0]);
            return `${currentClause[0]}.${updatedNum}.`;
        }
    });
    this.registerTag('subMinorNum', {
        render: function () {
            const currentClause = getCurrentClause();
            const updatedNum = currentClause[2] + 1;
            setCurrentClause([currentClause[0], currentClause[1], updatedNum]);
            return `${currentClause[0]}.${currentClause[1]}.${updatedNum}.`;
        }
    });
    this.registerFilter('numberToWords', (numberToConvert, locale) => {
        try {
            if (!numberToConvert)
                throw new Error('No number provided');
            if (typeof numberToConvert !== 'number')
                throw new Error('It is not a number');
            return this.filters.capitalize(n2words(numberToConvert, {
                lang: localeLookupObject[locale]?.n2wordsRef
            }));
        }
        catch (error) {
            return String(numberToConvert);
        }
    });
    this.registerFilter('numberToMoneyWords', (numberToConvert, locale) => {
        try {
            if (!numberToConvert)
                throw new Error('No number provided');
            if (typeof numberToConvert !== 'number')
                throw new Error('It is not a number');
            locale = localeLookupObject[locale] ? locale : 'en-GB';
            const numberAsWords = this.filters.numberToWords(numberToConvert, locale);
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
    this.registerFilter('formatDate', (date) => {
        try {
            if (!date)
                throw new Error('No date provided');
            return format(new Date(Number(date)), "do 'day of' MMMM, yyyy");
        }
        catch (error) {
            return String(date);
        }
    });
    this.registerFilter('formatMoney', (moneyNumber, locale) => {
        try {
            if (!moneyNumber)
                throw new Error('No money number provided');
            const localeObject = localeLookupObject[locale];
            if (!localeObject)
                throw new Error('Locale not found');
            return formatMoney(Number(moneyNumber), localeObject.symbol, 2);
        }
        catch (error) {
            return moneyNumber;
        }
    });
    this.registerFilter('fullName', (contact) => {
        return [contact.firstName, contact.middleNames, contact.lastName]
            .filter(name => !!name)
            .join(' ');
    });
    this.registerFilter('address', (addresses) => {
        const address = addresses?.[0];
        if (!address)
            return '';
        return [address.street, address.city, address.region, address.postalCode, address.country]
            .filter(value => !!value)
            .join(', ');
    });
    this.registerFilter('phoneNumber', (phoneNumbers) => {
        return phoneNumbers?.[0]?.phoneNumber || '';
    });
    this.registerFilter('emailAddress', (emailAddresses) => {
        return emailAddresses?.[0]?.email || '';
    });
    this.registerFilter('genderLookup', (genderType) => {
        return genderLookup[genderType] || genderLookup.unknown;
    });
    this.registerFilter('groupNameRelationship', (groupName) => {
        if (!groupName)
            return '';
        return groupStringLookup[groupName]
            ? groupStringLookup[groupName]
            : `my ${groupName}`;
    });
    // this.registerFilter('contact', (contact: Contact) => ({
    //   ...contact,
    //   contactFullName: this.filters.fullName(contact),
    //   contactDateOfBirthString: this.filters.formatDate(contact.dateOfBirth),
    //   contactAddress: this.filters.address(contact.addresses),
    //   contactEmailAddress: this.filters.emailAddress(contact.emailAddresses),
    //   contactPhoneNumber: this.filters.phoneNumber(contact.phoneNumbers),
    //   ...this.filters.genderLookup(contact.genderType)
    // }))
    this.registerFilter('contactsToNameAndAddressString', (contacts) => {
        if (!Array.isArray(contacts))
            return '';
        return contacts.reduce((accumulator, currentContact, index, sourceArray) => {
            const selectedAddress = titleCase(this.filters.address(currentContact.addresses));
            const delimiter = (index + 1) < sourceArray.length ? ',' : ' and';
            return accumulator
                ? accumulator.concat(`${delimiter} `, `${this.filters.fullName((currentContact))} of ${selectedAddress}`)
                : `${this.filters.fullName((currentContact))} of ${selectedAddress}`;
        }, '');
    });
    this.registerFilter('pageBreak', () => {
        return '<div class="page-break">&nbsp</div>';
    });
    this.registerFilter('titlecase', (title) => {
        return titleCase(String(title));
    });
}
