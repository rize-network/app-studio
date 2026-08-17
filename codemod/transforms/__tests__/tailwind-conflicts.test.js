const { compactSpacing, resolveLastWins } = require('../tailwind/conflicts');

describe('Tailwind conflicts', () => {
  it('preserves the untouched side when a later utility overrides a shorthand', () => {
    const declarations = resolveLastWins([
      { prop: 'paddingHorizontal', value: 16, cssProps: ['paddingLeft', 'paddingRight'], order: 0 },
      { prop: 'paddingLeft', value: 8, cssProps: ['paddingLeft'], order: 1 },
    ]);

    expect(declarations.map(({ prop, value }) => [prop, value])).toEqual([
      ['paddingRight', 16],
      ['paddingLeft', 8],
    ]);
  });

  it('recompacts four equal physical sides', () => {
    const declarations = ['Top', 'Right', 'Bottom', 'Left'].map((side, order) => ({
      prop: `padding${side}`,
      value: 12,
      cssProps: [`padding${side}`],
      order,
    }));

    expect(compactSpacing(declarations)[0].prop).toBe('padding');
  });
});
