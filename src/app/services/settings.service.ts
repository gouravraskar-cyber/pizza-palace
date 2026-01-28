import { Injectable, inject, signal, NgZone } from '@angular/core';
import { SupabaseService } from './supabase.service';

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
  private supabaseService = inject(SupabaseService);
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
      const { data, error } = await this.supabaseService.client
        .from('social_links')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;

      this.ngZone.run(() => {
        if (data && data.length > 0) {
          this.socialLinks.set(data);
          console.log('Loaded social links from Supabase:', data.length);
        } else {
          this.socialLinks.set(this.defaultSocialLinks);
        }
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
      const { data, error } = await this.supabaseService.client
        .from('quick_links')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;

      this.ngZone.run(() => {
        if (data && data.length > 0) {
          this.quickLinks.set(data);
          console.log('Loaded quick links from Supabase:', data.length);
        } else {
          this.quickLinks.set(this.defaultQuickLinks);
        }
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
      const { data, error } = await this.supabaseService.client
        .from('contact_info')
        .select('*')
        .limit(1)
        .single();

      if (error) throw error;

      this.ngZone.run(() => {
        if (data) {
          this.contactInfo.set(data);
          console.log('Loaded contact info from Supabase');
        } else {
          this.contactInfo.set(this.defaultContactInfo);
        }
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

