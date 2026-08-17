const { parseClass, splitModifiers, tokenize } = require('../tailwind/parser');

describe('Tailwind parser', () => {
  it('splits variants outside brackets only', () => {
    expect(splitModifiers('md:data-[state=open]:bg-[url(https://x:y/z.png)]')).toEqual([
      'md',
      'data-[state=open]',
      'bg-[url(https://x:y/z.png)]',
    ]);
  });

  it('parses negative arbitrary values and fractions', () => {
    expect(parseClass('-mt-[2.5rem]').decls[0].value).toBe('-2.5rem');
    expect(parseClass('w-1/2').decls[0].value).toBe('50%');
  });

  it('tokenizes arbitrary values containing whitespace', () => {
    expect(tokenize('flex grid-cols-[200px_minmax(0,1fr)] gap-4')).toEqual([
      'flex',
      'grid-cols-[200px_minmax(0,1fr)]',
      'gap-4',
    ]);
  });
});
