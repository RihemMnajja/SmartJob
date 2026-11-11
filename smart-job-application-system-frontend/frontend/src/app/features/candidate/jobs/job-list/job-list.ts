import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { JobOfferService } from '../../../../core/services';
import { JobOffer } from '../../../../core/models';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import { LoadingSpinner } from '../../../../shared/components/loading-spinner/loading-spinner';

const PAGE_SIZE = 9;

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [CommonModule, RouterLink, PageHeader, EmptyState, LoadingSpinner],
  templateUrl: './job-list.html',
})
export class JobList {
  private jobOfferService = inject(JobOfferService);

  loading = signal(true);
  offers = signal<JobOffer[]>([]);
  search = signal('');
  locationFilter = signal('');
  contractFilter = signal('');
  page = signal(1);

  locations = computed(() => Array.from(new Set(this.offers().map((o) => o.location).filter(Boolean))));
  contractTypes = computed(() => Array.from(new Set(this.offers().map((o) => o.contractType).filter(Boolean))));

  filtered = computed(() => {
    const term = this.search().trim().toLowerCase();
    const loc = this.locationFilter();
    const contract = this.contractFilter();

    return this.offers().filter((o) => {
      const matchesTerm =
        !term ||
        o.title?.toLowerCase().includes(term) ||
        o.description?.toLowerCase().includes(term) ||
        o.requiredSkills?.toLowerCase().includes(term) ||
        o.recruiter?.companyName?.toLowerCase().includes(term);
      const matchesLoc = !loc || o.location === loc;
      const matchesContract = !contract || o.contractType === contract;
      return matchesTerm && matchesLoc && matchesContract;
    });
  });

  totalPages = computed(() => Math.max(1, Math.ceil(this.filtered().length / PAGE_SIZE)));

  pageNumbers = computed(() => Array.from({ length: this.totalPages() }, (_, i) => i + 1));

  paged = computed(() => {
    const start = (this.page() - 1) * PAGE_SIZE;
    return this.filtered().slice(start, start + PAGE_SIZE);
  });

  constructor() {
    this.jobOfferService.getAll().subscribe({
      next: (offers) => {
        this.offers.set(offers);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  onSearchChange(value: string): void {
    this.search.set(value);
    this.page.set(1);
  }

  onLocationChange(value: string): void {
    this.locationFilter.set(value);
    this.page.set(1);
  }

  onContractChange(value: string): void {
    this.contractFilter.set(value);
    this.page.set(1);
  }

  goToPage(p: number): void {
    if (p < 1 || p > this.totalPages()) return;
    this.page.set(p);
  }
}
