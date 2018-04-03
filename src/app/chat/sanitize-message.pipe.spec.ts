import { SanitizeMessagePipe } from './sanitize-message.pipe';

describe('SanitizeMessagePipe', () => {
  it('create an instance', () => {
    const pipe = new SanitizeMessagePipe();
    expect(pipe).toBeTruthy();
  });
});
