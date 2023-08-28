import {
  addImportStatement,
  transformStyledComponentsToView,
  transformStyleToProps,
  transformHTMLToView,
  COMPONENT_MAPPING,
  APP_MAPPING,
} from './utils';

export default function transform(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  // eslint-disable-next-line prefer-const
  let imports = {};

  transformHTMLToView(root, j, imports);
  transformStyledComponentsToView(root, j, imports);
  transformStyleToProps(root, j, imports);

  for (const c in imports) {
    if (APP_MAPPING[c] !== undefined) {
      addImportStatement(root, j, c, 'app-studio');
    } else if (COMPONENT_MAPPING[c] !== undefined) {
      addImportStatement(root, j, c, '@app-studio/components');
    }
  }

  return root.toSource();
}
