import { useRef, useCallback } from 'react';
import { toPng } from 'html-to-image';
import { useFunnelStore } from '../../store/funnelStore';
import { computePatientCounts, formatPatientCount } from '../../utils/calculations';
import type { FunnelConfig } from '../../types/funnel';

const CANVAS_W = 900;
const NODE_H = 52;
const NODE_GAP_X = 10;
const LAYER_GAP_Y = 60;
const SUB_H = 30;

interface LayoutNode {
  id: string;
  label: string;
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
}

interface LayoutEdge {
  id: string;
  x1: number; y1: number;
  x2: number; y2: number;
  bypass?: boolean;
}

function computeLayout(config: FunnelConfig, counts: Record<string, number>) {
  const nodes: LayoutNode[] = [];
  const edges: LayoutEdge[] = [];
  let currentY = 32;

  const pad = 24;

  // ── Pool node ──────────────────────────────────────────
  const poolLabel =
    config.poolModel === 'prevalence' ? 'Prevalence Pool' :
    config.poolModel === 'incidence' ? 'Diagnosed (Incidence) Pool' :
    'Prevalence + Incidence Pool';

  const poolNode: LayoutNode = {
    id: 'pool',
    label: poolLabel,
    sublabel: config.diseaseArea,
    x: pad,
    y: currentY,
    w: CANVAS_W - pad * 2,
    h: NODE_H,
    color: '#1E3A5F',
    textColor: '#FFFFFF',
    count: counts['pool'],
    layer: 'pool',
  };
  nodes.push(poolNode);
  currentY += NODE_H + LAYER_GAP_Y;

  const poolCenterX = pad + (CANVAS_W - pad * 2) / 2;
  const poolBottomY = poolNode.y + NODE_H;

  // ── Diagnosis segments ─────────────────────────────────
  if (config.diagnosis.included && config.diagnosis.segments.length > 0) {
    const segs = config.diagnosis.segments;
    const totalGap = (segs.length - 1) * NODE_GAP_X;
    const nodeW = (CANVAS_W - pad * 2 - totalGap) / segs.length;

    segs.forEach((seg, i) => {
      const x = pad + i * (nodeW + NODE_GAP_X);
      const node: LayoutNode = {
        id: `diag-${seg.id}`,
        label: seg.label,
        sublabel: seg.segmentDimension ?? 'Diagnosis',
        x, y: currentY,
        w: nodeW, h: NODE_H,
        color: '#E8F4FD',
        textColor: '#1E3A5F',
        count: counts[`diag-${seg.id}`],
        layer: 'segment',
      };
      nodes.push(node);
      edges.push({
        id: `e-pool-diag-${i}`,
        x1: poolCenterX, y1: poolBottomY,
        x2: x + nodeW / 2, y2: currentY,
      });

      // Sub-segments
      if (seg.subSegments.length > 0) {
        const subGap = 4;
        const subTotalGap = (seg.subSegments.length - 1) * subGap;
        const subW = (nodeW - subTotalGap) / seg.subSegments.length;
        seg.subSegments.forEach((sub, j) => {
          const subX = x + j * (subW + subGap);
          nodes.push({
            id: `sub-${sub.id}`,
            label: sub.label,
            x: subX, y: currentY + NODE_H + 4,
            w: subW, h: SUB_H,
            color: '#F0F7FF',
            textColor: '#4A6FA5',
            layer: 'sub',
          });
        });
      }
    });

    const hasSubSegs = segs.some(s => s.subSegments.length > 0);
    currentY += NODE_H + (hasSubSegs ? SUB_H + 4 : 0) + LAYER_GAP_Y;
  }

  // ── LOT ──────────────────────────────────────────────
  const diagNodes = nodes.filter(n => n.layer === 'segment');
  const diagBottomY = diagNodes.length > 0 ? diagNodes[0].y + NODE_H : poolNode.y + NODE_H;
  const diagCenterX = CANVAS_W / 2;

  const prevLayerBottomY = diagNodes.length > 0 ? diagNodes[0].y + NODE_H : poolNode.y + NODE_H;

  if (!config.lot.included) {
    // Bypass edge drawn later
  } else {
    const lines = config.lot.lines;
    const totalGap = (lines.length - 1) * NODE_GAP_X;
    const nodeW = (CANVAS_W - pad * 2 - totalGap) / lines.length;

    lines.forEach((line, i) => {
      const x = pad + i * (nodeW + NODE_GAP_X);
      const node: LayoutNode = {
        id: `lot-${line.id}`,
        label: line.label,
        sublabel: i > 0 ? `Attrition: ${((line.attritionRate ?? 0.5) * 100).toFixed(0)}%` : 'Entry line',
        x, y: currentY,
        w: nodeW, h: NODE_H,
        color: '#F0FDF4',
        textColor: '#166534',
        count: counts[`lot-${line.id}`],
        layer: 'lot',
      };
      nodes.push(node);
      edges.push({
        id: `e-diag-lot-${i}`,
        x1: diagCenterX, y1: prevLayerBottomY + (LAYER_GAP_Y / 2),
        x2: x + nodeW / 2, y2: currentY,
      });
    });

    currentY += NODE_H + LAYER_GAP_Y;
  }

  // ── Drug Class ────────────────────────────────────────
  const lotNodes = nodes.filter(n => n.layer === 'lot');
  const lotBottomY = lotNodes.length > 0 ? lotNodes[0].y + NODE_H : currentY - LAYER_GAP_Y;
  const lotCenterX = CANVAS_W / 2;

  if (!config.drugClass.included) {
    // Bypass
  } else {
    const classes = config.drugClass.classes;
    const totalGap = (classes.length - 1) * NODE_GAP_X;
    const nodeW = (CANVAS_W - pad * 2 - totalGap) / classes.length;

    classes.forEach((cls, i) => {
      const x = pad + i * (nodeW + NODE_GAP_X);
      const node: LayoutNode = {
        id: `class-${cls.id}`,
        label: cls.label,
        sublabel: cls.classShare ? `${(cls.classShare * 100).toFixed(0)}% class share` : 'Drug class',
        x, y: currentY,
        w: nodeW, h: NODE_H,
        color: '#FDF4FF',
        textColor: '#6B21A8',
        count: counts[`class-${cls.id}`],
        layer: 'class',
      };
      nodes.push(node);

      const sourceY = config.lot.included ? lotBottomY : (diagNodes.length > 0 ? diagNodes[0].y + NODE_H : poolNode.y + NODE_H);
      edges.push({
        id: `e-lot-class-${i}`,
        x1: lotCenterX, y1: sourceY,
        x2: x + nodeW / 2, y2: currentY,
        bypass: !config.lot.included,
      });
    });

    currentY += NODE_H + LAYER_GAP_Y;
  }

  // ── Products ──────────────────────────────────────────
  const classNodes = nodes.filter(n => n.layer === 'class');
  const classBottomY = classNodes.length > 0 ? classNodes[0].y + NODE_H : currentY - LAYER_GAP_Y;
  const classCenterX = CANVAS_W / 2;

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
      const node: LayoutNode = {
        id: `prod-${prod.id}`,
        label: prod.label,
        sublabel: isApproved ? 'Approved' : (prod.pipelineStage ?? 'Pipeline'),
        x, y: currentY,
        w: nodeW, h: NODE_H,
        color: isApproved ? '#F0FDF4' : '#FFFBEB',
        textColor: isApproved ? '#166534' : '#92400E',
        badge: isApproved ? undefined : prod.pipelineStage,
        badgeColor: prod.pipelineStage === 'Phase III' ? '#D97706' : prod.pipelineStage === 'Phase II' ? '#EA580C' : '#DC2626',
        count: counts[`prod-${prod.id}`],
        layer: 'product',
      };
      nodes.push(node);

      const sourceY = config.drugClass.included ? classBottomY :
                      config.lot.included ? lotBottomY :
                      (diagNodes.length > 0 ? diagNodes[0].y + NODE_H : poolNode.y + NODE_H);

      edges.push({
        id: `e-class-prod-${i}`,
        x1: classCenterX, y1: sourceY,
        x2: x + nodeW / 2, y2: currentY,
        bypass: !config.drugClass.included,
      });
    });

    currentY += NODE_H + 32;
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

function NodeRect({ node, step }: { node: LayoutNode; step: number }) {
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
      {/* Label */}
      <foreignObject x={node.x + 10} y={node.y} width={node.w - (showCount ? 70 : 20)} height={node.h}>
        <div
          style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              fontSize: node.layer === 'sub' ? '10px' : '12px',
              fontWeight: node.layer === 'pool' ? 600 : 500,
              color: node.textColor,
              lineHeight: 1.3,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {node.label}
          </div>
          {node.sublabel && node.layer !== 'sub' && (
            <div style={{ fontSize: '10px', color: node.textColor, opacity: 0.65, marginTop: 1 }}>
              {node.sublabel}
            </div>
          )}
        </div>
      </foreignObject>

      {/* Patient count badge */}
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

      {/* Pipeline badge */}
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
  const { activeConfig, activeStep } = useFunnelStore();
  const config = activeConfig();
  const counts = computePatientCounts(config);
  const step = activeStep;

  const { nodes, edges, totalH } = computeLayout(config, counts);

  const layerLabels: { label: string; y: number }[] = [];
  const poolNode = nodes.find(n => n.id === 'pool');
  if (poolNode) layerLabels.push({ label: 'Patient Pool', y: poolNode.y - 20 });
  const firstSeg = nodes.find(n => n.layer === 'segment');
  if (firstSeg) layerLabels.push({ label: 'Diagnosis', y: firstSeg.y - 20 });
  const firstLot = nodes.find(n => n.layer === 'lot');
  if (firstLot) layerLabels.push({ label: 'Line of Therapy', y: firstLot.y - 20 });
  const firstClass = nodes.find(n => n.layer === 'class');
  if (firstClass) layerLabels.push({ label: 'Drug Class', y: firstClass.y - 20 });
  const firstProd = nodes.find(n => n.layer === 'product');
  if (firstProd) layerLabels.push({ label: 'Products', y: firstProd.y - 20 });

  return (
    <div ref={diagramRef} className="w-full h-full overflow-auto bg-white p-6" style={{ minHeight: totalH + 80 }}>
      <svg
        width={CANVAS_W}
        height={totalH}
        viewBox={`0 0 ${CANVAS_W} ${totalH}`}
        style={{ overflow: 'visible', fontFamily: 'Inter, system-ui, sans-serif' }}
      >
        {/* Layer labels */}
        {layerLabels.map(ll => (
          <LayerLabel key={ll.label} label={ll.label} y={ll.y} />
        ))}

        {/* Edges */}
        {edges.map(e => (
          <CurvedEdge key={e.id} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} bypass={e.bypass} />
        ))}

        {/* Nodes */}
        {nodes.map(n => (
          <NodeRect key={n.id} node={n} step={step} />
        ))}
      </svg>
    </div>
  );
}
