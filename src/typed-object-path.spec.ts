import {TypedObjectPath} from './typed-object-path';

const symbol = Symbol('Love Symbol');

describe('TypedObjectPath', () => {
  const dataEN = {
    FOO: {
      BAR: {
        HELLO: 'Hello World',
        BANANA: 'Banana',
      },
    },
  };

  it('$path.toString() returns the computed key', () => {
    const nav = TypedObjectPath.init<typeof dataEN>();

    const actual = nav.FOO.BAR.BANANA.$path.toString();

    expect(actual)
      .toEqual('FOO.BAR.BANANA');
  });

  it('$path.toString() supports partial paths', () => {
    const nav = TypedObjectPath.init<typeof dataEN>();

    const actual = nav.FOO.BAR.$path.toString();

    expect(actual)
      .toEqual('FOO.BAR');
  });

  it('$path.resolve() returns the denoted value', () => {
    const nav = TypedObjectPath.init<typeof dataEN>();

    const actual = nav.FOO.BAR.HELLO.$path.resolve(dataEN);

    expect(actual)
      .toEqual('Hello World');
  });

  it('$path.resolve() returns the denoted value for partial paths', () => {
    const nav = TypedObjectPath.init<typeof dataEN>();

    const actual = nav.FOO.BAR.$path.resolve(dataEN);

    expect(actual)
      .toEqual({HELLO: 'Hello World', BANANA: 'Banana'});
  });

  it('$path.resolve() returns undefined for non-existing paths', () => {
    const dataDE = {
      FOO: {
        BAR: {
          HELLO: 'Hallo Welt',
          BANANA: 'Banana',
          SCHNAPSIDEE: 'Schnapsidee',
        },
      },
    };

    const nav = TypedObjectPath.init<typeof dataEN & typeof dataDE>();

    const actual = nav.FOO.BAR.SCHNAPSIDEE.$path.resolve(dataEN);

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
    const nav = TypedObjectPath.init<typeof data>();

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
    const nav = TypedObjectPath.init<typeof dataEN>();

    const actual = String(nav.FOO.BAR.BANANA);

    expect(actual)
      .toEqual('FOO.BAR.BANANA');
  });

  it('converts to string using (Symbol.toStringTag)', () => {
    const nav = TypedObjectPath.init<typeof dataEN>();

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
    const navDEEN = TypedObjectPath.init<typeof dataEN & typeof dataOther>();

    const bananaKey = navDEEN.FOO.BAR.BANANA.$path.toString();
    const xyzzyKey = navDEEN.FOO.BAR.XYZZY.$path.toString();

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
    const nav = TypedObjectPath.init<typeof symbolData>();

    it('$path.toString() stringifys the symbol', () => {
      const actual = nav.THE_ARTIST[symbol].FORMERLY_KNOWN_AS.$path.toString();

      expect(actual)
        .toEqual('THE_ARTIST.Symbol(Love Symbol).FORMERLY_KNOWN_AS');
    });

    it('$path.resolve() returns the symbol in its place', () => {
      const actual = nav.THE_ARTIST[symbol].FORMERLY_KNOWN_AS.$path.resolve(symbolData);

      expect(actual)
        .toEqual('Prince');
    });

  });

  describe('with arrays', () => {
    const data = {
      FOO: [{BAR: 'Bar'}, {HELLO: 'World'}],
    };
    const nav = TypedObjectPath.init<typeof data>();

    it('$path.toString() works', () => {
      const actual = nav.FOO[0].BAR?.$path.toString();

      expect(actual)
        .toEqual('FOO.0.BAR');
    });

    it('$path.resolve() returns existing value', () => {
      const actual = nav.FOO[0].BAR?.$path.resolve(data);

      expect(actual)
        .toEqual('Bar');
    });

    it('$path.resolve() returns undefined for missing value', () => {
      const actual = nav.FOO[1].BAR?.$path.resolve(data);

      expect(actual)
        .toBeUndefined();
    });

    it('$path.toArray works', () => {
      const actual = nav.FOO[0].BAR?.$path.toArray();

      expect(actual)
        .toEqual(['FOO', '0', 'BAR']);
    });
  });
});
