export function uniq(hoge: string[]): string[] {
  const size = hoge.length;
  const result: string[] = [];
  for (let i = 0; i < size - 1; i++) {
    for (let j = i + 1; j < size; j++) {
      if (hoge[i] === hoge[j]) {
        break;
      }
    }
    result.push(hoge[i]);
  }
  return result;
}
