
export function generateTypos(text: string): string[] {
  const typos = new Set<string>();
  const chars = text.split('');

  // 1. Swap adjacent characters
  for (let i = 0; i < chars.length - 1; i++) {
    const swapped = [...chars];
    [swapped[i], swapped[i + 1]] = [swapped[i + 1], swapped[i]];
    typos.add(swapped.join(''));
  }

  // 2. Remove one character
  if (chars.length > 3) { // Only if length is reasonable
    for (let i = 0; i < chars.length; i++) {
      const removed = [...chars];
      removed.splice(i, 1);
      typos.add(removed.join(''));
    }
  }

  // 3. Replace with neighbors (simplified)
  // This could be complex, let's stick to a few common ones or skip for now to avoid massive explosion
  // Instead, let's just double characters
  for (let i = 0; i < chars.length; i++) {
    const doubled = [...chars];
    doubled.splice(i, 0, chars[i]);
    typos.add(doubled.join(''));
  }

  // Remove exact match if generated (unlikely with these rules but good practice)
  typos.delete(text);

  return Array.from(typos);
}
