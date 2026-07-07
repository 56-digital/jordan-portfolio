interface CaseStudyHeadingProps {
  title: string;
  roles: string[];
  as?: 'span' | 'h1';
}

export function CaseStudyHeading({ title, roles, as: Tag = 'span' }: CaseStudyHeadingProps) {
  return (
    <div className="cs-panel-meta">
      <Tag className="casestudy-title">{title}</Tag>
      {roles.length ? (
        <span className="casestudy-role">
          {roles.map((service) => (
            <span key={service} className="cs-service">
              {service}
            </span>
          ))}
        </span>
      ) : null}
    </div>
  );
}
