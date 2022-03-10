export function uniq(hoge: string[]): string[] {
  let size = hoge.length;
  for (let i = 0; i < size - 1; i++) {
    for (let j = i + 1; j < size; j++) {
      if (hoge[i] === hoge[j]) {
        hoge.splice(j);
        size--;
      }
    }
  }
  return hoge;
}
