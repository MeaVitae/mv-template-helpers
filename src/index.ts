import genderLookup, { GenderType } from './utils/genderLookup'
import groupStringLookup, { GroupStringType } from './utils/groupStringLookup'
import localeLookupObject, { LocaleLookupKeys } from './utils/localeLookupObject'
import n2words from 'n2words'
import { Contact, Address, EmailAddress, PhoneNumber } from '@meavitae/mv-types'
import { Value, Liquid, TagToken, Context, Emitter, Tag, TopLevelToken } from 'liquidjs'
import { format } from 'date-fns'
import { formatMoney } from 'accounting'
import { titleCase } from 'title-case'

type TableOfContentsEntry = { clause: number; title: string; }

export default function (this: Liquid) {
  let clauseArray = [0, 0, 0]
  const tableOfContentsArray: TableOfContentsEntry[] = []
  const getCurrentClause = () => clauseArray
  const setCurrentClause = (updatedTitleNumber: [number, number, number]) => { clauseArray = updatedTitleNumber }
  const addEntryToTOC = (entry: TableOfContentsEntry) => tableOfContentsArray.push(entry)

  this.registerTag('majorNum', {
    parse: function (tagToken) {
      const entry = tagToken.args

      const currentClause = getCurrentClause()
      this.updatedMajorNum = currentClause[0] + 1
      this.updatedMajorTitle = typeof entry === 'string' ? entry : ''

      setCurrentClause([this.updatedMajorNum, 0, 0])

      addEntryToTOC({
        clause: this.updatedMajorNum,
        title: this.updatedMajorTitle
      })
    },

    render: function () {
      return `<h1 class="major-number-title">${this.updatedMajorNum}${this.updatedMajorTitle && (' ' + this.updatedMajorTitle)}</h1>`
    }
  })

  this.registerTag('minorNum', {
    parse: function () {
      this.currentClause = getCurrentClause()
      this.updatedMinorNum = this.currentClause[1] + 1

      setCurrentClause([this.currentClause[0], this.updatedMinorNum, 0])
    },

    render: function () {
      return `<h2 class="minor-number-title">${this.currentClause[0]}.${this.updatedMinorNum}</h2>`
    }
  })

  this.registerTag('subMinorNum', {
    parse: function () {
      this.currentClause = getCurrentClause()
      this.updatedSubMinorNum = this.currentClause[2] + 1

      setCurrentClause([this.currentClause[0], this.currentClause[1], this.updatedSubMinorNum])
    },

    render: function () {
      return `<h3 class="sub-minor-number-title">${this.currentClause[0]}.${this.currentClause[1]}.${this.updatedSubMinorNum}</h3>`
    }
  })

  this.registerFilter('numberToWords', (numberToConvert: number, locale: LocaleLookupKeys) => {
    try {
      if (!numberToConvert) throw new Error('No number provided')
      if (typeof numberToConvert !== 'number') throw new Error('It is not a number')

      return this.filters.capitalize(n2words(numberToConvert, {
        lang: localeLookupObject[locale]?.n2wordsRef
      }))
    } catch (error) {
      return String(numberToConvert)
    }
  })

  this.registerFilter('numberToMoneyWords', (numberToConvert: number, locale: LocaleLookupKeys) => {
    try {
      if (!numberToConvert) throw new Error('No number provided')
      if (typeof numberToConvert !== 'number') throw new Error('It is not a number')

      locale = localeLookupObject[locale] ? locale : 'en-GB'

      const numberAsWords = this.filters.numberToWords(numberToConvert, locale)
      const pointIndex = numberAsWords.indexOf('point')
      const currencyUnit = localeLookupObject[locale].currencyUnit[numberToConvert > 1.99 || numberToConvert < 1 ? 1 : 0]
      const fractionalUnit = localeLookupObject[locale].fractionalUnit

      return pointIndex > -1
        ? `${numberAsWords.substring(0, pointIndex)}${currencyUnit} ${numberAsWords.substring(pointIndex)} ${fractionalUnit}`
        : `${numberAsWords} ${currencyUnit}`
    } catch (error) {
      return String(numberToConvert)
    }
  })

  this.registerFilter('formatDate', (date: number) => {
    try {
      if (!date) throw new Error('No date provided')

      return format(new Date(Number(date)), "do 'day of' MMMM, yyyy")
    } catch (error) {
      return String(date)
    }
  })

  this.registerFilter('formatMoney', (moneyNumber: number, locale: LocaleLookupKeys) => {
    try {
      if (!moneyNumber) throw new Error('No money number provided')
      const localeObject = localeLookupObject[locale]
      if (!localeObject) throw new Error('Locale not found')

      return formatMoney(Number(moneyNumber), localeObject.symbol, 2)
    } catch (error) {
      return moneyNumber
    }
  })

  this.registerFilter('fullName', (contact: Contact) => {
    return [contact.firstName, contact.middleNames, contact.lastName]
      .filter(name => !!name)
      .join(' ')
  })

  this.registerFilter('address', (addresses: Address[]) => {
    const address = addresses?.[0]
    if (!address) return ''

    return [address.street, address.city, address.region, address.postalCode, address.country]
      .filter(value => !!value)
      .join(', ')
  })

  this.registerFilter('phoneNumber', (phoneNumbers: PhoneNumber[]) => {
    return phoneNumbers?.[0]?.phoneNumber || ''
  })

  this.registerFilter('emailAddress', (emailAddresses: EmailAddress[]) => {
    return emailAddresses?.[0]?.email || ''
  })

  this.registerFilter('genderLookup', (genderType: GenderType) => {
    return genderLookup[genderType] || genderLookup.unknown
  })

  this.registerFilter('groupNameRelationship', (groupName: GroupStringType) => {
    if (!groupName) return ''

    return groupStringLookup[groupName]
      ? groupStringLookup[groupName]
      : `my ${groupName}`
  })

  // this.registerFilter('contact', (contact: Contact) => ({
  //   ...contact,
  //   contactFullName: this.filters.fullName(contact),
  //   contactDateOfBirthString: this.filters.formatDate(contact.dateOfBirth),
  //   contactAddress: this.filters.address(contact.addresses),
  //   contactEmailAddress: this.filters.emailAddress(contact.emailAddresses),
  //   contactPhoneNumber: this.filters.phoneNumber(contact.phoneNumbers),
  //   ...this.filters.genderLookup(contact.genderType)
  // }))

  this.registerFilter('contactsToNameAndAddressString', (contacts: Contact) => {
    if (!Array.isArray(contacts)) return ''

    return contacts.reduce((accumulator, currentContact, index, sourceArray) => {
      const selectedAddress = titleCase(this.filters.address(currentContact.addresses))
      const delimiter = (index + 1) < sourceArray.length ? ',' : ' and'

      return accumulator
        ? accumulator.concat(`${delimiter} `, `${this.filters.fullName((currentContact))} of ${selectedAddress}`)
        : `${this.filters.fullName((currentContact))} of ${selectedAddress}`
    }, '')
  })

  this.registerFilter('pageBreak', () => {
    return '<div class="page-break">&nbsp</div>'
  })

  this.registerFilter('titlecase', (title: string) => {
    return titleCase(String(title))
  })
}
