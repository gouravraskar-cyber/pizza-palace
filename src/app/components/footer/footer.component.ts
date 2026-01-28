import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  private settingsService = inject(SettingsService);

  currentYear = new Date().getFullYear();

  // Get data from settings service
  socialLinks = computed(() => this.settingsService.socialLinksData());
  quickLinks = computed(() => this.settingsService.quickLinksData());
  contactInfo = computed(() => this.settingsService.contactInfoData());
  isLoading = computed(() => this.settingsService.loading());
}


