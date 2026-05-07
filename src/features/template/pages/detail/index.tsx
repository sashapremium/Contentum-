import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import { THEATRE, THEATRE_TITLE } from '@/app/router/routes';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Error } from '@/components/shared/Error';
import { Loading } from '@/components/shared/Loading';
import { PageWrapper } from '@/components/shared/PageWrapper';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import type { Template } from '../../types';
import { useTemplateQuery } from '../../queries/useTemplateQuery';
import { useUpdateTemplateMutation } from '../../queries/useUpdateTemplateMutation';
import { useDeleteTemplateMutation } from '../../queries/useDeleteTemplateMutation';

export const TemplateDetailPage = () => {
  const navigate = useNavigate();
  const { theatreId, templateId } = useParams<{ theatreId: string; templateId: string }>();

  const [json, setJson] = useState('');
  const [parseError, setParseError] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const templateQuery = useTemplateQuery(Number(theatreId), templateId);
  const updateMutation = useUpdateTemplateMutation();
  const deleteMutation = useDeleteTemplateMutation();

  useEffect(() => {
    if (templateQuery.data) {
      setJson(JSON.stringify(templateQuery.data, null, 2));
    }
  }, [templateQuery.data]);

  const handleUpdate = () => {
    setParseError(null);

    let parsed: Template;
    try {
      parsed = JSON.parse(json);
    } catch {
      setParseError('Некорректный JSON');
      return;
    }

    updateMutation.mutate({
      theatreId: Number(theatreId),
      templateId: templateId!,
      payload: parsed,
    });
  };

  const handleDelete = () => {
    deleteMutation.mutate(
      { theatreId: Number(theatreId), templateId: templateId! },
      { onSuccess: () => navigate(THEATRE) },
    );
  };

  const breadcrumbs = [
    { url: THEATRE, label: THEATRE_TITLE },
    { url: '#', label: templateQuery.data?.name ?? templateId ?? 'Шаблон' },
  ];

  if (templateQuery.isLoading) return <Loading />;

  return (
    <PageWrapper header={<Breadcrumbs links={breadcrumbs} />}>
      <Card>
        <CardContent>
          <div className="space-y-6">
            <header className="space-y-2">
              <span className="text-xl font-semibold">
                {templateQuery.data?.name ?? 'Шаблон'}
              </span>
            </header>

            {templateQuery.isError && (
              <Error description="Не удалось загрузить шаблон" />
            )}

            <div className="flex flex-col gap-2">
              <Label htmlFor="schema">JSON-схема шаблона</Label>
              <Textarea
                id="schema"
                className="min-h-96 font-mono text-sm"
                value={json}
                onChange={(e) => setJson(e.target.value)}
                spellCheck={false}
              />
              {parseError && (
                <p className="text-sm text-destructive">{parseError}</p>
              )}
            </div>

            {updateMutation.isError && (
              <Error description="Не удалось обновить шаблон" />
            )}

            <div className="flex justify-between">
              <Button
                variant="destructive"
                disabled={deleteMutation.isPending}
                onClick={() => setDeleteOpen(true)}
              >
                Удалить
              </Button>

              <Button
                disabled={!json || updateMutation.isPending}
                onClick={handleUpdate}
              >
                Обновить
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Удалить шаблон?"
        description="Это действие необратимо."
        confirmText="Удалить"
        onClickConfirm={handleDelete}
      />
    </PageWrapper>
  );
};
