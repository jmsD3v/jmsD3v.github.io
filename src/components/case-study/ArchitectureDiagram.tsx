// Diagrama de la arquitectura propuesta en el caso de estudio de la nube.
// SVG estático (server component). En pantallas angostas el contenedor
// scrollea en horizontal: el SVG tiene un ancho mínimo para que el texto se lea.
import type { ArchitectureBoxProps, ArchitectureDiagramProps } from '@/types/case-study'

const C = {
  lila: '#c084fc',
  cyan: '#22d3ee',
  surface: '#161616',
  line: '#2a2a2a',
  text: '#e2e8f0',
  onAccent: '#0a0a0a',
} as const

const BOX_W = 160
const BOX_H = 140

function Box({ x, title, lines, filled = false, strong = false }: ArchitectureBoxProps) {
  const cx = x + BOX_W / 2
  return (
    <g textAnchor='middle' fontSize='13'>
      <rect
        x={x}
        y={40}
        width={BOX_W}
        height={BOX_H}
        rx={10}
        fill={filled ? C.lila : C.surface}
        stroke={filled ? 'none' : strong ? C.lila : C.line}
        strokeWidth={strong ? 2 : 1}
      />
      <text
        x={cx}
        y={66}
        fontWeight={800}
        fontSize={11}
        letterSpacing={1.5}
        fill={filled ? C.onAccent : C.cyan}
      >
        {title}
      </text>
      {lines.map((l, i) => (
        <text
          key={l}
          x={cx}
          y={100 + i * 24}
          fill={filled ? C.onAccent : C.text}
          fontWeight={filled ? 700 : 400}
        >
          {l}
        </text>
      ))}
    </g>
  )
}

export function ArchitectureDiagram({ caption }: ArchitectureDiagramProps) {
  return (
    <figure className='m-0 rounded-lg border border-white/10 bg-surface p-4'>
      <div className='overflow-x-auto'>
        <svg
          viewBox='0 0 900 360'
          role='img'
          aria-label='Arquitectura: fuentes, ingesta, data lake en S3, procesamiento y KPIs, con la capa de aplicaciones y una capa de seguridad transversal'
          className='block h-auto w-full min-w-[720px] font-mono'
        >
          <defs>
            <marker
              id='arq-flecha'
              viewBox='0 0 10 10'
              refX='9'
              refY='5'
              markerWidth='7'
              markerHeight='7'
              orient='auto'
            >
              <path d='M0 0L10 5L0 10z' fill={C.lila} />
            </marker>
          </defs>

          <g stroke={C.lila} strokeWidth='2' fill='none'>
            {[170, 370, 570].map((x) => (
              <line key={x} x1={x} y1='110' x2={x + 40} y2='110' markerEnd='url(#arq-flecha)' />
            ))}
            <line x1='770' y1='110' x2='800' y2='110' markerEnd='url(#arq-flecha)' />
          </g>

          <Box x={10} title='FUENTES' lines={['3 × SQL Server', 'Microservicios', 'Planillas', 'Datos maestros']} />
          <Box x={210} title='INGESTA' lines={['AWS DMS (CDC)', 'Amazon Kinesis', 'DataSync']} filled />
          <Box x={410} title='DATA LAKE · S3' lines={['Raw', 'Curated', 'Analytics']} strong />
          <Box x={610} title='PROCESAMIENTO' lines={['AWS Glue', 'Redshift', 'Athena']} />

          <g textAnchor='middle'>
            <rect x='800' y='70' width='90' height='80' rx='10' fill={C.cyan} />
            <text x='845' y='106' fill={C.onAccent} fontWeight={700} fontSize='13'>
              KPIs
            </text>
            <text x='845' y='126' fill={C.onAccent} fontSize='11'>
              únicos
            </text>
          </g>

          <rect x='10' y='210' width='880' height='56' rx='10' fill={C.surface} stroke={C.line} />
          <text x='30' y='243' fontSize='13' fill={C.text} fontWeight={600}>
            Apps: ALB + WAF → EC2 Auto Scaling / ECS Fargate → RDS SQL Server Multi-AZ · VPC 3 capas × 2 zonas
          </text>

          <rect x='10' y='282' width='880' height='56' rx='10' fill={C.lila} fillOpacity={0.14} stroke={C.lila} />
          <text x='450' y='315' textAnchor='middle' fontSize='13' fill={C.lila} fontWeight={700}>
            IAM + MFA · KMS · Lake Formation · CloudTrail · GuardDuty · Config · Security Hub · Macie
          </text>
        </svg>
      </div>
      <figcaption className='mt-2 text-xs text-text-muted'>{caption}</figcaption>
    </figure>
  )
}
