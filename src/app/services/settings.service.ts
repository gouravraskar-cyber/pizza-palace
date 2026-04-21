import { Injectable, signal, NgZone, inject } from '@angular/core';

export interface SocialLink {
  id?: number;
  name: string;
  icon: string;
  url: string;
  is_active: boolean;
  sort_order: number;
}

export interface QuickLink {
  id?: number;
  label: string;
  url: string;
  is_active: boolean;
  sort_order: number;
}

export interface ContactInfo {
  id?: number;
  address: string;
  phone: string;
  email: string;
  tagline: string;
}

export interface SiteSettings {
  socialLinks: SocialLink[];
  quickLinks: QuickLink[];
  contactInfo: ContactInfo;
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private ngZone = inject(NgZone);

  // Signals for reactive data
  private socialLinks = signal<SocialLink[]>([]);
  private quickLinks = signal<QuickLink[]>([]);
  private contactInfo = signal<ContactInfo>({
    address: '',
    phone: '',
    email: '',
    tagline: ''
  });
  private isLoading = signal<boolean>(false);

  // Public readonly signals
  readonly socialLinksData = this.socialLinks.asReadonly();
  readonly quickLinksData = this.quickLinks.asReadonly();
  readonly contactInfoData = this.contactInfo.asReadonly();
  readonly loading = this.isLoading.asReadonly();

  // Default fallback data
  private defaultSocialLinks: SocialLink[] = [
    { name: 'Facebook', icon: 'facebook', url: '#', is_active: true, sort_order: 1 },
    { name: 'Instagram', icon: 'instagram', url: '#', is_active: true, sort_order: 2 },
    { name: 'Twitter', icon: 'twitter', url: '#', is_active: true, sort_order: 3 },
    { name: 'TikTok', icon: 'tiktok', url: '#', is_active: true, sort_order: 4 }
  ];

  private defaultQuickLinks: QuickLink[] = [
    { label: 'Home', url: '#', is_active: true, sort_order: 1 },
    { label: 'Menu', url: '#menu', is_active: true, sort_order: 2 },
    { label: 'About Us', url: '#about', is_active: true, sort_order: 3 },
    { label: 'Contact', url: '#contact', is_active: true, sort_order: 4 }
  ];

  private defaultContactInfo: ContactInfo = {
    address: '123 Pizza Street, Food City, FC 12345',
    phone: '+1 (555) 123-4567',
    email: 'hello@pizzapalace.com',
    tagline: 'Crafting authentic pizzas since 1985. Quality ingredients, traditional recipes, unforgettable taste.'
  };

  constructor() {
    this.loadAllSettings();
  }

  async loadAllSettings(): Promise<void> {
    this.isLoading.set(true);
    
    await Promise.all([
      this.loadSocialLinks(),
      this.loadQuickLinks(),
      this.loadContactInfo()
    ]);

    this.isLoading.set(false);
  }

  private async loadSocialLinks(): Promise<void> {
    try {
      this.ngZone.run(() => {
        this.socialLinks.set(this.defaultSocialLinks);
      });
    } catch (err: any) {
      console.error('Error loading social links:', err);
      this.ngZone.run(() => {
        this.socialLinks.set(this.defaultSocialLinks);
      });
    }
  }

  private async loadQuickLinks(): Promise<void> {
    try {
      this.ngZone.run(() => {
        this.quickLinks.set(this.defaultQuickLinks);
      });
    } catch (err: any) {
      console.error('Error loading quick links:', err);
      this.ngZone.run(() => {
        this.quickLinks.set(this.defaultQuickLinks);
      });
    }
  }

  private async loadContactInfo(): Promise<void> {
    try {
      this.ngZone.run(() => {
        this.contactInfo.set(this.defaultContactInfo);
      });
    } catch (err: any) {
      console.error('Error loading contact info:', err);
      this.ngZone.run(() => {
        this.contactInfo.set(this.defaultContactInfo);
      });
    }
  }

  async refreshSettings(): Promise<void> {
    await this.loadAllSettings();
  }
}

