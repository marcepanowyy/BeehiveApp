import { UsersService } from './users.service';
import { strict as assert } from 'node:assert';

import {
  clearDataBaseData,
  createTestingContainer,
  ITestingContainer,
} from '../../../shared/test/utils';
import { HttpException, HttpStatus } from '@nestjs/common';
import { sampleUserData } from '../../../shared/test/samples';
import { createUser } from '../../../shared/test/helpers';

describe('UsersService', () => {
  let testingContainer: ITestingContainer;
  const userData = sampleUserData.userData1;

  before(async () => {
    testingContainer = await createTestingContainer();
  });

  beforeEach(async () => {
    await clearDataBaseData(testingContainer);
  });

  it('should register in with valid credentials', async () => {
    const result = await testingContainer.services.usersService.register({
      ...userData,
    });

    const user = await testingContainer.repositories.usersRepository.findOne({
      where: { username: userData.username },
    });

    assert.strictEqual(
      result.message,
      'Account created successfully. Activate your account to log in.',
    );
  });

  it('should throw an error when registering when the username is already taken and the account activated', async () => {
    const user = await createUser(testingContainer, userData);
    await testingContainer.repositories.usersRepository.update(user.id, {
      activatedAccount: true,
    });

    await assert.rejects(
      async () => {
        await testingContainer.services.usersService.register({ ...userData });
      },
      (err: any) => {
        assert.strictEqual(err instanceof HttpException, true);
        assert.strictEqual(err.response, 'User already exists');
        assert.strictEqual(err.status, HttpStatus.BAD_REQUEST);
        return true;
      },
    );
  });

  it('should log in user with valid credentials & activated account', async () => {
    const user = await createUser(testingContainer, userData);
    await testingContainer.repositories.usersRepository.update(user.id, {
      activatedAccount: true,
    });

    const result = await testingContainer.services.usersService.login({
      ...userData,
    });

    assert.strictEqual(result.username, userData.username);
  });

  it('should throw an error when logging in user with valid credentials & not activated account', async () => {
    await createUser(testingContainer, userData);

    await assert.rejects(
      async () => {
        await testingContainer.services.usersService.login(userData);
      },
      (err: any) => {
        assert.strictEqual(err instanceof HttpException, true);
        assert.strictEqual(err.response, 'Account is not activated');
        assert.strictEqual(err.status, HttpStatus.UNAUTHORIZED);
        return true;
      },
    );
  });

  it('should throw an error when logging in with invalid credentials', async () => {
    await createUser(testingContainer, userData);

    // invalid password
    await assert.rejects(
      async () => {
        await testingContainer.services.usersService.login({
          username: 'test1@user.com',
          password: 'tttE$Tp4sSw0rd123',
        });
      },
      (err: any) => {
        assert.strictEqual(err instanceof HttpException, true);
        assert.strictEqual(err.response, 'Invalid username or password');
        assert.strictEqual(err.status, HttpStatus.UNAUTHORIZED);
        return true;
      },
    );

    // invalid username
    await assert.rejects(
      async () => {
        await testingContainer.services.usersService.login({
          username: 'tttest1@user.com',
          password: 'tE$Tp4sSw0rd123',
        });
      },
      (err: any) => {
        assert.strictEqual(err instanceof HttpException, true);
        assert.strictEqual(err.response, 'Invalid username or password');
        assert.strictEqual(err.status, HttpStatus.UNAUTHORIZED);
        return true;
      },
    );
  });
});
