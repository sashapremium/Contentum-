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

type BreadcrumbLink = { url: string; label: string };

export function Breadcrumbs({ links }: { links: BreadcrumbLink[] }) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {links.map((link, i) => {
          const isLast = i === links.length - 1;
          return (
            <Fragment key={link.url}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{link.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={link.url}>{link.label}</Link>
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
