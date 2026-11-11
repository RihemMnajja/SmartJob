import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BrandLogo } from '../brand-logo/brand-logo';

@Component({
  selector: 'app-public-footer',
  standalone: true,
  imports: [RouterLink, BrandLogo],
  template: `
    <footer class="border-t border-ink-100 bg-ink-900 text-ink-200">
      <div class="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div class="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div class="col-span-2">
            <app-brand-logo [mark]="36" textClass="text-lg text-white" />
            <p class="mt-4 max-w-xs text-sm text-ink-400">
              The AI-powered platform that matches candidates and recruiters based on real skills, not keywords.
            </p>
          </div>

          <div>
            <h4 class="font-display text-sm font-semibold text-white">Candidates</h4>
            <ul class="mt-4 space-y-3 text-sm">
              <li><a routerLink="/auth/register/candidate" class="hover:text-white">Create account</a></li>
              <li><a routerLink="/auth/login" class="hover:text-white">Sign in</a></li>
              <li><a href="#features" class="hover:text-white">Browse jobs</a></li>
            </ul>
          </div>

          <div>
            <h4 class="font-display text-sm font-semibold text-white">Recruiters</h4>
            <ul class="mt-4 space-y-3 text-sm">
              <li><a routerLink="/auth/register/recruiter" class="hover:text-white">Post a job</a></li>
              <li><a routerLink="/auth/login" class="hover:text-white">Recruiter login</a></li>
              <li><a href="#ai" class="hover:text-white">AI candidate ranking</a></li>
            </ul>
          </div>

          <div>
            <h4 class="font-display text-sm font-semibold text-white">Company</h4>
            <ul class="mt-4 space-y-3 text-sm">
              <li><a href="#how-it-works" class="hover:text-white">How it works</a></li>
              <li><a href="#testimonials" class="hover:text-white">Testimonials</a></li>
            </ul>
          </div>
        </div>

        <div class="mt-12 flex flex-col items-center justify-between gap-4 border-t border-ink-700/60 pt-8 text-xs text-ink-400 sm:flex-row">
          <p>&copy; {{ year }} SmartJob. Graduation project — Smart Job Application System.</p>
          <p>Built with Angular · Spring Boot · PostgreSQL</p>
        </div>
      </div>
    </footer>
  `,
})
export class PublicFooter {
  year = new Date().getFullYear();
}
