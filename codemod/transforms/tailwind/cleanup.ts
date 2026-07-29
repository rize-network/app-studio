// @ts-nocheck

function referenceCount(root: any, j: any, name: string): number {
  return root.find(j.Identifier, { name }).size();
}

export function cleanupConsumed(root: any, j: any, bindings: Set<string>, helpers: Set<string>) {
  for (const name of bindings) {
    if (referenceCount(root, j, name) !== 1) continue;
    root.find(j.VariableDeclarator, { id: { type: 'Identifier', name } }).forEach((path: any) => {
      const declarationPath = path.parent;
      if (declarationPath.node.declarations.length > 1) j(path).remove();
      else j(declarationPath).remove();
    });
    root.find(j.FunctionDeclaration, { id: { type: 'Identifier', name } }).remove();
  }
  for (const name of helpers) {
    if (referenceCount(root, j, name) !== 1) continue;
    root.find(j.ImportDeclaration).forEach((path: any) => {
      const next = (path.node.specifiers || []).filter((specifier: any) => specifier.local?.name !== name);
      if (next.length === path.node.specifiers.length) return;
      if (next.length) path.node.specifiers = next;
      else j(path).remove();
    });
  }
}
