import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import type { GeneratedText } from '@/features/chat/types/chat.types';
import { MetricsSummaryTab } from './MetricsSummaryTab';
import { MetricsVariantsTab } from './MetricsVariantsTab';

interface MetricsCompareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: GeneratedText[];
}

export const MetricsCompareDialog = ({
  open,
  onOpenChange,
  items,
}: MetricsCompareDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Сравнение метрик</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="summary">
          <TabsList>
            <TabsTrigger value="summary">Сводка</TabsTrigger>
            <TabsTrigger value="variants">По вариантам</TabsTrigger>
          </TabsList>
          <TabsContent value="summary" className="mt-4">
            <MetricsSummaryTab items={items} />
          </TabsContent>
          <TabsContent value="variants" className="mt-4">
            <MetricsVariantsTab items={items} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
