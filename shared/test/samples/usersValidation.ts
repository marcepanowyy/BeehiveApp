module.exports = {
    valid: [
      {
        username: 'test@user.com',
        password: 'tE$Tp4sSw0rd123',
      },
      {
        username: 't3st@user.com',
        password: 'th!sIsValidP4S5word',
      },
    ],
    invalid: {
      usernames: [
        {
          username: 'short',
          password: 'tE$Tp4sSw0rd123',
        },
        {
          username: 'thisIsNoEmail',
          password: 'tE$Tp4sSw0rd123',
        },
        {
          username: 'tooLongUsernameToBeValid!',
          password: 'tE$Tp4sSw0rd123',
        },
      ],

      passwords: [
        {
          username: 'test@user.com',
          password: 'short',
        },
        {
          username: 'test@user.com',
          password: 'tooLongPasswordToBeValid!',
        },
        {
          username: 'test@user.com',
          password: 'noSpecialCharacter123',
        },
        {
          username: 'test@user.com',
          password: 'no.uppercase.letter123',
        },
        {
          username: 'test@user.com',
          password: '1MoreDigitNeeded!',
        },
      ],
      both: [
        {
          username: 'thisIsNoEmail',
          password: 'noSpecialCharacter123',
        },
        {
          username: 'thisIsNoEmailThisIsNoEmail',
          password: 'no.uppercase.letter123',
        },
        {
          username: 'this',
          password: '1MoreDigitNeeded!',
        },
      ],
    },
};
