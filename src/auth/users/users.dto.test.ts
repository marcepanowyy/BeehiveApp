import {
  createTestingContainer,
  ITestingContainer,
} from '../../../shared/test/utils';
import { UsersDto } from './users.dto';
import { validate } from 'class-validator';
import { strict as assert } from 'node:assert';

describe("UsersDTO (Users' Data Transfer Object)", () => {

  let testingContainer: ITestingContainer;
  let testCredentials;

  before(async () => {
    testingContainer = await createTestingContainer();

    testCredentials = {
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
            password: 'no.uppercase.letter!111',
          },
          {
            username: 'this',
            password: '1MoreDigitNeeded!',
          },
        ],
      },
    };

  });

  it('should validate valid credentials', async () => {
    for (const user of testCredentials.valid) {
      const usersDto = new UsersDto();
      usersDto.username = user.username;
      usersDto.password = user.password;

      const errors = await validate(usersDto);
      assert.strictEqual(errors.length, 0);
    }
  });

  it('should validate invalid usernames', async () => {
    for (const user of testCredentials.invalid.usernames) {
      const usersDto = new UsersDto();
      usersDto.username = user.username;
      usersDto.password = user.password;

      const errors = await validate(usersDto);
      assert.strictEqual(errors.length > 0, true);
    }
  });

  it('should validate invalid passwords', async () => {
    for (const user of testCredentials.invalid.passwords) {
      const usersDto = new UsersDto();
      usersDto.username = user.username;
      usersDto.password = user.password;

      const errors = await validate(usersDto);
      assert.strictEqual(errors.length > 0, true);
    }
  });

  it('should validate invalid credentials', async () => {
    for (const user of testCredentials.invalid.both) {
      const usersDto = new UsersDto();
      usersDto.username = user.username;
      usersDto.password = user.password;

      const errors = await validate(usersDto);
      assert.strictEqual(errors.length > 0, true);
    }
  });
});
