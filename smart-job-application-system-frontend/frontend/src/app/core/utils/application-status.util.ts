import { ApplicationStatus } from '../models';

export interface StatusMeta {
  label: string;
  /** Used sparingly — timelines and notifications, not dense tables. */
  emoji: string;
  icon: string;
  badgeClasses: string;
  dotClasses: string;
  /** Short, human message for candidate-facing surfaces. */
  candidateMessage: string;
}

export const STATUS_META: Record<ApplicationStatus, StatusMeta> = {
  SENT: {
    label: 'Sent',
    emoji: '🤞',
    icon: 'send',
    badgeClasses: 'bg-ink-100 text-ink-600',
    dotClasses: 'bg-ink-400',
    candidateMessage: 'Application successfully submitted! Good luck! 🤞',
  },
  VIEWED: {
    label: 'Viewed',
    emoji: '👀',
    icon: 'visibility',
    badgeClasses: 'bg-amber-50 text-amber-700',
    dotClasses: 'bg-amber-500',
    candidateMessage: 'Good news — the recruiter has opened your application. 👀',
  },
  SHORTLISTED: {
    label: 'Shortlisted',
    emoji: '⭐',
    icon: 'star',
    badgeClasses: 'bg-accent-light text-accent',
    dotClasses: 'bg-accent',
    candidateMessage: "You've been shortlisted — you're standing out! ⭐",
  },
  INTERVIEW: {
    label: 'Interview',
    emoji: '📅',
    icon: 'forum',
    badgeClasses: 'bg-primary-50 text-primary-700',
    dotClasses: 'bg-primary-500',
    candidateMessage: "Great news! You've been invited to an interview. 🚀",
  },
  ACCEPTED: {
    label: 'Accepted',
    emoji: '🎉',
    icon: 'celebration',
    badgeClasses: 'bg-emerald-50 text-emerald-700',
    dotClasses: 'bg-emerald-500',
    candidateMessage: 'Congratulations! Your application has been accepted. 🎉',
  },
  REJECTED: {
    label: 'Rejected',
    emoji: '😔',
    icon: 'cancel',
    badgeClasses: 'bg-rose-50 text-rose-700',
    dotClasses: 'bg-rose-500',
    candidateMessage: "Unfortunately, this application wasn't selected this time. 😔",
  },
};

export function statusMeta(status: ApplicationStatus | undefined | null): StatusMeta {
  return status ? STATUS_META[status] : STATUS_META['SENT'];
}
