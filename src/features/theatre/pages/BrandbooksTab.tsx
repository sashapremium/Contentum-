// Вкладка брендбуков: Select для выбора учреждения
// Показывает список шаблонов с превью Удаление брендбука через

import { useState } from 'react';

import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Loading } from '@/components/shared/Loading';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usePhotoSessionsQuery } from '@/features/photo/queries/usePhotoSessionsQuery';

import { MessageImage } from '@/features/messages/components/Message/MessageImage';
import { useBrandbookQuery } from '@/features/brandbooks/queries/useBrandbookQuery';
import { useDeleteBrandbookMutation } from '@/features/brandbooks/queries/useDeleteBrandbookMutation';

interface BrandbooksTabProps {
  selectedTheatreId: number | undefined;
  onTheatreChange: (id: number | undefined) => void;
}

export const BrandbooksTab = ({
  selectedTheatreId,
  onTheatreChange,
}: BrandbooksTabProps) => {
  const photoSessionsQuery = usePhotoSessionsQuery();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const brandbookQuery = useBrandbookQuery(selectedTheatreId);
  const deleteMutation = useDeleteBrandbookMutation();

  const theatres = photoSessionsQuery.data?.theatres ?? [];

  return (
    <div className="space-y-6">
      <Select
        value={selectedTheatreId !== undefined ? String(selectedTheatreId) : ''}
        onValueChange={(v) => onTheatreChange(Number(v))}
      >
        <SelectTrigger className="w-64">
          <SelectValue placeholder="Выберите учреждение" />
        </SelectTrigger>
        <SelectContent>
          {theatres.map((t) => (
            <SelectItem key={t.id} value={String(t.id)}>
              {t.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedTheatreId !== undefined && (
        <>
          {brandbookQuery.isLoading && <Loading />}

          {brandbookQuery.isError && (
            <p className="text-sm text-muted-foreground">
              Брэндбук не найден или не загружен
            </p>
          )}

          {brandbookQuery.data && (
            <div className="space-y-4">
              <div>
                <div className="text-lg font-semibold">
                  {brandbookQuery.data.theatreName}
                </div>
                <div className="text-sm text-muted-foreground">
                  Шаблонов: {brandbookQuery.data.templates.length}
                </div>
              </div>

              <div className="space-y-2">
                {brandbookQuery.data.templates.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center gap-3 rounded-md border px-4 py-3"
                  >
                    {t.preview && (
                      <div className="w-12 shrink-0">
                        <MessageImage
                          info={{
                            resultPng: `/media/brandbooks/${selectedTheatreId}/${t.preview}`,
                            resultWebp: `/media/brandbooks/${selectedTheatreId}/${t.preview}`,
                          }}
                          showDownload={false}
                        />
                      </div>
                    )}
                    <div>
                      <div className="font-medium">{t.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {t.family}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
                Удалить брэндбук
              </Button>
            </div>
          )}
        </>
      )}

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Удалить брэндбук?"
        description="Это действие необратимо."
        confirmText="Удалить"
        onClickConfirm={() => {
          if (selectedTheatreId === undefined) return;
          deleteMutation.mutate(selectedTheatreId, {
            onSuccess: () => {
              setDeleteOpen(false);
              onTheatreChange(undefined);
            },
          });
        }}
      />
    </div>
  );
};
