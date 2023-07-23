const validDescription = 'This is a valid description of the category. It has min. 30 characters and max. 200 characters'

module.exports = {
  valid: [
    {
      name: 'Valid Category Name',
      description: validDescription
    },
    {
      name: 'VCN',
      description: validDescription
    },
  ],
  invalid: {
    names: [
      {
        name: '',
        description: validDescription,
      },
      {
        name: 'A',
        description: validDescription,
      },
      {
        name: 'ThisIsAVeryLongCategoryNameThatExceedsTheMaximumLengthAllowed',
        description: validDescription,
      },
    ],
    descriptions: [
      {
        name: 'Invalid description',
        description: '',
      },
      {
        name: 'Invalid description',
        description: 'D',
      },
      {
        name: 'Invalid description',
        description: validDescription.repeat(10),
      },
    ],
    both: [
      {
        name: '',
        description: '',
      },
      {
        name: 'D',
        description: validDescription.repeat(10),
      },
    ],
  },
};

