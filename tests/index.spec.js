import mvTemplate from '../src'
import testData from './json/data.json'
import { test, describe, expect } from 'vitest'

describe('MV Liquidjs filters and Tags', () => {
  describe('majorNum Tag', () => {
    test('it increments the major number by one everytime called and outputs', async () => {
      const template = '{% majorNum 1st Major Num %} {% if false %}{% majorNum %} {% endif %}{% majorNum 3rd Major Num %}'
      const output = await mvTemplate(template)

      expect(output).toEqual('1. 1st Major Num 2. 3rd Major Num')
    })
  })

  describe('minorNum Tag', () => {
    test('it increments the minor number by one everytime called and outputs', async () => {
      const template = '{% minorNum %} {% minorNum %} {% minorNum %}'
      const output = await mvTemplate(template)

      expect(output).toEqual('0.1. 0.2. 0.3.')
    })
  })

  describe('subMinorNum Tag', () => {
    test('it increments the sub minor number by one everytime called and outputs', async () => {
      const template = '{% subMinorNum %} {% subMinorNum %} {% subMinorNum %}'
      const output = await mvTemplate(template)

      expect(output).toEqual('0.0.1. 0.0.2. 0.0.3.')
    })
  })

  describe('numberToWords filter', () => {
    test('it returns the correctly formatted number in words', async () => {
      const template = '{{ 3684.23 | numberToWords: "en-GB" }}'
      const output = await mvTemplate(template)

      expect(output).toEqual('Three thousand six hundred eighty four point twenty three')
    })
  })

  describe('numberToMoneyWords filter', () => {
    test('it returns the correctly formatted number in money words', async () => {
      const template = '{{ 211385.96 | numberToMoneyWords: "en-GB" }}'
      const output = await mvTemplate(template)

      expect(output).toEqual('Two hundred eleven thousand three hundred eighty five pounds point ninety six pence')
    })
  })

  describe('Format Money filter', () => {
    test('it returns the correctly formatted money string', async () => {
      const template = '{{ 3684 | formatMoney: "en-GB" }}'
      const output = await mvTemplate(template)

      expect(output).toEqual('£3,684.00')
    })
  })

  describe('Format Date filter', () => {
    test('it returns the correctly formatted date string', async () => {
      const template = '{{ contact.dateOfBirth | formatDate }}'
      const output = await mvTemplate(template, testData)

      expect(output).toEqual('25th day of July, 2018')
    })
  })

  describe('Address filter', () => {
    test('it returns the correctly formatted first address', async () => {
      const template = '{{ contact.addresses | address }}'
      const output = await mvTemplate(template, testData)

      expect(output).toEqual('214 Collins Lane, Farmington, Illinois, 67865-7840, Macao')
    })
  })

  describe('Telephone filter', () => {
    test('it returns the first telephone number', async () => {
      const template = '{{ contact.phoneNumbers | phoneNumber }}'
      const output = await mvTemplate(template, testData)

      expect(output).toEqual('+236 62 46 6973')
    })
  })

  describe('Email filter', () => {
    test('it returns the first Email Address', async () => {
      const template = '{{ contact.emailAddresses | emailAddress }}'
      const output = await mvTemplate(template, testData)

      expect(output).toEqual('carolinejankowski408@uol.info')
    })
  })

  describe('contactsToNameAndAddressString filter', () => {
    test('it returns a string of contact names and addresses', async () => {
      const template = '{{ contacts | contactsToNameAndAddressString }}'
      const output = await mvTemplate(template, testData)

      expect(output).toEqual('Paul Smith of 2 Jim Lane, Jimmville, Jimtown, 67865-7840, Countrystan, James Frank Lees of 214 Collins Lane, Farmington, Illinois, 67865-7840, Macao and Paul Morpeth of 2 Big Street, Bigcity, Bigsville, Ert3452-453, Bigcountrystan')
    })
  })

  describe('Titlecase filter', () => {
    test('it returns the string with every word uppercase first letter', async () => {
      const template = '{{ "this is the string" | titlecase }}'
      const output = await mvTemplate(template)

      expect(output).toEqual('This Is the String')
    })
  })

  describe('majorNum Tag', () => {
    test('it increments the major number by one everytime called and outputs', async () => {
      const template = '{% toc %}{% majorNum 1st Major Num %} {% if false %}{% majorNum %} {% endif %}{% majorNum 3rd Major Num %}'
      const output = await mvTemplate(template)

      expect(output).toEqual('<nav id="toc">Table of Contents<ol><li>1st Major Num</li><li>3rd Major Num</li></ol></nav>1. 1st Major Num 2. 3rd Major Num')
    })
  })
})
