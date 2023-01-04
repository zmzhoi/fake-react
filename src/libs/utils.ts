export function camelCaseToDashCase(camelCase: string) {
  return camelCase.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

export function convertToInlineStyle(style: { [key: string]: string }) {
  return Object.entries(style).reduce((acc, [attr, val]) => {
    if (acc !== '') {
      acc += ' ';
    }

    acc += `${camelCaseToDashCase(attr)}: ${val};`;
    return acc;
  }, '');
}
