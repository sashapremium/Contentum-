// Вкладка "По вариантам": сетка карточек MetricsVariantCard для каждого варианта.

import type { GeneratedText } from '@/features/chat/types/chat.types';
import { MetricsVariantCard } from './MetricsVariantCard';

interface MetricsVariantsTabProps {
  items: GeneratedText[];
}

export const MetricsVariantsTab = ({ items }: MetricsVariantsTabProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {items.map((item, idx) => (
        <MetricsVariantCard key={idx} item={item} index={idx} />
      ))}
    </div>
  );
};
