import { useTranslations } from "next-intl";

const AuthDivider = () => {
  const t = useTranslations("account.google");

  return (
    <div className="flex items-center gap-3 py-1 text-xs text-ink-soft">
      <span className="h-px flex-1 bg-ink/10" />
      <span>{t("divider")}</span>
      <span className="h-px flex-1 bg-ink/10" />
    </div>
  );
};

export default AuthDivider;
