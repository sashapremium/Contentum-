// Вкладка шаблонов: Select для выбора учреждения, список шаблонов из brandbook.

import { useState } from 'react';
import { generatePath, Link, useNavigate } from 'react-router';

import {
  THEATRE_TEMPLATE_CREATE,
  THEATRE_TEMPLATE_DETAIL,
} from '@/app/router/routes';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Loading } from '@/components/shared/Loading';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { usePhotoSessionsQuery } from '@/features/photo/queries/usePhotoSessionsQuery';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MessageImage } from '@/features/messages/components/Message/MessageImage';
import { useDeleteTemplateMutation } from '@/features/template/queries/useDeleteTemplateMutation';
import { useTemplateQuery } from '@/features/template/queries/useTemplateQuery';
import { useUpdateTemplateMutation } from '@/features/template/queries/useUpdateTemplateMutation';
import { FilePlus, Pencil, Settings2, Trash2 } from 'lucide-react';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface RenameTarget {
  theatreId: number;
  templateId: string;
}

interface RenameTemplateDialogProps {
  target: RenameTarget | null;
  onClose: () => void;
}

const RenameTemplateDialog = ({
  target,
  onClose,
}: RenameTemplateDialogProps) => {
  const [name, setName] = useState('');

  const templateQuery = useTemplateQuery(target?.theatreId, target?.templateId);
  const updateMutation = useUpdateTemplateMutation();

  const template = templateQuery.data;

  const handleOpenChange = (open: boolean) => {
    if (!open) onClose();
  };

  const handleSave = () => {
    if (!target || !template || !name.trim()) return;
    updateMutation.mutate(
      {
        theatreId: target.theatreId,
        templateId: target.templateId,
        payload: { ...template, name: name.trim() },
      },
      { onSuccess: onClose },
    );
  };

  const currentName = template?.name ?? '';

  return (
    <Dialog open={Boolean(target)} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Переименовать шаблон</DialogTitle>
        </DialogHeader>

        {templateQuery.isLoading && <Loading />}

        {template && (
          <div className="grid gap-2">
            <Label htmlFor="template-name">Название</Label>
            <Input
              id="template-name"
              value={name || currentName}
              onChange={(e) => setName(e.target.value)}
              placeholder="Введите название"
            />
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <Button
            onClick={handleSave}
            disabled={
              updateMutation.isPending || templateQuery.isLoading || !template
            }
          >
            Сохранить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface DeleteTarget {
  theatreId: number;
  templateId: string;
  name: string;
}

interface TemplatesTabProps {
  selectedTheatreId: number | undefined;
  onTheatreChange: (id: number | undefined) => void;
}

export const TemplatesTab = ({
  selectedTheatreId,
  onTheatreChange,
}: TemplatesTabProps) => {
  const navigate = useNavigate();
  const photoSessionsQuery = usePhotoSessionsQuery();
  const deleteMutation = useDeleteTemplateMutation();

  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [renameTarget, setRenameTarget] = useState<RenameTarget | null>(null);

  const theatres = photoSessionsQuery.data?.theatres ?? [];

  const templates =
    selectedTheatreId !== undefined
      ? (photoSessionsQuery.data?.brandbooks.find(
          (b) => b.theatreId === selectedTheatreId,
        )?.templates ?? [])
      : [];

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
        <div className="space-y-4">
          <div>
            <Button asChild>
              <Link
                to={generatePath(THEATRE_TEMPLATE_CREATE, {
                  theatreId: String(selectedTheatreId),
                })}
              >
                <FilePlus />
                Создать шаблон
              </Link>
            </Button>
          </div>

          {templates.length === 0 && (
            <p className="text-sm text-muted-foreground">Шаблоны не найдены</p>
          )}

          <div className="space-y-2">
            {templates.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between rounded-lg border px-4 py-3"
              >
                <div className="flex items-center gap-3">
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
                <div className="flex gap-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          setRenameTarget({
                            theatreId: selectedTheatreId,
                            templateId: t.id,
                          })
                        }
                      >
                        <Pencil />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Переименовать</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          navigate(
                            generatePath(THEATRE_TEMPLATE_DETAIL, {
                              theatreId: String(selectedTheatreId),
                              templateId: t.id,
                            }),
                          )
                        }
                      >
                        <Settings2 />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Изменить</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() =>
                          setDeleteTarget({
                            theatreId: selectedTheatreId,
                            templateId: t.id,
                            name: t.name,
                          })
                        }
                      >
                        <Trash2 />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Удалить</TooltipContent>
                  </Tooltip>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <RenameTemplateDialog
        target={renameTarget}
        onClose={() => setRenameTarget(null)}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Удалить шаблон?"
        description={`Шаблон «${deleteTarget?.name}» будет удалён безвозвратно.`}
        confirmText="Удалить"
        onClickConfirm={() => {
          if (!deleteTarget) return;
          deleteMutation.mutate(
            {
              theatreId: deleteTarget.theatreId,
              templateId: deleteTarget.templateId,
            },
            { onSuccess: () => setDeleteTarget(null) },
          );
        }}
      />
    </div>
  );
};
