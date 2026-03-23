"use client";

import { type DateLabel } from './useDateLabels';

type Props = {
    x?: number;
    y?: number;
    payload?: { value: string };
    dateLabels: Record<string, DateLabel[]>;
    onDateClick: (date: string, x: number, y: number) => void;
    totalDays?: number;
};

export default function ClickableXAxisTick({ x = 0, y = 0, payload, dateLabels, onDateClick, totalDays = 14 }: Props) {
    if (!payload) return null;

    const date = payload.value;
    const [, month, day] = date.split('-');
    const formatted = `${parseInt(month)}/${parseInt(day)}`;
    const hasLabel = dateLabels[date]?.length > 0;
    const needsRotation = totalDays > 30;
    const fontSize = totalDays > 60 ? 9 : totalDays > 30 ? 10 : 11;

    return (
        <g
            transform={`translate(${x},${y})`}
            onClick={(e) => {
                e.stopPropagation();
                onDateClick(date, e.clientX, e.clientY);
            }}
            style={{ cursor: 'pointer' }}
        >
            <text
                x={0}
                y={0}
                dy={16}
                textAnchor={needsRotation ? 'end' : 'middle'}
                fill={hasLabel ? '#D97706' : '#6B7280'}
                fontSize={fontSize}
                fontWeight={hasLabel ? 600 : 400}
                transform={needsRotation ? 'rotate(-45)' : undefined}
            >
                {formatted}
            </text>
            {hasLabel && (
                <circle cx={0} cy={4} r={2.5} fill="#F59E0B" />
            )}
        </g>
    );
}
