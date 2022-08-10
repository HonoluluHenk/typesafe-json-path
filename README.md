
Example:
```typescript

const translationsRoot = {
  FOO: {
    BAR: {
      BAZ: 'Baz was here!',
      HELLO: 'Hello World',
    }
  }
};
const path = TypedObjectPath.init<typeof translationsRoot>();
const value = path.FOO.BAR.HELLO.$key.resolve(translationsRoot);
console.log(value);
// Hello World
```


Or use your custom Resolver:
```typescript
const translationsRoot = {
  FOO: {
    BAR: {
      BAZ: 'Baz was here!',
      HELLO: 'Hello %s',
    }
  }
};

class Translator<T extends object> extends Resolver<unknown, T> {
  constructor(
    path: ReadonlyArray<PathSegment>,
    private readonly translateService: TranslateService
    ) {
    super(path);
  }

  translate(...args: unknown): string {
    // delegate to some translation service:
    return this.translateService.translate(this.path, args);
  }
}

const translations = TypedObjectPath.init<typeof translationsRoot, Translator<any>>(
  path => new Translator(path, myTranslateService),
);

const text = translations.FOO.BAR.HELLO.$key.translate('world');
console.log(text);
// Hello world
```
