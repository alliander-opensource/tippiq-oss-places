import { nameOptions } from './debugnyan-poly';

describe('debugnyan-poly', () => {
  describe('nameOptions', () => {
    test('"a" has a name: a', () => {
      expect(nameOptions('a')).toHaveProperty('name', 'a');
    });
    test('"a:b" has a component: b', () => {
      expect(nameOptions('a:b')).toHaveProperty('component', 'b');
    });
    test('"a:b:c" has a subcomponent: c', () => {
      expect(nameOptions('a:b:c')).toHaveProperty('subcomponent', 'c');
    });
    test('"a:b:c:d" has a subsubcomponent: d', () => {
      expect(nameOptions('a:b:c:d')).toHaveProperty('subsubcomponent', 'd');
    });
  });
});
