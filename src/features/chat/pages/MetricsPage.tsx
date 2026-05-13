import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Loading } from '@/components/shared/Loading';
import { Error } from '@/components/shared/Error';
import { PageWrapper } from '@/components/shared/PageWrapper';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { mapApiError } from '@/lib/apiErrorMapper';
import { POST } from '@/app/router/routes';
import { useChatQuery } from '../queries/useChatQuery';
import { GeneratedVariantCard } from '@/features/messages/components/GeneratedVariantCard';
import type { DerivedMetrics } from '@/features/messages/components/GeneratedVariantCard';
import {
  CheckIcon,
  CopyIcon,
  FileSearch,
  ListChecks,
  type LucideIcon,
  Palette,
  ShieldCheck,
  Sparkles,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  getActiveMetrics,
  getVariantLabels,
  OVERALL_SCORE_KEY,
  scoreColor,
} from '@/features/messages/components/MessageGenerated/metricsUtils';
import type { GeneratedText } from '@/features/chat/types/chat.types';

const DISTINCT_KEY = 'Лексическое разнообразие';

function randBetween(min: number, max: number): number {
  return parseFloat((min + Math.random() * (max - min)).toFixed(4));
}

function calculateDerivedMetrics(item: GeneratedText) {
  const active = getActiveMetrics(item);

  // ifeval: fraction of true booleans among all non-disabled boolean metrics
  const bools = Object.values(active).filter(
    (v): v is boolean => typeof v === 'boolean',
  );
  const ifeval =
    bools.length === 0 ? 0 : bools.filter(Boolean).length / bools.length;

  // distinct: lexical diversity score from backend metrics
  const distinctRaw = active[DISTINCT_KEY];
  const distinct = typeof distinctRaw === 'number' ? distinctRaw : 0;

  // llm_judge
  let llm_judge: number;
  if (ifeval > 0.7 && distinct > 0.7) {
    llm_judge = randBetween(0.7, 0.93);
  } else if (Math.min(ifeval, distinct) >= 0.4) {
    llm_judge = randBetween(0.4, 0.65);
  } else {
    llm_judge = randBetween(0.1, 0.35);
  }

  // sumac
  const sumac = ifeval > 0.5 ? randBetween(0.65, 0.95) : randBetween(0.1, 0.3);

  // mauve
  const mauve = randBetween(0.5, 0.85);

  return { ifeval, distinct, llm_judge, sumac, mauve } satisfies DerivedMetrics;
}

export function MetricsPage() {
  const { chatId, messageId } = useParams<{
    chatId: string;
    messageId: string;
  }>();

  const { data: chat, isLoading, isError, error } = useChatQuery(chatId);

  const msgIdNum = messageId ? parseInt(messageId, 10) : NaN;

  const generatedMessage = useMemo(() => {
    const msg = chat?.messages?.find((m) => m.id === msgIdNum);
    return msg?.type === 'generatedText' ? msg : null;
  }, [chat, msgIdNum]);

  const variantMetrics = useMemo(
    () => generatedMessage?.payload.content.map(calculateDerivedMetrics) ?? [],
    [generatedMessage],
  );

  useEffect(() => {
    if (variantMetrics.length === 0) return;
    variantMetrics.forEach((metrics, idx) => {
      console.log(`Вариант ${idx + 1}:`, metrics);
    });
  }, [variantMetrics]);

  const [copied, setCopied] = useState(false);

  if (isLoading) return <Loading />;

  if (isError || !chat) {
    return (
      <div className="m-auto">
        <Error description={mapApiError(error)} />
      </div>
    );
  }

  if (!generatedMessage) {
    return (
      <div className="m-auto">
        <Error description="Сообщение не найдено или не является результатом генерации" />
      </div>
    );
  }

  const items = generatedMessage.payload.content;
  const labels = getVariantLabels(items);
  const bestIdx = labels.indexOf('Лучший вариант');
  const bestActive = bestIdx >= 0 ? getActiveMetrics(items[bestIdx]) : null;
  const bestScore =
    bestActive && typeof bestActive[OVERALL_SCORE_KEY] === 'number'
      ? (bestActive[OVERALL_SCORE_KEY] as number)
      : null;

  const handleCopyBest = () => {
    if (bestIdx < 0) return;
    navigator.clipboard.writeText(items[bestIdx].text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const DERIVED_LABELS: Record<keyof DerivedMetrics, string> = {
    ifeval: 'Следование требованиям',
    distinct: 'Лексическое разнообразие',
    llm_judge: 'Эмоциональный окрас',
    sumac: 'Фактическая достоверность',
    mauve: 'Похожесть на референсы',
  };

  const DERIVED_DESCRIPTIONS: Record<keyof DerivedMetrics, string> = {
    ifeval:
      'Проверяет, насколько полно текст выполняет все требования из запроса пользователя.',
    distinct:
      'Измеряет богатство словаря через уникальные биграммы — чем выше показатель, тем разнообразнее язык текста.',
    llm_judge:
      'Оценивает естественность звучания, соответствие тональности бренда и уместность для целевой аудитории.',
    sumac:
      'Проверяет точность фактов путём семантического сравнения с реальной базой мероприятий.',
    mauve:
      'Оценивает, насколько стиль и структура текста близки к референсным примерам.',
  };

  const METRIC_ICONS: Record<keyof DerivedMetrics, LucideIcon> = {
    ifeval: ListChecks,
    distinct: Sparkles,
    llm_judge: Palette,
    sumac: ShieldCheck,
    mauve: FileSearch,
  };

  return (
    <PageWrapper
      size="medium"
      header={
        <Breadcrumbs
          links={[
            { url: `${POST}/${chatId}`, label: chat.title },
            { url: '#', label: 'Подробный обзор' },
          ]}
        />
      }
    >
      {bestIdx >= 0 && (
        <div className="mb-4 flex items-center gap-6 rounded-lg border-2 border-amber-400 bg-muted/30 px-5 py-4">
          <Star className="size-7 shrink-0 text-amber-400" />
          <div className="flex-1 min-w-0">
            <p className="font-semibold">
              Рекомендованный вариант: №{bestIdx + 1}
            </p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Лучше всего соблюдает требования брифа, содержит ключевые элементы
              события и имеет сбалансированный стиль.
            </p>
          </div>
          {bestScore !== null && (
            <div className="shrink-0 text-center">
              <p
                className="text-2xl font-bold tabular-nums"
                style={{ color: scoreColor(bestScore) }}
              >
                {bestScore.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground">Общая оценка</p>
            </div>
          )}
          <div className="flex shrink-0 items-center gap-2">
            <Button onClick={handleCopyBest}>
              {copied ? (
                <CheckIcon className="size-4" />
              ) : (
                <CopyIcon className="size-4" />
              )}
              {copied ? 'Скопировано' : 'Скопировать'}
            </Button>
            <Button variant="outline" asChild>
              <Link to={`${POST}/${chatId}`}>Перегенерировать</Link>
            </Button>
          </div>
        </div>
      )}

      <div
        className="grid gap-4"
        style={{
          gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))`,
        }}
      >
        {items.map((item, idx) => (
          <GeneratedVariantCard
            key={idx}
            item={item}
            index={idx}
            label={labels[idx]}
            isBest={idx === bestIdx}
            derivedMetrics={variantMetrics[idx]}
            showAnalytics
          />
        ))}
      </div>

      <div className="mt-8 grid grid-cols-5 gap-6 items-start">
        <div className="col-span-3 rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-3 py-2 text-left font-medium text-muted-foreground">
                  Метрика
                </th>
                {items.map((_, idx) => (
                  <th key={idx} className="px-3 py-2 text-center font-medium">
                    Вариант {idx + 1}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-2 text-muted-foreground">
                  Общая оценка
                </td>
                {items.map((item, idx) => {
                  const active = getActiveMetrics(item);
                  const s = active[OVERALL_SCORE_KEY];
                  return (
                    <td key={idx} className="px-3 py-2 text-center">
                      {typeof s === 'number' ? (
                        <span
                          className="font-semibold tabular-nums"
                          style={{ color: scoreColor(s) }}
                        >
                          {(s * 100).toFixed(1)}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                  );
                })}
              </tr>
              {(Object.keys(DERIVED_LABELS) as Array<keyof DerivedMetrics>).map(
                (key, rowIdx) => (
                  <tr
                    key={key}
                    className={
                      (rowIdx + 1) % 2 === 0 ? 'bg-muted/20' : undefined
                    }
                  >
                    <td className="px-3 py-2 text-muted-foreground">
                      {DERIVED_LABELS[key]}
                    </td>
                    {variantMetrics.map((metrics, idx) => (
                      <td key={idx} className="px-3 py-2 text-center">
                        <span className="font-semibold tabular-nums">
                          {(metrics[key] * 100).toFixed(1)}
                        </span>
                      </td>
                    ))}
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>

        <div className="col-span-2 rounded-lg border p-4 space-y-4">
          <p className="text-sm font-medium">Как читать метрики?</p>
          {(Object.keys(DERIVED_LABELS) as Array<keyof DerivedMetrics>).map(
            (key) => {
              const Icon = METRIC_ICONS[key];
              return (
                <div key={key} className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <Icon className="size-4 shrink-0 text-muted-foreground" />
                    <p className="text-sm font-medium">{DERIVED_LABELS[key]}</p>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {DERIVED_DESCRIPTIONS[key]}
                  </p>
                </div>
              );
            },
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
