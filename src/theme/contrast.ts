const channels = (hex: string) => hex.replace('#', '').match(/../g)!.map(c => parseInt(c, 16))
const luminance = (hex: string) => channels(hex).map(n => {
  const s = n / 255
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
}).reduce((sum, n, i) => sum + n * [0.2126, 0.7152, 0.0722][i], 0)
export const contrastRatio = (a: string, b: string) => {
  const l = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (l[0] + 0.05) / (l[1] + 0.05)
}
export function readableColor(color: string, background: string, minimum = 4.7): string {
  let rgb = channels(color)
  const toward = luminance(background) > 0.4 ? 0 : 255
  const hex = () => '#' + rgb.map(n => Math.round(n).toString(16).padStart(2, '0')).join('')
  for (let i = 0; i < 100 && contrastRatio(hex(), background) < minimum; i++) {
    rgb = rgb.map(n => n + (toward - n) * 0.06)
  }
  return hex()
}
