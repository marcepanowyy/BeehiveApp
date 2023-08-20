export class WelcomeMessage {
  pattern: string;
  data: {
    recipient: string;
  };
}

export class ActivationMessage {
  pattern: string;
  data: {
    recipient: string;
    activationCode: string;
  };
}

export class PasswordResetMessage {
  pattern: string;
  data: {
    recipient: string;
    resetCode: string;
  };
}
