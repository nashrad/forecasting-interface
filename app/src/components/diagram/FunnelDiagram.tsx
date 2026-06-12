import { useFunnelStore } from '../../store/funnelStore';
import { computePatientCounts, formatPatientCount } from '../../utils/calculations';
import type { FunnelConfig } from '../../types/funnel';

const CANVAS_W = 900;
const NODE_H = 52;
const COMPACT_NODE_H = 36;
const NODE_GAP_X = 10;
const LAYER_GAP_Y = 60;
const SUB_H = 30;
const SUB_GAP_Y = 4;
const GHOST_H = 40;

type GhostLayerKey = 'diagnosis' | 'lot' | 'drugClass';

interface LayoutNode {
  id: string;
  label: string;
  compactLabel: string;
  sublabel?: string;
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  textColor: string;
  badge?: string;
  badgeColor?: string;
  count?: number;
  layer: string;
  bypass?: boolean;
  subCount?: number;
  ghost?: boolean;
  ghostLayer?: GhostLayerKey;
}

interface LayoutEdge {
  id: string;
  x1: number; y1: number;
  x2: number; y2: number;
  bypass?: boolean;
}

const pad = 24;
const centerX = CANVAS_W / 2;

function ghostNode(layer: GhostLayerKey, label: string, y: number): LayoutNode {
  return {
    id: `ghost-${layer}`,
    label: `${label} — skipped`,
    compactLabel: `${label} — skipped`,
    x: pad,
    y,
    w: CANVAS_W - pad * 2,
    h: GHOST_H,
    color: 'transparent',
    textColor: '#94A3B8',
    layer: 'ghost',
    ghost: true,
    ghostLayer: layer,
    bypass: true,
  };
}

function computeLayout(config: FunnelConfig, counts: Record<string, number>, step: number) {
  const nodes: LayoutNode[] = [];
  const edges: LayoutEdge[] = [];
  let currentY = 32;
  const nodeH = step === 1 ? COMPACT_NODE_H : NODE_H;

  // Tracks the bottom Y of the previous rendered layer — every layer's incoming
  // edges fan from the horizontal centre at this Y.
  let prevBottomY: number;

  // ── Pool node (always present) ─────────────────────────
  const poolLabel =
    config.poolModel === 'prevalence' ? 'Prevalence Pool' :
    config.poolModel === 'incidence' ? 'Diagnosed (Incidence) Pool' :
    'Prevalence + Incidence Pool';

  const poolNode: LayoutNode = {
    id: 'pool',
    label: poolLabel,
    compactLabel: 'P',
    sublabel: config.diseaseArea,
    x: pad,
    y: currentY,
    w: CANVAS_W - pad * 2,
    h: nodeH,
    color: '#1E3A5F',
    textColor: '#FFFFFF',
    count: counts['pool'],
    layer: 'pool',
  };
  nodes.push(poolNode);
  prevBottomY = currentY + nodeH;
  currentY += nodeH + LAYER_GAP_Y;

  const fanEdge = (id: string, targetX: number, targetY: number, bypass?: boolean) => {
    edges.push({ id, x1: centerX, y1: prevBottomY, x2: targetX, y2: targetY, bypass });
  };

  // ── Diagnosis segments ─────────────────────────────────
  if (config.diagnosis.included && config.diagnosis.segments.length > 0) {
    const segs = config.diagnosis.segments;
    const totalGap = (segs.length - 1) * NODE_GAP_X;
    const nodeW = (CANVAS_W - pad * 2 - totalGap) / segs.length;
    const maxSubCount = segs.reduce((max, s) => Math.max(max, s.subSegments.length), 0);

    segs.forEach((seg, i) => {
      const x = pad + i * (nodeW + NODE_GAP_X);
      nodes.push({
        id: `diag-${seg.id}`,
        label: seg.label,
        compactLabel: `S${i + 1}`,
        sublabel: seg.segmentDimension ?? 'Diagnosis',
        x, y: currentY,
        w: nodeW, h: nodeH,
        color: '#E8F4FD',
        textColor: '#1E3A5F',
        count: counts[`diag-${seg.id}`],
        layer: 'segment',
        subCount: seg.subSegments.length,
      });
      fanEdge(`e-pool-diag-${i}`, x + nodeW / 2, currentY);

      seg.subSegments.forEach((sub, j) => {
        const subY = currentY + nodeH + SUB_GAP_Y + j * (SUB_H + SUB_GAP_Y);
        nodes.push({
          id: `sub-${sub.id}`,
          label: sub.label,
          compactLabel: `SS${i + 1}.${j + 1}`,
          x, y: subY,
          w: nodeW, h: SUB_H,
          color: '#F0F7FF',
          textColor: '#4A6FA5',
          layer: 'sub',
        });
      });
    });

    prevBottomY = currentY + nodeH + (maxSubCount > 0 ? maxSubCount * (SUB_H + SUB_GAP_Y) : 0);
    currentY = prevBottomY + LAYER_GAP_Y;
  } else {
    const g = ghostNode('diagnosis', 'Diagnosis', currentY);
    nodes.push(g);
    fanEdge('e-pool-ghost-diag', centerX, currentY, true);
    prevBottomY = currentY + GHOST_H;
    currentY = prevBottomY + LAYER_GAP_Y;
  }

  // ── LOT ────────────────────────────────────────────────
  if (config.lot.included) {
    const lines = config.lot.lines;
    const totalGap = (lines.length - 1) * NODE_GAP_X;
    const nodeW = (CANVAS_W - pad * 2 - totalGap) / lines.length;

    lines.forEach((line, i) => {
      const x = pad + i * (nodeW + NODE_GAP_X);
      nodes.push({
        id: `lot-${line.id}`,
        label: line.label,
        compactLabel: `L${i + 1}`,
        sublabel: i > 0 ? `Attrition: ${((line.attritionRate ?? 0.5) * 100).toFixed(0)}%` : 'Entry line',
        x, y: currentY,
        w: nodeW, h: nodeH,
        color: '#F0FDF4',
        textColor: '#166534',
        count: counts[`lot-${line.id}`],
        layer: 'lot',
      });
      fanEdge(`e-diag-lot-${i}`, x + nodeW / 2, currentY);
    });

    prevBottomY = currentY + nodeH;
    currentY += nodeH + LAYER_GAP_Y;
  } else {
    const g = ghostNode('lot', 'Line of Therapy', currentY);
    nodes.push(g);
    fanEdge('e-ghost-lot', centerX, currentY, true);
    prevBottomY = currentY + GHOST_H;
    currentY = prevBottomY + LAYER_GAP_Y;
  }

  // ── Drug Class ─────────────────────────────────────────
  if (config.drugClass.included) {
    const classes = config.drugClass.classes;
    const totalGap = (classes.length - 1) * NODE_GAP_X;
    const nodeW = (CANVAS_W - pad * 2 - totalGap) / classes.length;

    classes.forEach((cls, i) => {
      const x = pad + i * (nodeW + NODE_GAP_X);
      nodes.push({
        id: `class-${cls.id}`,
        label: cls.label,
        compactLabel: `DC${i + 1}`,
        sublabel: cls.classShare ? `${(cls.classShare * 100).toFixed(0)}% class share` : 'Drug class',
        x, y: currentY,
        w: nodeW, h: nodeH,
        color: '#FDF4FF',
        textColor: '#6B21A8',
        count: counts[`class-${cls.id}`],
        layer: 'class',
      });
      fanEdge(`e-lot-class-${i}`, x + nodeW / 2, currentY);
    });

    prevBottomY = currentY + nodeH;
    currentY += nodeH + LAYER_GAP_Y;
  } else {
    const g = ghostNode('drugClass', 'Drug Class', currentY);
    nodes.push(g);
    fanEdge('e-ghost-class', centerX, currentY, true);
    prevBottomY = currentY + GHOST_H;
    currentY = prevBottomY + LAYER_GAP_Y;
  }

  // ── Products (always present if any) ───────────────────
  const allProducts = [
    ...config.products.approved,
    ...config.products.pipeline,
  ];

  if (allProducts.length > 0) {
    const totalGap = (allProducts.length - 1) * NODE_GAP_X;
    const nodeW = Math.min(160, (CANVAS_W - pad * 2 - totalGap) / allProducts.length);
    const totalW = allProducts.length * nodeW + (allProducts.length - 1) * NODE_GAP_X;
    const startX = (CANVAS_W - totalW) / 2;

    allProducts.forEach((prod, i) => {
      const x = startX + i * (nodeW + NODE_GAP_X);
      const isApproved = prod.type === 'approved';
      nodes.push({
        id: `prod-${prod.id}`,
        label: prod.label,
        compactLabel: `Pr${i + 1}`,
        sublabel: isApproved ? 'Approved' : (prod.pipelineStage ?? 'Pipeline'),
        x, y: currentY,
        w: nodeW, h: nodeH,
        color: isApproved ? '#F0FDF4' : '#FFFBEB',
        textColor: isApproved ? '#166534' : '#92400E',
        badge: isApproved ? undefined : prod.pipelineStage,
        badgeColor: prod.pipelineStage === 'Phase III' ? '#D97706' : prod.pipelineStage === 'Phase II' ? '#EA580C' : '#DC2626',
        count: counts[`prod-${prod.id}`],
        layer: 'product',
      });
      fanEdge(`e-class-prod-${i}`, x + nodeW / 2, currentY);
    });

    currentY += nodeH + 32;
  }

  return { nodes, edges, totalH: currentY };
}

function CurvedEdge({ x1, y1, x2, y2, bypass }: { x1: number; y1: number; x2: number; y2: number; bypass?: boolean }) {
  const midY = (y1 + y2) / 2;
  const d = `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`;
  return (
    <path
      d={d}
      fill="none"
      stroke={bypass ? '#F59E0B' : '#94A3B8'}
      strokeWidth={bypass ? 2 : 1.5}
      strokeDasharray={bypass ? '6 4' : undefined}
      opacity={0.7}
    />
  );
}

function GhostRow({ node, onReAdd }: { node: LayoutNode; onReAdd: (layer: GhostLayerKey) => void }) {
  return (
    <g>
      <rect
        x={node.x} y={node.y}
        width={node.w} height={node.h}
        rx={8}
        fill="#F8FAFC"
        stroke="#CBD5E1"
        strokeWidth={1.5}
        strokeDasharray="6 4"
      />
      <foreignObject x={node.x} y={node.y} width={node.w} height={node.h}>
        <div style={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
        }}>
          <span style={{ fontSize: 12, fontWeight: 500, color: '#94A3B8', fontStyle: 'italic' }}>
            {node.label}
          </span>
          <button
            onClick={() => node.ghostLayer && onReAdd(node.ghostLayer)}
            title={`Add ${node.label.replace(' — skipped', '')} layer`}
            style={{
              width: 22, height: 22,
              borderRadius: 6,
              border: '1px solid #CBD5E1',
              background: '#FFFFFF',
              color: '#475569',
              fontSize: 15,
              lineHeight: 1,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            +
          </button>
        </div>
      </foreignObject>
    </g>
  );
}

function NodeRect({ node, step }: { node: LayoutNode; step: number }) {
  const isCompact = step === 1;
  const showCount = step === 3 && node.count !== undefined && node.count > 0;

  return (
    <g>
      <rect
        x={node.x} y={node.y}
        width={node.w} height={node.h}
        rx={8}
        fill={node.color}
        stroke={node.layer === 'pool' ? 'none' : '#E2E8F0'}
        strokeWidth={1}
      />

      {isCompact ? (
        <text
          x={node.x + node.w / 2}
          y={node.y + node.h / 2 + 4}
          textAnchor="middle"
          fontSize={node.layer === 'sub' ? 9 : 11}
          fontWeight={600}
          fill={node.textColor}
          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
        >
          {node.compactLabel}
        </text>
      ) : (
        <>
          <foreignObject x={node.x + 10} y={node.y} width={node.w - (showCount ? 70 : 20)} height={node.h}>
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{
                fontSize: node.layer === 'sub' ? '10px' : '12px',
                fontWeight: node.layer === 'pool' ? 600 : 500,
                color: node.textColor,
                lineHeight: 1.3,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {node.label}
              </div>
              {node.sublabel && node.layer !== 'sub' && (
                <div style={{ fontSize: '10px', color: node.textColor, opacity: 0.65, marginTop: 1 }}>
                  {node.sublabel}
                </div>
              )}
            </div>
          </foreignObject>

          {showCount && (
            <foreignObject x={node.x + node.w - 64} y={node.y} width={60} height={node.h}>
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 10 }}>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: node.textColor,
                  opacity: 0.8,
                  fontVariantNumeric: 'tabular-nums',
                }}>
                  {formatPatientCount(node.count!)}
                </span>
              </div>
            </foreignObject>
          )}

          {node.badge && (
            <g>
              <rect
                x={node.x + node.w - 70} y={node.y + 6}
                width={64} height={16}
                rx={4}
                fill={node.badgeColor ?? '#D97706'}
                opacity={0.15}
              />
              <text
                x={node.x + node.w - 38} y={node.y + 17}
                textAnchor="middle"
                fontSize={9}
                fontWeight={600}
                fill={node.badgeColor ?? '#D97706'}
              >
                {node.badge}
              </text>
            </g>
          )}
        </>
      )}
    </g>
  );
}

function LayerLabel({ label, y }: { label: string; y: number }) {
  return (
    <text x={16} y={y + 18} fontSize={10} fontWeight={600} fill="#94A3B8" textAnchor="start" letterSpacing={0.5}>
      {label.toUpperCase()}
    </text>
  );
}

export function FunnelDiagram({ diagramRef }: { diagramRef: React.RefObject<HTMLDivElement> }) {
  const { activeConfig, activeStep, setDiagnosisIncluded, setLotIncluded, setDrugClassIncluded } = useFunnelStore();
  const config = activeConfig();
  const counts = computePatientCounts(config);
  const step = activeStep;

  const { nodes, edges, totalH } = computeLayout(config, counts, step);

  const reAddLayer = (layer: GhostLayerKey) => {
    if (layer === 'diagnosis') setDiagnosisIncluded(true);
    else if (layer === 'lot') setLotIncluded(true);
    else if (layer === 'drugClass') setDrugClassIncluded(true);
  };

  const layerLabels: { label: string; y: number }[] = [];
  const poolNode = nodes.find(n => n.id === 'pool');
  if (poolNode) layerLabels.push({ label: 'Patient Pool', y: poolNode.y - 20 });
  const firstSeg = nodes.find(n => n.layer === 'segment') ?? nodes.find(n => n.ghostLayer === 'diagnosis');
  if (firstSeg) layerLabels.push({ label: 'Diagnosis', y: firstSeg.y - 20 });
  const firstLot = nodes.find(n => n.layer === 'lot') ?? nodes.find(n => n.ghostLayer === 'lot');
  if (firstLot) layerLabels.push({ label: 'Line of Therapy', y: firstLot.y - 20 });
  const firstClass = nodes.find(n => n.layer === 'class') ?? nodes.find(n => n.ghostLayer === 'drugClass');
  if (firstClass) layerLabels.push({ label: 'Drug Class', y: firstClass.y - 20 });
  const firstProd = nodes.find(n => n.layer === 'product');
  if (firstProd) layerLabels.push({ label: 'Products', y: firstProd.y - 20 });

  return (
    <div
      ref={diagramRef}
      className="bg-white"
      style={{
        minHeight: totalH + 80,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '24px',
      }}
    >
      <svg
        width={CANVAS_W}
        height={totalH}
        viewBox={`0 0 ${CANVAS_W} ${totalH}`}
        style={{ overflow: 'visible', fontFamily: 'Inter, system-ui, sans-serif' }}
      >
        {layerLabels.map(ll => (
          <LayerLabel key={ll.label} label={ll.label} y={ll.y} />
        ))}
        {edges.map(e => (
          <CurvedEdge key={e.id} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} bypass={e.bypass} />
        ))}
        {nodes.map(n =>
          n.ghost
            ? <GhostRow key={n.id} node={n} onReAdd={reAddLayer} />
            : <NodeRect key={n.id} node={n} step={step} />
        )}
      </svg>
    </div>
  );
}
