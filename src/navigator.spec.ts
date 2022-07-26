import {Navigator} from './navigator';

const symbol = Symbol('Love Symbol');

describe('Navigator', () => {
  const dataEN = {
    FOO: {
      BAR: {
        HELLO: 'Hello World',
        BANANA: 'Banana',
      },
    },
  };

  it('$key returns the computed key', () => {
    const nav = Navigator.init<typeof dataEN>();

    const actual = nav.FOO.BAR.BANANA.$resolve.key;

    expect(actual)
      .toEqual('FOO.BAR.BANANA');
  });

  it('$key supports partial paths', () => {
    const nav = Navigator.init<typeof dataEN>();

    const actual = nav.FOO.BAR.$resolve.key;

    expect(actual)
      .toEqual('FOO.BAR');
  });

  it('$resolve.value returns the denoted value', () => {
    const nav = Navigator.init<typeof dataEN>();

    const actual = nav.FOO.BAR.HELLO.$resolve.value(dataEN);

    expect(actual)
      .toEqual('Hello World');
  });

  it('$resolve.value returns the denoted value for partial paths', () => {
    const nav = Navigator.init<typeof dataEN>();

    const actual = nav.FOO.BAR.$resolve.value(dataEN);

    expect(actual)
      .toEqual({HELLO: 'Hello World', BANANA: 'Banana'});
  });

  it('$resolve returns nullish for non-existing paths', () => {
    const dataDE = {
      FOO: {
        BAR: {
          HELLO: 'Hallo Welt',
          BANANA: 'Banana',
          SCHNAPSIDEE: 'Schnapsidee',
        },
      },
    };

    const nav = Navigator.init<typeof dataEN & typeof dataDE>();

    const actual = nav.FOO.BAR.SCHNAPSIDEE.$resolve.value(dataEN);

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
    const nav = Navigator.init<typeof data>();

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

  it('conversion to string works (Symbol.toPrimitive)', () => {
    const nav = Navigator.init<typeof dataEN>();

    const actual = String(nav.FOO.BAR.BANANA);

    expect(actual)
      .toEqual('FOO.BAR.BANANA');
  });

  it('conversion to string works (Symbol.toStringTag)', () => {
    const nav = Navigator.init<typeof dataEN>();

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
    const navDEEN = Navigator.init<typeof dataEN & typeof dataOther>();

    const bananaKey = navDEEN.FOO.BAR.BANANA.$resolve.key;
    const xyzzyKey = navDEEN.FOO.BAR.XYZZY.$resolve.key;

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
    const nav = Navigator.init<typeof symbolData>();

    it('$key stringifys the symbol', () => {
      const actual = nav.THE_ARTIST[symbol].FORMERLY_KNOWN_AS.$resolve.key;

      expect(actual)
        .toEqual('THE_ARTIST.Symbol(Love Symbol).FORMERLY_KNOWN_AS');
    });

    it('$resolve.value returns the denoted value', () => {
      const actual = nav.THE_ARTIST[symbol].FORMERLY_KNOWN_AS.$resolve.value(symbolData);

      expect(actual)
        .toEqual('Prince');
    });

  });

});
