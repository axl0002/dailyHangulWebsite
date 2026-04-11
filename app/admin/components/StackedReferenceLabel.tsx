"use client";

// Greedy row-assignment so neighboring event labels don't overlap:
// iterate in date order and place each label in the lowest row whose
// last-placed date is >= collisionDays away.
export function assignLabelRows<T extends { date: string }>(
    entries: T[],
    days: number,
): Array<T & { row: number }> {
    const collisionDays = Math.max(2, Math.ceil(days / 7));
    const rowLastDate: string[] = [];
    return entries.map(entry => {
        const entryTime = new Date(entry.date).getTime();
        let row = 0;
        while (row < rowLastDate.length) {
            const prevTime = new Date(rowLastDate[row]).getTime();
            const diffDays = (entryTime - prevTime) / (1000 * 60 * 60 * 24);
            if (diffDays >= collisionDays) break;
            row++;
        }
        rowLastDate[row] = entry.date;
        return { ...entry, row };
    });
}

export function topMarginForLabelRows(maxRow: number): number {
    return 20 + maxRow * 14;
}

type Props = {
    viewBox?: { x: number; y: number };
    labels: string[];
    // Row index used to stagger neighboring labels vertically so long strings
    // on nearby dates don't overlap. 0 = closest to the chart; higher = further up.
    rowOffset?: number;
};

const ROW_HEIGHT = 14;

export default function StackedReferenceLabel({ viewBox, labels, rowOffset = 0 }: Props) {
    if (!viewBox || labels.length === 0) return null;

    const y = viewBox.y - 8 - rowOffset * ROW_HEIGHT;

    return (
        <text
            x={viewBox.x}
            y={y}
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
