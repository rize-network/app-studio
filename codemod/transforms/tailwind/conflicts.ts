// @ts-nocheck

export type PlannedDecl = { prop: string; value: any; cssProps: string[]; token: string; condition?: any; order: number };

export function resolveLastWins(input: PlannedDecl[]): PlannedDecl[] {
  const result: PlannedDecl[] = [];
  for (const declaration of input) {
    for (let index = result.length - 1; index >= 0; index--) {
      const previous = result[index];
      const remaining = previous.cssProps.filter((prop) => !declaration.cssProps.includes(prop));
      if (remaining.length === previous.cssProps.length) continue;
      result.splice(index, 1);
      // A later side utility only overrides that physical side of a shorthand.
      // Expand the untouched sides so `px-4 pl-2` keeps paddingRight=16.
      if (remaining.length) {
        result.splice(index, 0, ...remaining.map((prop) => ({ ...previous, prop, cssProps: [prop] })));
      }
    }
    result.push(declaration);
  }
  return result;
}

export function compactSpacing(input: PlannedDecl[]): PlannedDecl[] {
  const result = [...input];
  const compact = (prefix: 'padding' | 'margin') => {
    const props = [`${prefix}Top`,`${prefix}Right`,`${prefix}Bottom`,`${prefix}Left`];
    const found = props.map((prop) => result.find((item) => item.prop === prop && !item.condition));
    if (found.every(Boolean) && found.every((item) => item.value === found[0].value)) {
      for (const item of found) result.splice(result.indexOf(item), 1);
      result.push({ ...found[0], prop: prefix, cssProps: props });
      return;
    }
    const horizontal = [found[1], found[3]];
    if (horizontal.every(Boolean) && horizontal[0].value === horizontal[1].value) {
      horizontal.forEach((item) => result.splice(result.indexOf(item), 1));
      result.push({ ...horizontal[0], prop: `${prefix}Horizontal`, cssProps: [props[1], props[3]] });
    }
    const vertical = [found[0], found[2]];
    if (vertical.every(Boolean) && vertical[0].value === vertical[1].value) {
      vertical.forEach((item) => result.splice(result.indexOf(item), 1));
      result.push({ ...vertical[0], prop: `${prefix}Vertical`, cssProps: [props[0], props[2]] });
    }
  };
  compact('padding'); compact('margin');
  return result.sort((a, b) => a.order - b.order);
}
