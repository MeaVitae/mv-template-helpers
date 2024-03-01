import mvTemplateHelpers from '../dist'
import testData from './json/data.json'
import { Liquid } from 'liquidjs'
import { test, describe, expect, beforeEach } from 'vitest'

let engine

beforeEach(async () => {
  engine = new Liquid()
  engine.plugin(mvTemplateHelpers)
})

describe('MV Liquidjs filters and Tags', () => {
  describe('majorNum Tag', () => {
    test('it increments the major number by one everytime called and outputs', async () => {
      const template = '{% majorNum 1st Major Num %} {% majorNum %} {% majorNum 3rd Major Num %}'
      const output = await engine.parseAndRender(template)

      expect(output).toEqual('<h1 class="major-number-title">1 1st Major Num</h1> <h1 class="major-number-title">2</h1> <h1 class="major-number-title">3 3rd Major Num</h1>')
    })
  })

  describe('minorNum Tag', () => {
    test('it increments the minor number by one everytime called and outputs', async () => {
      const template = '{% minorNum %} {% minorNum %} {% minorNum %}'
      const output = await engine.parseAndRender(template)

      expect(output).toEqual('<h2 class="minor-number-title">0.1</h2> <h2 class="minor-number-title">0.2</h2> <h2 class="minor-number-title">0.3</h2>')
    })
  })

  describe('subMinorNum Tag', () => {
    test('it increments the sub minor number by one everytime called and outputs', async () => {
      const template = '{% subMinorNum %} {% subMinorNum %} {% subMinorNum %}'
      const output = await engine.parseAndRender(template)

      expect(output).toEqual('<h3 class="sub-minor-number-title">0.0.1</h3> <h3 class="sub-minor-number-title">0.0.2</h3> <h3 class="sub-minor-number-title">0.0.3</h3>')
    })
  })

  describe('numberToWords filter', () => {
    test('it returns the correctly formatted number in words', async () => {
      const template = '{{ 3684 | numberToWords: "en-GB" }}'
      const output = await engine.parseAndRender(template)

      expect(output).toEqual('Three thousand six hundred and eighty-four')
    })
  })

  describe('numberToMoneyWords filter', () => {
    test('it returns the correctly formatted number in money words', async () => {
      const template = '{{ 3684 | numberToMoneyWords: "en-GB" }}'
      const output = await engine.parseAndRender(template)

      expect(output).toEqual('Three thousand six hundred and eighty-four pounds')
    })
  })

  describe('Format Money filter', () => {
    test('it returns the correctly formatted money string', async () => {
      const template = '{{ 3684 | formatMoney: "en-GB" }}'
      const output = await engine.parseAndRender(template)

      expect(output).toEqual('£3,684.00')
    })
  })

  describe('Format Date filter', () => {
    test('it returns the correctly formatted date string', async () => {
      const template = '{{ contact.dateOfBirth | formatDate }}'
      const output = await engine.parseAndRender(template, testData)

      expect(output).toEqual('25th day of July, 2018')
    })
  })

  describe('Address filter', () => {
    test('it returns the correctly formatted first address', async () => {
      const template = '{{ contact.addresses | address }}'
      const output = await engine.parseAndRender(template, testData)

      expect(output).toEqual('214 Collins Lane, Farmington, Illinois, 67865-7840, Macao')
    })
  })

  describe('Telephone filter', () => {
    test('it returns the first telephone number', async () => {
      const template = '{{ contact.phoneNumbers | phoneNumber }}'
      const output = await engine.parseAndRender(template, testData)

      expect(output).toEqual('+236 62 46 6973')
    })
  })

  describe('Email filter', () => {
    test('it returns the first Email Address', async () => {
      const template = '{{ contact.emailAddresses | emailAddress }}'
      const output = await engine.parseAndRender(template, testData)

      expect(output).toEqual('carolinejankowski408@uol.info')
    })
  })

  describe('contactsToNameAndAddressString filter', () => {
    test('it returns a string of contact names and addresses', async () => {
      const template = '{{ contacts | contactsToNameAndAddressString }}'
      const output = await engine.parseAndRender(template, testData)

      expect(output).toEqual('Paul Smith of 2 Jim Lane, Jimmville, Jimtown, 67865-7840, Countrystan, James Frank Lees of 214 Collins Lane, Farmington, Illinois, 67865-7840, Macao and Paul Morpeth of 2 Big Street, Bigcity, Bigsville, Ert3452-453, Bigcountrystan')
    })
  })

  describe('Titlecase filter', () => {
    test('it returns the string with every word uppercase first letter', async () => {
      const template = '{{ "this is the string" | titlecase }}'
      const output = await engine.parseAndRender(template)

      expect(output).toEqual('This Is the String')
    })
  })
})
