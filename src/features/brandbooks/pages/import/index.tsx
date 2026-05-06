import { useRef, useState } from 'react';
import { useNavigate } from 'react-router';

import { THEATRE, THEATRE_TITLE, THEATRE_BRANDBOOK_IMPORT, BRANDBOOK_TITLE } from '@/app/router/routes';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { Error } from '@/components/shared/Error';
import { Loading } from '@/components/shared/Loading';
import { PageWrapper } from '@/components/shared/PageWrapper';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { useTheatresQuery } from '@/features/theatre/queries/useTheatresQuery';
import { useImportBrandbookMutation } from '../../queries/useImportBrandbookMutation';

const breadcrumbs = [
  { url: THEATRE, label: THEATRE_TITLE },
  { url: THEATRE_BRANDBOOK_IMPORT, label: BRANDBOOK_TITLE },
];

export const BrandbookImportPage = () => {
  const navigate = useNavigate();
  const theatresQuery = useTheatresQuery();
  const importMutation = useImportBrandbookMutation();

  const [theatreId, setTheatreId] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!theatreId || !file) return;

    importMutation.mutate(
      { theatreId: Number(theatreId), file },
      { onSuccess: () => navigate(THEATRE) },
    );
  };

  if (theatresQuery.isLoading) return <Loading />;

  if (theatresQuery.isError || !theatresQuery.data) {
    return (
      <PageWrapper header={<Breadcrumbs links={breadcrumbs} />}>
        <Error description="Не удалось загрузить список учреждений" />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper header={<Breadcrumbs links={breadcrumbs} />}>
      <Card>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <header className="space-y-2">
              <span className="text-xl font-semibold">Импорт брендбука</span>
              <p className="text-sm text-muted-foreground">
                Выберите учреждение и загрузите архив брендбука в формате .zip
              </p>
            </header>

            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-2">
                <Label htmlFor="theatre">Учреждение*</Label>
                <Select value={theatreId} onValueChange={setTheatreId}>
                  <SelectTrigger id="theatre" className="w-full">
                    <SelectValue placeholder="Выберите учреждение" />
                  </SelectTrigger>
                  <SelectContent>
                    {theatresQuery.data.theatres.map((theatre) => (
                      <SelectItem key={theatre.id} value={String(theatre.id)}>
                        {theatre.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="file">Файл брендбука (.zip)*</Label>
                <Input
                  id="file"
                  type="file"
                  accept=".zip"
                  ref={fileInputRef}
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />
              </div>
            </div>

            {importMutation.isError && (
              <Error description="Не удалось импортировать брендбук" />
            )}

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={!theatreId || !file || importMutation.isPending}
              >
                Импортировать
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </PageWrapper>
  );
};
