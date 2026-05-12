import { useEffect, useRef, useState } from 'react';
import { CheckIcon, CopyIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { GeneratedText } from '@/features/chat/types/chat.types';
import {
  getActiveMetrics,
  OVERALL_SCORE_KEY,
  scoreColor,
} from './MessageGenerated/metricsUtils';
import type { VariantQualityLabel } from './MessageGenerated/metricsUtils';

interface GeneratedVariantCardProps {
  item: GeneratedText;
  index: number;
  label: VariantQualityLabel;
  isBest: boolean;
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

export const GeneratedVariantCard = ({
  item,
  index,
  label,
  isBest,
}: GeneratedVariantCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = textRef.current;
    if (el) setIsOverflowing(el.scrollHeight > el.clientHeight);
  }, []);

  const active = getActiveMetrics(item);
  const overallScore = active[OVERALL_SCORE_KEY];
  const score = typeof overallScore === 'number' ? overallScore : null;
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
          className={`self-start rounded-md px-2 py-0.5 text-xs font-medium ${badgeClass}`}
        >
          {badgeText}
        </span>
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

        <Button
          variant="ghost"
          size="sm"
          className="w-full gap-2"
          onClick={handleCopy}
        >
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
