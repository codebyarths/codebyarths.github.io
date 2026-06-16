import { useId, useRef } from "react";
import { CalendarDays } from "lucide-react";
import type { ReactNode } from "react";

type DateFieldProps = {
  /** Texto do label (ex.: "Retirada"). */
  label: string;
  /** Valor em ISO yyyy-mm-dd (igual a input[type=date].value). "" = vazio. */
  value: string;
  /** Recebe sempre ISO yyyy-mm-dd (ou "" quando limpo). */
  onChange: (iso: string) => void;
  /** Ícone do label (default: CalendarDays). */
  icon?: ReactNode;
  /** Texto exibido quando vazio (default: "dd/mm/aaaa"). */
  placeholder?: string;
  /** Limites opcionais em ISO yyyy-mm-dd. */
  min?: string;
  max?: string;
  /** name/id opcional (autofill + associação label). */
  name?: string;
};

/**
 * ISO "yyyy-mm-dd" -> "dd/mm/aaaa" SEM new Date().
 * new Date("2026-06-16") é interpretado como meia-noite UTC; em UTC-4 (Manaus)
 * toLocaleDateString devolveria o dia ANTERIOR. Parse por regex elimina o fuso.
 */
function isoToBR(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return "";
  const [, y, mo, d] = m;
  return `${d}/${mo}/${y}`;
}

/**
 * Campo de data à prova de iOS: o que o usuário vê é um display 100% nosso
 * (herda a classe .input), e por cima fica um <input type="date"> NATIVO
 * invisível (opacity-0, inset-0) dentro de um wrapper relative overflow-hidden.
 * Assim o input nativo nunca define a largura nem vaza — mas o picker do iPhone
 * continua abrindo ao tocar em qualquer ponto do campo.
 */
export default function DateField({
  label,
  value,
  onChange,
  icon = <CalendarDays className="h-4 w-4" />,
  placeholder = "dd/mm/aaaa",
  min,
  max,
  name,
}: DateFieldProps) {
  const reactId = useId();
  const inputId = name ?? `date-${reactId}`;
  const inputRef = useRef<HTMLInputElement>(null);

  const display = isoToBR(value);
  const hasValue = display !== "";

  /**
   * Tenta abrir o picker via showPicker() (Chrome/Edge/Android/Safari recente).
   * Em iOS sem showPicker, o toque já caiu no input nativo (opacity-0, inset-0)
   * e o date picker do iPhone abre sozinho. Fallback grátis.
   */
  const openPicker = () => {
    const el = inputRef.current;
    if (!el) return;
    try {
      (el as HTMLInputElement & { showPicker?: () => void }).showPicker?.();
    } catch {
      /* fallback: toque direto no input nativo abre o picker */
    }
  };

  return (
    <div className="block min-w-0">
      {/* Label associado ao input nativo por htmlFor (acessibilidade). */}
      <label
        htmlFor={inputId}
        className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-charcoal/55"
      >
        <span className="text-brand">{icon}</span>
        {label}
      </label>

      {/* Wrapper = "jaula" visual: relative + overflow-hidden + min-w-0 + max-w-full. */}
      <div className="datefield relative min-w-0 max-w-full overflow-hidden">
        {/* Display 100% nosso. pointer-events-none → todo toque cai no input nativo. */}
        <div
          className="input pointer-events-none flex h-[44px] items-center gap-2 py-0"
          aria-hidden="true"
        >
          <span
            className={
              "min-w-0 flex-1 truncate " +
              (hasValue ? "text-charcoal" : "text-charcoal/40")
            }
          >
            {hasValue ? display : placeholder}
          </span>
          <CalendarDays className="h-5 w-5 shrink-0 text-brand" />
        </div>

        {/* Input nativo real: esticado por cima, invisível, mas focável/tappável. */}
        <input
          ref={inputRef}
          id={inputId}
          name={inputId}
          type="date"
          value={value}
          min={min}
          max={max}
          aria-label={label}
          onChange={(e) => onChange(e.target.value)}
          onClick={openPicker}
          className="datefield-input absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
      </div>
    </div>
  );
}
