import genderLookup, { GenderType } from './utils/genderLookup'
import groupStringLookup, { GroupStringType } from './utils/groupStringLookup'
import localeLookupObject, { LocaleLookupKeys } from './utils/localeLookupObject'
import { Contact, Address, EmailAddress, PhoneNumber } from '@meavitae/mv-types'
import { Liquid } from 'liquidjs'
import { ToWords } from 'to-words'
import { format } from 'date-fns'
import { formatMoney } from 'accounting'
import { titleCase } from 'title-case'

type TableOfContentsEntry = { clause: number; title: string; }

export default async function (template: string, data: object) {
  const engine = new Liquid()

  let clauseArray = [0, 0, 0]
  const tableOfContentsArray: TableOfContentsEntry[] = []
  const getCurrentClause = () => clauseArray
  const setCurrentClause = (updatedTitleNumber: [number, number, number]) => { clauseArray = updatedTitleNumber }
  const addEntryToTOC = (entry: TableOfContentsEntry) => tableOfContentsArray.push(entry)

  engine.registerTag('majorNum', {
    parse: function (tagToken) {
      this.majorNumTitle = String(tagToken.args)
    },

    render: function () {
      const currentClause = getCurrentClause()
      const updatedMajorNum = currentClause[0] + 1

      setCurrentClause([updatedMajorNum, 0, 0])

      addEntryToTOC({
        clause: updatedMajorNum,
        title: this.majorNumTitle
      })

      return `${updatedMajorNum}.${this.majorNumTitle && (' ' + this.majorNumTitle)}`
    }
  })

  engine.registerTag('minorNum', {
    render: function () {
      const currentClause = getCurrentClause()
      const updatedNum = currentClause[1] + 1

      setCurrentClause([currentClause[0], updatedNum, 0])

      return `${currentClause[0]}.${updatedNum}.`
    }
  })

  engine.registerTag('subMinorNum', {
    render: function () {
      const currentClause = getCurrentClause()
      const updatedNum = currentClause[2] + 1

      setCurrentClause([currentClause[0], currentClause[1], updatedNum])

      return `${currentClause[0]}.${currentClause[1]}.${updatedNum}.`
    }
  })

  engine.registerFilter('numberToWords', (numberToConvert: number, locale: LocaleLookupKeys) => {
    try {
      if (!numberToConvert) throw new Error('No number provided')
      if (typeof numberToConvert !== 'number') throw new Error('It is not a number')

      const toWords = new ToWords({ localeCode: locale })
      return engine.filters.capitalize(toWords.convert((numberToConvert)))
    } catch (error) {
      return String(numberToConvert)
    }
  })

  engine.registerFilter('numberToMoneyWords', (numberToConvert: number, locale: LocaleLookupKeys) => {
    try {
      if (!numberToConvert) throw new Error('No number provided')
      if (typeof numberToConvert !== 'number') throw new Error('It is not a number')

      locale = localeLookupObject[locale] ? locale : 'en-GB'

      const numberAsWords = engine.filters.numberToWords(numberToConvert, locale)
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

  engine.registerFilter('formatDate', (date: number) => {
    try {
      if (!date) throw new Error('No date provided')

      return format(new Date(Number(date)), "do 'day of' MMMM, yyyy")
    } catch (error) {
      return String(date)
    }
  })

  engine.registerFilter('formatMoney', (moneyNumber: number, locale: LocaleLookupKeys) => {
    try {
      if (!moneyNumber) throw new Error('No money number provided')
      const localeObject = localeLookupObject[locale]
      if (!localeObject) throw new Error('Locale not found')

      return formatMoney(Number(moneyNumber), localeObject.symbol, 2)
    } catch (error) {
      return moneyNumber
    }
  })

  engine.registerFilter('fullName', (contact: Contact) => {
    return [contact.firstName, contact.middleNames, contact.lastName]
      .filter(name => !!name)
      .join(' ')
  })

  engine.registerFilter('address', (addresses: Address[]) => {
    const address = addresses?.[0]
    if (!address) return ''

    return [address.street, address.city, address.region, address.postalCode, address.country]
      .filter(value => !!value)
      .join(', ')
  })

  engine.registerFilter('phoneNumber', (phoneNumbers: PhoneNumber[]) => {
    return phoneNumbers?.[0]?.phoneNumber || ''
  })

  engine.registerFilter('emailAddress', (emailAddresses: EmailAddress[]) => {
    return emailAddresses?.[0]?.email || ''
  })

  engine.registerFilter('genderLookup', (genderType: GenderType) => {
    return genderLookup[genderType] || genderLookup.unknown
  })

  engine.registerFilter('groupNameRelationship', (groupName: GroupStringType) => {
    if (!groupName) return ''

    return groupStringLookup[groupName]
      ? groupStringLookup[groupName]
      : `my ${groupName}`
  })

  engine.registerFilter('contactsToNameAndAddressString', (contacts: Contact) => {
    if (!Array.isArray(contacts)) return ''

    return contacts.reduce((accumulator, currentContact, index, sourceArray) => {
      const selectedAddress = titleCase(engine.filters.address(currentContact.addresses))
      const delimiter = (index + 1) < sourceArray.length ? ',' : ' and'

      return accumulator
        ? accumulator.concat(`${delimiter} `, `${engine.filters.fullName((currentContact))} of ${selectedAddress}`)
        : `${engine.filters.fullName((currentContact))} of ${selectedAddress}`
    }, '')
  })

  engine.registerFilter('pageBreak', () => {
    return '<div class="page-break">&nbsp</div>'
  })

  engine.registerFilter('titlecase', (title: string) => {
    return titleCase(String(title))
  })

  const openTagTOC = '<nav id="toc">'
  const closeTagTOC = '</nav>'

  engine.registerTag('toc', {
    render: function () {
      return `${openTagTOC}${closeTagTOC}`
    }
  })

  const renderedTemplate = (await engine.parseAndRender(template, data))

  const tableOfContentsHtml = tableOfContentsArray.length
    ? openTagTOC + 'Table of Contents' + '<ol>' + tableOfContentsArray.reduce((accumulator, { title }) => `${accumulator}<li>${title}</li>`, '') + '</ol>' + closeTagTOC
    : ''
  return renderedTemplate.replace(`${openTagTOC}${closeTagTOC}`, tableOfContentsHtml)
}
