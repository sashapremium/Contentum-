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

import { useBrandbookQuery } from '@/features/brandbooks/queries/useBrandbookQuery';
import { useDeleteBrandbookMutation } from '@/features/brandbooks/queries/useDeleteBrandbookMutation';

export const BrandbooksTab = () => {
  const photoSessionsQuery = usePhotoSessionsQuery();
  const [selectedTheatreId, setSelectedTheatreId] = useState<number | undefined>();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const brandbookQuery = useBrandbookQuery(selectedTheatreId);
  const deleteMutation = useDeleteBrandbookMutation();

  const theatres = photoSessionsQuery.data?.theatres ?? [];

  return (
    <div className="space-y-6">
      <Select
        value={selectedTheatreId !== undefined ? String(selectedTheatreId) : ''}
        onValueChange={(v) => setSelectedTheatreId(Number(v))}
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
                <div className="text-lg font-semibold">{brandbookQuery.data.theatreName}</div>
                <div className="text-sm text-muted-foreground">
                  Шаблонов: {brandbookQuery.data.templates.length}
                </div>
              </div>

              <div className="space-y-1">
                {brandbookQuery.data.templates.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center gap-2 rounded-md border px-3 py-2"
                  >
                    {t.preview && (
                      <img
                        src={t.preview}
                        alt={t.name}
                        className="h-8 w-8 rounded object-cover"
                      />
                    )}
                    <div>
                      <div className="text-sm font-medium">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.family}</div>
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
              setSelectedTheatreId(undefined);
            },
          });
        }}
      />
    </div>
  );
};
