// Resolve um caminho de asset da pasta /public respeitando o `base` do Vite
// (necessário para deploy em subpasta, ex.: GitHub Pages).
// asset("brand/logo.jpg") -> "/<base>/brand/logo.jpg"
export function asset(path: string): string {
  return import.meta.env.BASE_URL + path.replace(/^\//, "");
}
