//NOTE - will be using Resend mail service

import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);
