import {TypesafeJsonPath} from './typesafe-json-path';
import {Resolver} from './resolver';

const symbol = Symbol('Love Symbol');

describe('TypesafeJsonPath', () => {
  const dataEN = {
    FOO: {
      BAR: {
        HELLO: 'Hello World',
        BANANA: 'Banana',
      },
    },
  };

  it('$key.toString() returns the computed key', () => {
    const nav = TypesafeJsonPath.init<typeof dataEN>();

    const actual = nav.FOO.BAR.BANANA.$key.toString();

    expect(actual)
      .toEqual('FOO.BAR.BANANA');
  });

  it('$key.toString() supports partial paths', () => {
    const nav = TypesafeJsonPath.init<typeof dataEN>();

    const actual = nav.FOO.BAR.$key.toString();

    expect(actual)
      .toEqual('FOO.BAR');
  });

  it('$key.resolve() returns the denoted value', () => {
    const nav = TypesafeJsonPath.init<typeof dataEN>();

    const actual = nav.FOO.BAR.HELLO.$key.resolve(dataEN);

    expect(actual)
      .toEqual('Hello World');
  });

  it('$key.resolve() returns the denoted value for partial paths', () => {
    const nav = TypesafeJsonPath.init<typeof dataEN>();

    const actual = nav.FOO.BAR.$key.resolve(dataEN);

    expect(actual)
      .toEqual({HELLO: 'Hello World', BANANA: 'Banana'});
  });

  it('$key.resolve() returns undefined for non-existing paths', () => {
    const dataDE = {
      FOO: {
        BAR: {
          HELLO: 'Hallo Welt',
          BANANA: 'Banana',
          SCHNAPSIDEE: 'Schnapsidee',
        },
      },
    };

    const nav = TypesafeJsonPath.init<typeof dataEN & typeof dataDE>();

    const actual = nav.FOO.BAR.SCHNAPSIDEE.$key.resolve(dataEN);

    expect(actual)
      .toBeUndefined();
  });

  it('supports iterator', () => {
    const data = {
      FOO: {
        BAR: {
          BAZ: 'Hello',
        },
      },
    };
    const nav = TypesafeJsonPath.init<typeof data>();

    let expecteds = ['FOO', 'BAR', 'BAZ'];
    for (const value of nav.FOO.BAR.BAZ) {
      const [expected, ...remainder] = expecteds;
      expect(value)
        .toEqual(expected);
      expecteds = remainder;
    }

    expect(expecteds)
      .toStrictEqual([]);
  });

  it('converts to string using (Symbol.toPrimitive)', () => {
    const nav = TypesafeJsonPath.init<typeof dataEN>();

    const actual = String(nav.FOO.BAR.BANANA);

    expect(actual)
      .toEqual('FOO.BAR.BANANA');
  });

  it('converts to string using (Symbol.toStringTag)', () => {
    const nav = TypesafeJsonPath.init<typeof dataEN>();

    const actual = Object.prototype.toString.call(nav.FOO.BAR.BANANA);

    expect(actual)
      .toEqual('[object PathSegment<FOO.BAR.BANANA>]');
  });

  it('compiles with intersection type', () => {
    const dataOther = {
      FOO: {
        BAR: {
          XYZZY: 'Colossal Cave Adventure!',
        },
      },
    };
    const navDEEN = TypesafeJsonPath.init<typeof dataEN & typeof dataOther>();

    const bananaKey = navDEEN.FOO.BAR.BANANA.$key.toString();
    const xyzzyKey = navDEEN.FOO.BAR.XYZZY.$key.toString();

    expect(bananaKey)
      .toEqual('FOO.BAR.BANANA');
    expect(xyzzyKey)
      .toEqual('FOO.BAR.XYZZY');
  });

  describe('using symbols', function () {
    const symbolData = {
      THE_ARTIST: {
        [symbol]: {
          FORMERLY_KNOWN_AS: 'Prince',
        },
      },
    };
    const nav = TypesafeJsonPath.init<typeof symbolData>();

    it('$key.toString() stringifys the symbol', () => {
      const actual = nav.THE_ARTIST[symbol].FORMERLY_KNOWN_AS.$key.toString();

      expect(actual)
        .toEqual('THE_ARTIST.Symbol(Love Symbol).FORMERLY_KNOWN_AS');
    });

    it('$key.resolve() returns the symbol in its place', () => {
      const actual = nav.THE_ARTIST[symbol].FORMERLY_KNOWN_AS.$key.resolve(symbolData);

      expect(actual)
        .toEqual('Prince');
    });

  });

  describe('with arrays', () => {
    const data = {
      FOO: [{BAR: 'Bar'}, {HELLO: 'World'}],
    };
    const nav = TypesafeJsonPath.init<typeof data>();

    it('$key.toString() works', () => {
      const actual = nav.FOO[0].BAR?.$key.toString();

      expect(actual)
        .toEqual('FOO.0.BAR');
    });

    it('$key.resolve() returns existing value', () => {
      const actual = nav.FOO[0].BAR?.$key.resolve(data);

      expect(actual)
        .toEqual('Bar');
    });

    it('$key.resolve() returns undefined for missing value', () => {
      const actual = nav.FOO[1].BAR?.$key.resolve(data);

      expect(actual)
        .toBeUndefined();
    });

    it('$key.toArray works', () => {
      const actual = nav.FOO[0].BAR?.$key.toArray();

      expect(actual)
        .toEqual(['FOO', '0', 'BAR']);
    });
  });

  describe('using a custom resolver', () => {
    class MyResolver<T extends object> extends Resolver<unknown, T> {
      doStuff(): string {
        return `DoStuff: ${this.path}`;
      }
    }

    it('compiles without error and executes the custom method', () => {
      const nav = TypesafeJsonPath.init<typeof dataEN, MyResolver<any>>(path => new MyResolver(path));

      const actual = nav.FOO.BAR.BANANA.$key.doStuff();

      expect(actual)
        .toEqual('DoStuff: FOO.BAR.BANANA');
    });
  });
});
