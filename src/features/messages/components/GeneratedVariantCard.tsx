// Карточка одного сгенерированного варианта с общей оценкой, текст с разворотом, список метрик, кнопка копирования.

import { useEffect, useRef, useState } from 'react';
import { CheckIcon, CircleCheck, CircleX, CopyIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { GeneratedText } from '@/features/chat/types/chat.types';
import {
  categorizeMetrics,
  getActiveMetrics,
  getMetricCount,
  LENGTH_KEY,
  OVERALL_SCORE_KEY,
  scoreColor,
  type DashboardMetrics,
} from './MessageGenerated/metricsUtils';
import type { VariantQualityLabel } from './MessageGenerated/metricsUtils';

export type DerivedMetrics = DashboardMetrics;

const METRIC_LABELS: Record<keyof DerivedMetrics, string> = {
  ifeval: 'Следование требованиям',
  distinct: 'Лексическое разнообразие',
  toneMatch: 'Соответствие тональности',
  audienceMatch: 'Соответствие целевой аудитории',
  sumac: 'Фактическая достоверность',
  mauve: 'Похожесть на референсы',
};

interface GeneratedVariantCardProps {
  item: GeneratedText;
  index: number;
  label: VariantQualityLabel;
  isBest: boolean;
  derivedMetrics?: DerivedMetrics;
  showAnalytics?: boolean;
}

function BoolBadge({ value }: { value: boolean }) {
  return value ? (
    <CircleCheck className="size-4 text-green-500" />
  ) : (
    <CircleX className="size-4 text-red-500" />
  );
}

const labelConfig: Record<
  VariantQualityLabel,
  { text: string; className: string }
> = {
  Слабый: {
    text: 'Слабый',
    className: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
  },
  Средний: {
    text: 'Средний',
    className:
      'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  },
  'Лучший вариант': {
    text: 'Лучший вариант',
    className:
      'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400',
  },
};

function CircularProgress({
  value,
  size = 44,
}: {
  value: number;
  size?: number;
}) {
  const strokeWidth = 4;
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const target = circ * (1 - value);
  const color = scoreColor(value);

  const [offset, setOffset] = useState(circ);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setOffset(target);
      setAnimated(true);
    });
    return () => cancelAnimationFrame(id);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleClick = () => {
    setAnimated(false);
    setOffset(circ);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setAnimated(true);
        setOffset(target);
      });
    });
  };

  return (
    <svg
      width={size}
      height={size}
      className="cursor-pointer shrink-0"
      onClick={handleClick}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-muted-foreground/20"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        stroke={color}
        style={{
          transition: animated ? 'stroke-dashoffset 0.7s ease-out' : 'none',
        }}
      />
      <text
        x={size / 2}
        y={size / 2}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="14"
        fontWeight="600"
        fill={color}
      >
        {(value * 100).toFixed(0)}
      </text>
    </svg>
  );
}

export const GeneratedVariantCard = ({
  item,
  index,
  label,
  isBest,
  derivedMetrics,
  showAnalytics,
}: GeneratedVariantCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = textRef.current;
    if (el) setIsOverflowing(el.scrollHeight > el.clientHeight);
  }, []);

  const active = getActiveMetrics(item);
  const overallScore = active[OVERALL_SCORE_KEY];
  const score = typeof overallScore === 'number' ? overallScore : null;
  const textLength = getMetricCount(item, LENGTH_KEY);
  const { className: badgeClass, text: badgeText } = labelConfig[label];

  const handleCopy = () => {
    navigator.clipboard.writeText(item.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card
      className={
        isBest
          ? 'border-2 border-green-600 dark:border-green-500'
          : 'border-2 border-transparent'
      }
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base">Вариант {index + 1}</CardTitle>
          {score !== null && (
            <span
              className="text-xl font-bold tabular-nums"
              style={{ color: scoreColor(score) }}
            >
              {(score * 100).toFixed(1)}
            </span>
          )}
        </div>
        <span
          className={`self-start rounded-md px-2 py-1 text-xs font-medium ${badgeClass}`}
        >
          {badgeText}
        </span>
        {textLength !== null && (
          <span className="mt-2 self-start rounded-md border px-2 py-1 text-xs text-muted-foreground">
            Длина: {textLength} симв.
          </span>
        )}
      </CardHeader>

      <CardContent className="space-y-3">
        <div
          ref={textRef}
          className={`whitespace-pre-wrap text-sm leading-normal ${!expanded ? 'line-clamp-6' : ''}`}
        >
          {item.text}
        </div>

        {isOverflowing && (
          <button
            className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            onClick={() => setExpanded((e) => !e)}
          >
            {expanded ? 'Свернуть' : 'Развернуть'}
          </button>
        )}

        {derivedMetrics && (
          <div className="border-t pt-3 space-y-2">
            {(Object.keys(METRIC_LABELS) as Array<keyof DerivedMetrics>).map(
              (key) => (
                <div
                  key={key}
                  className="flex items-center justify-between gap-3"
                >
                  <span className="text-sm text-muted-foreground truncate">
                    {METRIC_LABELS[key]}
                  </span>
                  <CircularProgress value={derivedMetrics[key]} />
                </div>
              ),
            )}
          </div>
        )}

        {showAnalytics && (
          <>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => setAnalyticsOpen((o) => !o)}
            >
              {analyticsOpen ? 'Скрыть аналитику' : 'Подробная аналитика'}
            </Button>
            {analyticsOpen && (
              <div className="space-y-2 border-t pt-3">
                {categorizeMetrics(active).bool.map(({ key, value }) => (
                  <div key={key} className="flex items-center  gap-2">
                    <BoolBadge value={value} />
                    <span className="text-xs text-muted-foreground">{key}</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        <Button size="sm" className="w-full gap-2" onClick={handleCopy}>
          {copied ? (
            <CheckIcon className="size-4" />
          ) : (
            <CopyIcon className="size-4" />
          )}
          {copied ? 'Скопировано' : 'Скопировать'}
        </Button>
      </CardContent>
    </Card>
  );
};
