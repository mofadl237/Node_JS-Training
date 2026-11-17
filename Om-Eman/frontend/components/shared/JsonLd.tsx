interface IProps {
  data: Record<string, unknown>;
}

export const JsonLd = ({ data }: IProps) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
  />
);
