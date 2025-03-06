export class AlreadyExistsError extends Error {
  constructor(message = 'Already exists') {
    super(message);
    this.name = 'AlreadyExistsError';
  }
}
