export default function generateUUID(): string {
  const uuid: Array<string> = [];
  const hexDigits = '0123456789abcdef';

  for (let i = 0; i < 36; i += 1) {
    uuid[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }

  uuid[14] = '4';

  // `((s[19] & 0x3) | 0x8)` 等价于 `((s[19] % 3) + 8)`
  // eslint-disable-next-line no-bitwise
  uuid[19] = hexDigits.substr((parseInt(uuid[19], 10) & 0x3) | 0x8, 1);

  // eslint-disable-next-line no-multi-assign
  uuid[8] = uuid[13] = uuid[18] = uuid[23] = '';

  return uuid.join('');
}
