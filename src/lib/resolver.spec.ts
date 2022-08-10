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
        .get(data);

      expect(actual)
        .toEqual('Hello World');
    });

    it('returns the value at a partial path', () => {
      const actual = new Resolver<unknown, typeof data>(['FOO', 'BAR'])
        .get(data);

      expect(actual)
        .toEqual({
          HELLO: 'Hello World',
        });
    });
  });

  describe('isPresent', () => {

    it('returns true if data is present at the denoted path', () => {
      const actual = new Resolver<unknown, typeof data>(['FOO', 'BAR', 'HELLO'])
        .isPresent(data);

      expect(actual)
        .toBe(true);
    });

    it('returns false if data is missing at the denoted path', () => {
      const actual = new Resolver<unknown, typeof data>(['FOO', 'BAR', 'missing'])
        .isPresent(data);

      expect(actual)
        .toBe(false);
    });

    describe('nullAllowed', () => {
      const partialData = {
        FOO: {
          BAR: {
            HELLO: 'Hello World',
            NULL: null,
          },
        },
      };

      it('returns true if nullAllowed and data is null', () => {
        const actual = new Resolver<unknown, typeof partialData>(['FOO', 'BAR', 'NULL'])
          .isPresent(partialData, true);

        expect(actual)
          .toBe(true);
      });

      it('returns false if not nullAllowed and data is null', () => {
        const actual = new Resolver<unknown, typeof partialData>(['FOO', 'BAR', 'NULL'])
          .isPresent(partialData, false);

        expect(actual)
          .toBe(false);
      });
    });
  });

});
