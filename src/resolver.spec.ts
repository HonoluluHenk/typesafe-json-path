import {Resolver} from './resolver';

describe('resolver', () => {
  const data = {
    FOO: {
      BAR: {
        HELLO: 'Hello World',
      },
    },
  };

  describe('key', () => {
    it('returns the path as string', () => {
      const actual = new Resolver<typeof data, string>(['FOO', 'BAR', 'HELLO'])
        .key;

      expect(actual)
        .toEqual('FOO.BAR.HELLO');
    });
  });

  describe('value', () => {
    it('returns the value at a full path', () => {
      const actual = new Resolver<typeof data, unknown>(['FOO', 'BAR', 'HELLO'])
        .value(data);

      expect(actual)
        .toEqual('Hello World');
    });
    it('returns the value at a partial path', () => {
      const actual = new Resolver<typeof data, unknown>(['FOO', 'BAR'])
        .value(data);

      expect(actual)
        .toEqual({
          HELLO: 'Hello World',
        });
    });
  });
});
