/**
 * Site-wide config – edit links and contact here for easy updates.
 */
export const config = {
  /** Canonical origin (no trailing slash). Must match public/sitemap.xml and robots.txt Sitemap URL. */
  siteUrl: 'https://www.ambimed.in',
  // Set to true to show the "Who we are" / About section; false to hide it
  showAboutSection: false,
  // Set to true to show the "Our team" section; false to hide it
  showTeamSection: false,
  // Replace with your Google Play Store app URL when ready
  clientAppUrl: '#',
  // Replace with your caregiver app URL when ready
  caregiverAppUrl: '#',
  // Optional: paths to QR code images in public/
  qrClientApp: '/assets/qr-placeholder.png',
  qrCaregiverApp: '/assets/qr-placeholder.png',
  contact: {
    phone: '+91- 9205868247',
    /** Digits only for wa.me links */
    whatsapp: '919205868247',
    email: 'info@ambimed.in',
    /** Short line under logo in Contact section */
    contactIntro:
      'We’ve built Ambimed to provide exceptional, reliable home healthcare across India—operating in multiple cities so more families can book trusted care at home.',
  },
  /** Cities where Ambimed operates (shown under “Cities Operating” in Contact) */
  citiesOperating: [
    'Delhi',
    'Bengaluru',
    'Kolkata',
    'Mumbai',
    'Ahmedabad',
    'Lucknow',
    'Chennai',
    'Noida',
    'Gurugram',
    'Ghaziabad',
    'Faridabad',
    'Pune',
  ],
  /**
   * Social profile URLs — use “ambimed” handles where applicable.
   * Replace # with real links when ready.
   */
  social: {
    facebook: 'https://www.facebook.com/ambimed',
    instagram: 'https://www.instagram.com/ambimed',
    x: 'https://x.com/ambimed',
    youtube: 'https://www.youtube.com/@ambimed',
    linkedin: 'https://www.linkedin.com/company/ambimed',
  },
  /** Privacy — replace with your live policy page when ready */
  privacyPolicyUrl: 'mailto:info@ambimed.in?subject=Privacy%20Policy',
}
