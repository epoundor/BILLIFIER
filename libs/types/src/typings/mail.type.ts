import type { ISendMailOptions } from '@nest-modules/mailer';

export type MailTemplatePayload = {
  'signin-otp': {
    otp: string;
  };
  ticket: {
    email: string;
    name: string | null;
    isMulti: boolean;
    date: string;
  };
};

type ExtractProperties<T extends object | undefined> = { [P in keyof T]: T[P] };

type MailTemplatePayloadContent<T extends keyof MailTemplatePayload> =
  ExtractProperties<MailTemplatePayload[T]>;

export type MailMetadata<T extends keyof MailTemplatePayload> =
  ISendMailOptions & {
    to: string;
    subject: string;
    template: T; // Template name
    payload?: MailTemplatePayloadContent<T>; // Dynamic payload type based on template name
  };
