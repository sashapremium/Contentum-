import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import {
  THEATRE,
  THEATRE_TITLE,
  THEATRE_TEMPLATE_CREATE,
  TEMPLATE_TITLE,
} from '@/app/router/routes';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { Error } from '@/components/shared/Error';
import { PageWrapper } from '@/components/shared/PageWrapper';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import type { Template } from '../../types';
import { useCreateTemplateMutation } from '../../queries/useCreateTemplateMutation';

const EXAMPLE_TEMPLATE: Template = {
  id: 'my_template',
  name: 'Мой шаблон',
  canvas: { width: 1080, height: 1080 },
  layers: [
    { type: 'photo', name: 'backgroundImage', box: [0, 0, 1080, 1080] },
    { type: 'text', name: 'mainText', editable: true, box: [55, 500, 970, 440] },
  ],
};

export const TemplateCreatePage = () => {
  const navigate = useNavigate();
  const { theatreId } = useParams<{ theatreId: string }>();
  const createMutation = useCreateTemplateMutation();

  const [json, setJson] = useState(JSON.stringify(EXAMPLE_TEMPLATE, null, 2));
  const [parseError, setParseError] = useState<string | null>(null);

  const breadcrumbs = [
    { url: THEATRE, label: THEATRE_TITLE },
    { url: THEATRE_TEMPLATE_CREATE.replace(':theatreId', theatreId!), label: TEMPLATE_TITLE },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setParseError(null);

    let parsed: Template;
    try {
      parsed = JSON.parse(json);
    } catch {
      setParseError('Некорректный JSON');
      return;
    }

    createMutation.mutate(
      { theatreId: Number(theatreId), payload: parsed },
      { onSuccess: () => navigate(THEATRE) },
    );
  };

  return (
    <PageWrapper header={<Breadcrumbs links={breadcrumbs} />}>
      <Card>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <header className="space-y-2">
              <span className="text-xl font-semibold">Создание шаблона</span>
              <p className="text-sm text-muted-foreground">
                Отредактируйте JSON-схему и нажмите «Создать»
              </p>
            </header>

            <div className="flex flex-col gap-2">
              <Label htmlFor="schema">JSON-схема шаблона*</Label>
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

            {createMutation.isError && (
              <Error description="Не удалось создать шаблон" />
            )}

            <div className="flex justify-end">
              <Button type="submit" disabled={createMutation.isPending}>
                Создать
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </PageWrapper>
  );
};
