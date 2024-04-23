export const SupportCategoryMap = {
  Feedback: 'Feedback',
  Complaint: 'Complaint',
  Others: 'Others',
} as const;

export type SupportCategory =
  (typeof SupportCategoryMap)[keyof typeof SupportCategoryMap];

export interface IContactSupportDialogProps {
  providedDescription?: string;
  errorCategory?: SupportCategory;
}
