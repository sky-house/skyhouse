export const chooseAnimalName = (excludeNames: string[]): string => {
  const candidate = dict.filter(name => !excludeNames.includes(name))
  const animalName = candidate[Math.floor(Math.random() * candidate.length)]
  return animalName
}

const dict = [
  'raccoon',
  'dog',
  'boar',
  'rabbit',
  'cow',
  'horse',
  'wolf',
  'hippopotamus',
  'kangaroo',
  'fox',
  'giraffe',
  'bear',
  'koala',
  'bat',
  'gorilla',
  'rhinoceros',
  'monkey',
  'zebra',
  'jaguar',
  'bear',
  'skunk',
  'elephant',
  'rat',
  'tiger',
  'cat',
  'mouse',
  'buffalo',
  'hamster',
  'panda',
  'sheep',
  'pig',
  'mole',
  'goat',
  'lion',
  'camel',
  'donkey',
]