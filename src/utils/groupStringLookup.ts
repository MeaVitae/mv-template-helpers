const groupStringLookup = {
  guardians: 'the guardians of my children under the age of 18',
  substituteGuardians: 'the substitute guardians of my children under the age of 18',
  viewersOfMyAccount: 'the viewers of my account'
}

export default groupStringLookup

export type GroupStringType = keyof typeof groupStringLookup
