import {z} from 'zod';

export const cefrLevelSchema = z.enum(['A1', 'A2', 'B1', 'B2', 'C1']);
export type CefrLevel = z.infer<typeof cefrLevelSchema>;

export const roleSchema = z.enum(['learner', 'admin']);
export type Role = z.infer<typeof roleSchema>;
export const appRoleSchema = roleSchema;
export type AppRole = Role;

export const invitationStatusSchema = z.enum(['pending', 'accepted', 'revoked']);
export type InvitationStatus = z.infer<typeof invitationStatusSchema>;

export const polishCaseSchema = z.enum([
  'nominative',
  'genitive',
  'dative',
  'accusative',
  'instrumental',
  'locative',
  'vocative',
]);
export type PolishCase = z.infer<typeof polishCaseSchema>;
export const caseIdSchema = polishCaseSchema;
export type CaseId = PolishCase;

export const profileSchema = z.object({
  id: z.string().uuid(),
  email: z.string().trim().toLowerCase().email(),
  role: roleSchema,
  cefrLevel: cefrLevelSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type Profile = z.infer<typeof profileSchema>;

export const invitationSchema = z.object({
  id: z.string().uuid(),
  email: z.string().trim().toLowerCase().email(),
  status: invitationStatusSchema,
  invitedBy: z.string().uuid(),
  acceptedBy: z.string().uuid().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type Invitation = z.infer<typeof invitationSchema>;

export const adminInviteRequestSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
});
export type AdminInviteRequest = z.infer<typeof adminInviteRequestSchema>;
