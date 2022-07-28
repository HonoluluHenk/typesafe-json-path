import {Resolver} from './resolver';

describe('resolver', () => {
  const data = {
    FOO: {
      BAR: {
        HELLO: 'Hello World',
      },
    },
  };

  describe('toString', () => {
    it('returns the path as string', () => {
      const actual = new Resolver<unknown, typeof data>(['FOO', 'BAR', 'HELLO'])
        .toString();

      expect(actual)
        .toEqual('FOO.BAR.HELLO');
    });

    it('stringifys symbols', () => {
      const actual = new Resolver<unknown, any>(['FOO', Symbol('Banana'), 'HELLO'])
        .toString();

      expect(actual)
        .toEqual('FOO.Symbol(Banana).HELLO');
    });
  });

  describe('toArray', () => {
    it('returns the path as an array', () => {
      const actual = new Resolver<unknown, typeof data>(['FOO', 'BAR', 'HELLO'])
      .toArray();

      expect(actual)
        .toEqual(['FOO', 'BAR', 'HELLO']);
    });
  });

  describe('resolve', () => {
    it('returns the value at a full path', () => {
      const actual = new Resolver<unknown, typeof data>(['FOO', 'BAR', 'HELLO'])
        .resolve(data);

      expect(actual)
        .toEqual('Hello World');
    });

    it('returns the value at a partial path', () => {
      const actual = new Resolver<unknown, typeof data>(['FOO', 'BAR'])
        .resolve(data);

      expect(actual)
        .toEqual({
          HELLO: 'Hello World',
        });
    });
  });

});
