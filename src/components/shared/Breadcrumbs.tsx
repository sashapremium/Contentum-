// Хлебные крошки навигации. Каждый элемент: ссылка (url) или кнопка (onClick).
// Последний элемент всегда отображается как текущая страница (без ссылки).
import { Fragment } from "react";
import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type BreadcrumbLinkItem =
  | { url: string; onClick?: never; label: string }
  | { onClick: () => void; url?: never; label: string };

export function Breadcrumbs({ links }: { links: BreadcrumbLinkItem[] }) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {links.map((link, i) => {
          const isLast = i === links.length - 1;
          const key = link.url ?? link.label;
          return (
            <Fragment key={key}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{link.label}</BreadcrumbPage>
                ) : link.onClick ? (
                  <BreadcrumbLink asChild>
                    <button onClick={link.onClick} className="cursor-pointer">
                      {link.label}
                    </button>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={link.url!}>{link.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
