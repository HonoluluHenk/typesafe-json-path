import {Navigator} from './object-navigator';

const symbol = Symbol('Love Symbol');

describe('asdf', () => {
  const dataEN = {
    FOO: {
      BAR: {
        HELLO: "Hello World",
        BANANA: "Banana"
      }
    }
  }


  it('$key returns the computed key', () => {
    const nav = Navigator.init<typeof dataEN>();

    const actual = nav.FOO.BAR.BANANA.$key;

    expect(actual)
      .toEqual('FOO.BAR.BANANA')
  })

  it('$key supports partial paths', () => {
    const nav = Navigator.init<typeof dataEN>();

    const actual = nav.FOO.BAR.$key;

    expect(actual)
      .toEqual('FOO.BAR');
  })

  it('$key uses the pathSeparator', () => {
    const nav = Navigator.init<typeof dataEN>({pathSeparator: '=>'});

    const actual = nav.FOO.BAR.BANANA.$key;

    expect(actual)
      .toEqual('FOO=>BAR=>BANANA');
  })

  it('$applyKey calls the mapper with the computed key', () => {
    const nav = Navigator.init<typeof dataEN>();

    const actual = nav.FOO.BAR.BANANA.$applyKey(key => `Applied: ${key}`);

    expect(actual)
      .toEqual('Applied: FOO.BAR.BANANA')
  })

  it('$applyPath calls the mapper with the aggregated paths', () => {
    const nav = Navigator.init<typeof dataEN>();

    const actual = nav.FOO.BAR.BANANA.$applyPath(path => ['found: ', ...path]);

    expect(actual)
      .toEqual(['found: ', 'FOO', 'BAR', 'BANANA'])
  })

  it('$resolve returns the denoted value', () => {
    const nav = Navigator.init<typeof dataEN>();

    const actual = nav.FOO.BAR.HELLO.$resolve(dataEN);

    expect(actual)
      .toEqual('Hello World');
  })

  it('$resolve returns the denoted value for partial paths', () => {
    const nav = Navigator.init<typeof dataEN>();

    const actual = nav.FOO.BAR.$resolve(dataEN);

    expect(actual)
      .toEqual({HELLO: 'Hello World', BANANA: 'Banana'});
  })

  it('$resolve returns nullish for non-existing paths', () => {
    const dataDE = {
      FOO: {
        BAR: {
          HELLO: "Hallo Welt",
          BANANA: "Banana",
          SCHNAPSIDEE: "Schnapsidee"
        }
      }
    }

    const nav = Navigator.init<typeof dataEN & typeof dataDE>();

    const actual = nav.FOO.BAR.SCHNAPSIDEE.$resolve(dataEN);

    expect(actual)
      .toBeUndefined();
  })

  it ('supports iterator', () => {
    const data = {
      FOO: {
       BAR: {
         BAZ: "Hello"
       }
      }
    }
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
      .toEqual('FOO.BAR.BANANA')
  })

  it('conversion to string works (Symbol.toStringTag)', () => {
    const nav = Navigator.init<typeof dataEN>();

    const actual = Object.prototype.toString.call(nav.FOO.BAR.BANANA);

    expect(actual)
      .toEqual('[object PathEntry<FOO.BAR.BANANA>]')
  });

  it('compiles with intersection type', () => {
    const dataOther = {
      FOO: {
        BAR: {
          XYZZY: "Colossal Cave Adventure!"
        }
      }
    }
    const navDEEN = Navigator.init<typeof dataEN & typeof dataOther>();

    const bananaKey = navDEEN.FOO.BAR.BANANA.$key;
    const xyzzyKey = navDEEN.FOO.BAR.XYZZY.$key;

    expect(bananaKey)
      .toEqual('FOO.BAR.BANANA')
    expect(xyzzyKey)
      .toEqual('FOO.BAR.XYZZY')
  });

  describe('using symbols', function () {
    const symbolData = {
      THE_ARTIST: {
        [symbol]: {
          FORMERLY_KNOWN_AS: "Prince"
        }
      }
    }
    const nav = Navigator.init<typeof symbolData>();

    it('$key stringifys the symbol', () => {
      const actual = nav.THE_ARTIST[symbol].FORMERLY_KNOWN_AS.$key;

      expect(actual)
        .toEqual('THE_ARTIST.Symbol(Love Symbol).FORMERLY_KNOWN_AS');
    })

    it('applyPath includes the symbol', () => {
      const actual = nav.THE_ARTIST[symbol].FORMERLY_KNOWN_AS.$applyPath(path => path);

      expect(actual)
        .toEqual(['THE_ARTIST', symbol, 'FORMERLY_KNOWN_AS']);
    })


    it('$resolve returns the denoted value', () => {
      const actual = nav.THE_ARTIST[symbol].FORMERLY_KNOWN_AS.$resolve(symbolData);

      expect(actual)
        .toEqual('Prince');
    })

  });


});
