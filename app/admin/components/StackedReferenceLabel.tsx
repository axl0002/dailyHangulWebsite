"use client";

type Props = {
    viewBox?: { x: number; y: number };
    labels: string[];
};

export default function StackedReferenceLabel({ viewBox, labels }: Props) {
    if (!viewBox || labels.length === 0) return null;

    return (
        <text
            x={viewBox.x}
            y={viewBox.y - 8}
            textAnchor="middle"
            fill="#D97706"
            fontSize={10}
            fontWeight={600}
        >
            {labels.map((label, i) => (
                <tspan key={i} x={viewBox.x} dy={i === 0 ? 0 : 13}>
                    {label}
                </tspan>
            ))}
        </text>
    );
}
