import { env } from "../../../config/env.js";
import type { IEmailMessage } from "../../../interfaces/email/IEmailMessage.js";
import {
  renderEmailLayout,
  renderEmailText,
  type IEmailLayoutInput,
} from "./email-layout.js";
import type { TAuthLocale } from "./types.js";

const VERIFY_PATH = "/account/verify-email";
const RESET_PATH = "/account/reset-password";

interface IAuthEmailCopy {
  brand: string;
  footer: string;
  greetingNamed: (name: string) => string;
  greeting: string;
  fallbackLabel: string;
  verify: {
    subject: string;
    preheader: string;
    heading: string;
    intro: string;
    cta: string;
    expiry: (hours: number) => string;
    ignore: string;
  };
  reset: {
    subject: string;
    preheader: string;
    heading: string;
    intro: string;
    cta: string;
    expiry: (minutes: number) => string;
    ignore: string;
  };
}

const COPY: Record<TAuthLocale, IAuthEmailCopy> = {
  ar: {
    brand: "أم إيمان",
    footer: "هذه رسالة تلقائية من أم إيمان، يرجى عدم الرد عليها.",
    greetingNamed: (name) => `مرحبًا ${name}،`,
    greeting: "مرحبًا بك،",
    fallbackLabel: "إذا لم يعمل الزر، انسخ الرابط التالي والصقه في متصفحك:",
    verify: {
      subject: "تأكيد بريدك الإلكتروني - أم إيمان",
      preheader: "خطوة واحدة تفصلك عن تفعيل حسابك في أم إيمان.",
      heading: "تأكيد البريد الإلكتروني",
      intro:
        "شكرًا لتسجيلك في أم إيمان. لإكمال إنشاء حسابك وتفعيله، يرجى تأكيد عنوان بريدك الإلكتروني بالضغط على الزر أدناه.",
      cta: "تأكيد البريد الإلكتروني",
      expiry: (hours) =>
        `هذا الرابط صالح لمدة ${hours} ساعة من وقت إرسال الرسالة، ويمكن استخدامه مرة واحدة فقط.`,
      ignore:
        "إذا لم تقم بإنشاء حساب في أم إيمان، يمكنك تجاهل هذه الرسالة بأمان؛ لن يتم تفعيل أي حساب.",
    },
    reset: {
      subject: "إعادة تعيين كلمة المرور - أم إيمان",
      preheader: "تلقينا طلبًا لإعادة تعيين كلمة المرور الخاصة بحسابك.",
      heading: "إعادة تعيين كلمة المرور",
      intro:
        "تلقينا طلبًا لإعادة تعيين كلمة المرور الخاصة بحسابك في أم إيمان. اضغط على الزر أدناه لاختيار كلمة مرور جديدة.",
      cta: "إعادة تعيين كلمة المرور",
      expiry: (minutes) =>
        `هذا الرابط صالح لمدة ${minutes} دقيقة من وقت إرسال الرسالة، ويمكن استخدامه مرة واحدة فقط.`,
      ignore:
        "إذا لم تطلب إعادة تعيين كلمة المرور، يرجى تجاهل هذه الرسالة؛ ستظل كلمة مرورك الحالية كما هي.",
    },
  },
  en: {
    brand: "Om Eman",
    footer: "This is an automated message from Om Eman. Please do not reply to it.",
    greetingNamed: (name) => `Hello ${name},`,
    greeting: "Hello,",
    fallbackLabel: "If the button does not work, copy and paste this link into your browser:",
    verify: {
      subject: "Confirm your email address - Om Eman",
      preheader: "One step left to activate your Om Eman account.",
      heading: "Confirm your email address",
      intro:
        "Thank you for registering with Om Eman. To finish creating and activating your account, please confirm your email address by selecting the button below.",
      cta: "Confirm email address",
      expiry: (hours) =>
        `This link is valid for ${hours} hours from the time this message was sent and can be used only once.`,
      ignore:
        "If you did not create an Om Eman account, you can safely ignore this message. No account will be activated.",
    },
    reset: {
      subject: "Reset your password - Om Eman",
      preheader: "We received a request to reset your account password.",
      heading: "Reset your password",
      intro:
        "We received a request to reset the password for your Om Eman account. Select the button below to choose a new password.",
      cta: "Reset password",
      expiry: (minutes) =>
        `This link is valid for ${minutes} minutes from the time this message was sent and can be used only once.`,
      ignore:
        "If you did not request a password reset, please ignore this message. Your current password will remain unchanged.",
    },
  },
};

export function buildAuthLink(
  locale: TAuthLocale,
  path: string,
  token: string,
): string {
  return `${env.FRONTEND_URL}/${locale}${path}?token=${encodeURIComponent(token)}`;
}

export const buildVerifyLink = (locale: TAuthLocale, token: string): string =>
  buildAuthLink(locale, VERIFY_PATH, token);

export const buildResetLink = (locale: TAuthLocale, token: string): string =>
  buildAuthLink(locale, RESET_PATH, token);

function compose(
  to: string,
  subject: string,
  input: IEmailLayoutInput,
): IEmailMessage {
  return {
    to,
    subject,
    text: renderEmailText(input),
    html: renderEmailLayout(input),
  };
}

export function buildVerificationEmail(params: {
  to: string;
  link: string;
  locale: TAuthLocale;
  name?: string | undefined;
}): IEmailMessage {
  const copy = COPY[params.locale];
  const name = params.name?.trim();
  return compose(params.to, copy.verify.subject, {
    locale: params.locale,
    brand: copy.brand,
    preheader: copy.verify.preheader,
    heading: copy.verify.heading,
    greeting: name ? copy.greetingNamed(name) : copy.greeting,
    paragraphs: [copy.verify.intro],
    ctaLabel: copy.verify.cta,
    ctaUrl: params.link,
    fallbackLabel: copy.fallbackLabel,
    notes: [copy.verify.expiry(env.EMAIL_VERIFY_TOKEN_TTL_HOURS), copy.verify.ignore],
    footer: copy.footer,
  });
}

export function buildResetEmail(params: {
  to: string;
  link: string;
  locale: TAuthLocale;
}): IEmailMessage {
  const copy = COPY[params.locale];
  return compose(params.to, copy.reset.subject, {
    locale: params.locale,
    brand: copy.brand,
    preheader: copy.reset.preheader,
    heading: copy.reset.heading,
    greeting: copy.greeting,
    paragraphs: [copy.reset.intro],
    ctaLabel: copy.reset.cta,
    ctaUrl: params.link,
    fallbackLabel: copy.fallbackLabel,
    notes: [copy.reset.expiry(env.PASSWORD_RESET_TOKEN_TTL_MINUTES), copy.reset.ignore],
    footer: copy.footer,
  });
}
