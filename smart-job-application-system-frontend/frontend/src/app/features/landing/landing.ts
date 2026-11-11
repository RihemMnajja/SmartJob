import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PublicNavbar } from '../../shared/components/navbar/public-navbar';
import { PublicFooter } from '../../shared/components/footer/public-footer';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink, PublicNavbar, PublicFooter],
  templateUrl: './landing.html',
})
export class Landing {
  features = [
    {
      icon: 'auto_awesome',
      title: 'AI-powered CV matching',
      desc: 'Every application is instantly scored against the job requirements — no more guessing who to interview first.',
    },
    {
      icon: 'bolt',
      title: 'Instant candidate ranking',
      desc: 'Recruiters see applicants sorted by AI match score the moment a CV lands, with strengths and gaps highlighted.',
    },
    {
      icon: 'badge',
      title: 'Rich candidate profiles',
      desc: 'Experience, education, skills, languages, certifications and projects — all in one polished profile.',
    },
    {
      icon: 'insights',
      title: 'Transparent feedback',
      desc: 'Candidates get real AI feedback on their strengths and missing skills for every role they apply to.',
    },
    {
      icon: 'shield',
      title: 'Secure by design',
      desc: 'JWT authentication and role-based access keep candidate and recruiter data protected end-to-end.',
    },
    {
      icon: 'devices',
      title: 'Built for every screen',
      desc: 'A fully responsive experience so candidates can apply and recruiters can review from any device.',
    },
  ];

  steps = [
    {
      title: 'Build your profile or post a job',
      desc: 'Candidates fill out a rich profile with experience and skills. Recruiters publish a job offer in minutes.',
      icon: 'edit_note',
    },
    {
      title: 'Apply or receive applications',
      desc: 'Candidates apply with one click. Their CV uploads and enters the pipeline automatically.',
      icon: 'send',
    },
    {
      title: 'AI analyzes the match',
      desc: 'Our AI engine reads the CV, compares it to the job requirements, and produces a match score instantly.',
      icon: 'psychology',
    },
    {
      title: 'Recruiters act with confidence',
      desc: 'Applications are ranked by score with strengths and missing skills, so recruiters can shortlist and invite faster.',
      icon: 'fact_check',
    },
  ];

  testimonials = [
    {
      quote:
        'The AI scoring gave us a shortlist in minutes instead of days. Our first hire through SmartJob started two weeks later.',
      name: 'Amine K.',
      role: 'Talent Lead, Nova Systems',
    },
    {
      quote:
        'I finally understood why my applications weren\u2019t landing interviews — the missing-skills feedback was a game changer.',
      name: 'Sarah B.',
      role: 'Frontend Developer',
    },
    {
      quote:
        'Clean, fast, and the ranking dashboard makes reviewing fifty applicants feel like reviewing five.',
      name: 'Youssef T.',
      role: 'HR Manager, Deltacom',
    },
  ];
}
