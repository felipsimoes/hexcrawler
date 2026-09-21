import { useI18n } from '../i18n'
import type { MapPath } from '../types/map'

interface BreadcrumbProps {
  segments: Array<{ label: string; path: MapPath }>
  onNavigate: (path: MapPath) => void
}

export function Breadcrumb({ segments, onNavigate }: BreadcrumbProps) {
  const { t } = useI18n()

  if (segments.length <= 1) return null

  return (
    <nav className="breadcrumb no-print" aria-label={t('nested.breadcrumb')}>
      {segments.map((segment, index) => {
        const isLast = index === segments.length - 1
        return (
          <span key={segment.path.join('-') || 'root'} className="breadcrumb__item">
            {index > 0 && <span className="breadcrumb__sep" aria-hidden>›</span>}
            {isLast ? (
              <span className="breadcrumb__current">{segment.label}</span>
            ) : (
              <button type="button" className="breadcrumb__link" onClick={() => onNavigate(segment.path)}>
                {segment.label}
              </button>
            )}
          </span>
        )
      })}
    </nav>
  )
}
