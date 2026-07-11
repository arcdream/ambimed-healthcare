import { templates } from './seoServiceTemplates'

/**
 * 20 SEO landing pages — each targets a primary keyword with a dedicated URL.
 * City pages use format: /{slug}-{city} e.g. /home-nurse-services-gurugram
 */
const pageDefs = [
  {
    slug: 'home-nurse-services',
    template: 'homeNursing',
    title: 'Home Nurse Services',
    shortTitle: 'Home Nurse',
    primaryKeyword: 'home nurse services',
    heroTagline: 'Skilled home nurse services in the comfort of your home.',
    heroHighlight: ['Nurse', 'Services'],
    metaDescriptionBase: 'Certified home nurse services for post-surgery care, wound dressing, injections, and daily nursing support. Background-verified professionals across India.',
    relatedLinks: ['home-nursing-near-me', 'home-care-nurse', 'patient-care-at-home', 'icu-care-at-home'],
  },
  {
    slug: 'home-nursing-near-me',
    template: 'homeNursing',
    title: 'Home Nursing Services Near Me',
    shortTitle: 'Home Nursing Near Me',
    primaryKeyword: 'home nursing services near me',
    heroTagline: 'Find trusted home nursing services near you — fast booking, verified nurses.',
    heroHighlight: ['Near', 'Me'],
    metaDescriptionBase: 'Looking for home nursing services near you? Ambimed deploys verified nurses within hours across Delhi, Gurgaon, Noida, Bengaluru, Mumbai, and 12+ cities.',
    relatedLinks: ['home-nurse-services', 'home-care-nurse', 'home-healthcare-services'],
  },
  {
    slug: 'home-care-nurse',
    template: 'homeNursing',
    title: 'Home Care Nurse',
    shortTitle: 'Home Care Nurse',
    primaryKeyword: 'home care nurse',
    heroTagline: 'Professional home care nurses for personalised patient support.',
    heroHighlight: ['Care', 'Nurse'],
    metaDescriptionBase: 'Hire a qualified home care nurse for injections, wound care, vitals monitoring, and post-surgery recovery. Verified, trained nurses at your doorstep.',
    relatedLinks: ['home-nurse-services', 'patient-care-at-home', 'icu-care-at-home'],
  },
  {
    slug: 'patient-care-at-home',
    template: 'patientCare',
    title: 'Patient Care at Home',
    shortTitle: 'Patient Care',
    primaryKeyword: 'patient care at home',
    heroTagline: 'Dedicated patient care tailored to your recovery needs.',
    heroHighlight: ['Patient', 'Care'],
    metaDescriptionBase: 'Comprehensive patient care at home — daily assistance, health monitoring, hygiene, and emotional support for recovery and long-term care.',
    relatedLinks: ['home-nurse-services', 'icu-care-at-home', 'home-attendant-services'],
  },
  {
    slug: 'icu-care-at-home',
    template: 'icuCare',
    title: 'ICU Care at Home',
    shortTitle: 'ICU Care',
    primaryKeyword: 'icu care at home',
    heroTagline: 'Hospital-level critical care in the comfort of home.',
    heroHighlight: ['ICU', 'Care'],
    metaDescriptionBase: 'ICU-level care at home with critical care nurses, ventilator support, continuous monitoring, and 24/7 medical supervision.',
    relatedLinks: ['patient-care-at-home', 'home-nurse-services', 'home-care-nurse'],
  },
  {
    slug: 'caregiver-services',
    template: 'caregiver',
    title: 'Caregiver Services',
    shortTitle: 'Caregiver',
    primaryKeyword: 'caregiver services',
    heroTagline: 'Compassionate caregiver services at home.',
    heroHighlight: ['Caregiver', 'Services'],
    metaDescriptionBase: 'Trained and verified caregiver services for personal care, companionship, mobility assistance, and daily living support at home.',
    relatedLinks: ['home-caregiver', 'general-duty-assistant', 'elder-care-services'],
  },
  {
    slug: 'general-duty-assistant',
    template: 'attendant',
    title: 'General Duty Assistant (GDA)',
    shortTitle: 'GDA',
    primaryKeyword: 'general duty assistant',
    heroTagline: 'Reliable General Duty Assistants for patient support at home.',
    heroHighlight: ['GDA', 'Services'],
    metaDescriptionBase: 'Hire a trained General Duty Assistant (GDA) for patient care, hospital discharge support, and daily living assistance at home.',
    relatedLinks: ['caregiver-services', 'home-attendant-services', 'patient-care-at-home'],
  },
  {
    slug: 'home-caregiver',
    template: 'caregiver',
    title: 'Home Caregiver',
    shortTitle: 'Home Caregiver',
    primaryKeyword: 'home caregiver',
    heroTagline: 'Trusted home caregivers for your family\'s daily care needs.',
    heroHighlight: ['Home', 'Caregiver'],
    metaDescriptionBase: 'Professional home caregivers for personal care, meal preparation, companionship, and mobility assistance. Verified and background-checked.',
    relatedLinks: ['caregiver-services', 'elder-care-services', 'senior-citizen-care'],
  },
  {
    slug: 'elder-care-services',
    template: 'elderCare',
    title: 'Elder Care Services',
    shortTitle: 'Elder Care',
    primaryKeyword: 'elder care services',
    heroTagline: 'Compassionate elder care services for your loved ones at home.',
    heroHighlight: ['Elder', 'Care'],
    metaDescriptionBase: 'Professional elder care services — daily assistance, companionship, mobility support, and medication reminders by verified caregivers.',
    relatedLinks: ['senior-citizen-care', 'home-caregiver', 'caregiver-services'],
  },
  {
    slug: 'senior-citizen-care',
    template: 'elderCare',
    title: 'Senior Citizen Care at Home',
    shortTitle: 'Senior Care',
    primaryKeyword: 'senior citizen care at home',
    heroTagline: 'Dedicated senior citizen care with dignity and compassion.',
    heroHighlight: ['Senior', 'Care'],
    metaDescriptionBase: 'Specialised senior citizen care at home — personal care, companionship, fall prevention, and medication support for ageing parents.',
    relatedLinks: ['elder-care-services', 'home-caregiver', 'caregiver-services'],
  },
  {
    slug: 'home-attendant-services',
    template: 'attendant',
    title: 'Home Attendant Services',
    shortTitle: 'Home Attendant',
    primaryKeyword: 'home attendant services',
    heroTagline: 'Reliable home attendants for patient support and supervision.',
    heroHighlight: ['Attendant', 'Services'],
    metaDescriptionBase: 'Trained home attendants for hospital discharge support, patient companionship, night watch, and daily care at home.',
    relatedLinks: ['general-duty-assistant', 'patient-care-at-home', 'caregiver-services'],
  },
  {
    slug: 'mother-and-baby-care',
    template: 'motherBaby',
    title: 'Mother & Baby Care',
    shortTitle: 'Mother & Baby Care',
    primaryKeyword: 'mother and baby care',
    heroTagline: 'Expert care for a healthy mother. Happy, healthy baby.',
    heroHighlight: ['Care', 'Services'],
    metaDescriptionBase: 'Postnatal care, newborn baby care, breastfeeding support, and mother wellness by experienced nurses and caregivers at home.',
    relatedLinks: ['japa-care-services', 'post-delivery-care', 'newborn-baby-care'],
  },
  {
    slug: 'japa-care-services',
    template: 'motherBaby',
    title: 'Japa Care Services',
    shortTitle: 'Japa Care',
    primaryKeyword: 'japa care services',
    heroTagline: 'Traditional japa care with modern hygiene standards.',
    heroHighlight: ['Japa', 'Care'],
    metaDescriptionBase: 'Professional japa care services for new mothers — postnatal recovery, newborn care, traditional practices, and household support.',
    relatedLinks: ['mother-and-baby-care', 'post-delivery-care', 'newborn-baby-care'],
  },
  {
    slug: 'post-delivery-care',
    template: 'motherBaby',
    title: 'Post Delivery Care at Home',
    shortTitle: 'Post Delivery Care',
    primaryKeyword: 'post delivery care at home',
    heroTagline: 'Gentle post delivery care for mothers recovering at home.',
    heroHighlight: ['Post', 'Delivery'],
    metaDescriptionBase: 'Post delivery care at home — recovery support, wound care, nutrition, breastfeeding help, and newborn assistance for new mothers.',
    relatedLinks: ['mother-and-baby-care', 'newborn-baby-care', 'japa-care-services'],
  },
  {
    slug: 'newborn-baby-care',
    template: 'motherBaby',
    title: 'Newborn Baby Care',
    shortTitle: 'Newborn Care',
    primaryKeyword: 'newborn baby care',
    heroTagline: 'Expert newborn baby care for your precious little one.',
    heroHighlight: ['Newborn', 'Care'],
    metaDescriptionBase: 'Professional newborn baby care — bathing, feeding, sleep routines, umbilical care, and developmental support by experienced nurses.',
    relatedLinks: ['mother-and-baby-care', 'post-delivery-care', 'japa-care-services'],
  },
  {
    slug: 'home-physiotherapy-services',
    template: 'physiotherapy',
    title: 'Home Physiotherapy Services',
    shortTitle: 'Home Physiotherapy',
    primaryKeyword: 'home physiotherapy services',
    heroTagline: 'Recover faster with expert physiotherapy at home.',
    heroHighlight: ['Physio', 'therapy'],
    metaDescriptionBase: 'Licensed physiotherapists for stroke recovery, post-surgery rehab, sports injuries, and mobility improvement — at your home.',
    relatedLinks: ['physiotherapist-at-home', 'rehabilitation-at-home', 'patient-care-at-home'],
  },
  {
    slug: 'physiotherapist-at-home',
    template: 'physiotherapy',
    title: 'Physiotherapist at Home',
    shortTitle: 'Physiotherapist',
    primaryKeyword: 'physiotherapist at home',
    heroTagline: 'Book a licensed physiotherapist to visit your home.',
    heroHighlight: ['Physio', 'therapist'],
    metaDescriptionBase: 'Book a qualified physiotherapist at home for pain relief, post-surgery rehabilitation, stroke recovery, and mobility exercises.',
    relatedLinks: ['home-physiotherapy-services', 'rehabilitation-at-home'],
  },
  {
    slug: 'rehabilitation-at-home',
    template: 'physiotherapy',
    title: 'Rehabilitation at Home',
    shortTitle: 'Rehabilitation',
    primaryKeyword: 'rehabilitation at home',
    heroTagline: 'Complete rehabilitation programs in the comfort of home.',
    heroHighlight: ['Rehab', 'ilitation'],
    metaDescriptionBase: 'Home rehabilitation services for stroke, surgery, sports injuries, and neurological conditions. Personalised recovery programs by licensed therapists.',
    relatedLinks: ['home-physiotherapy-services', 'physiotherapist-at-home', 'patient-care-at-home'],
  },
  {
    slug: 'home-healthcare-services',
    template: 'homeHealthcare',
    title: 'Home Healthcare Services',
    shortTitle: 'Home Healthcare',
    primaryKeyword: 'home healthcare services',
    heroTagline: 'Complete home healthcare services for your entire family.',
    heroHighlight: ['Healthcare', 'Services'],
    metaDescriptionBase: 'Full-range home healthcare services — nursing, elder care, physiotherapy, mother & baby care, ICU care, and patient care across India.',
    relatedLinks: ['best-home-healthcare-company', 'home-nurse-services', 'elder-care-services', 'caregiver-services'],
  },
  {
    slug: 'best-home-healthcare-company',
    template: 'company',
    title: 'Best Home Healthcare Company',
    shortTitle: 'Ambimed',
    primaryKeyword: 'best home healthcare company',
    heroTagline: 'India\'s most trusted home healthcare company — 25,000+ families served.',
    heroHighlight: ['Best', 'Healthcare'],
    metaDescriptionBase: 'Ambimed is India\'s best home healthcare company — verified nurses, caregivers, and therapists across 12+ cities. Book trusted care at home today.',
    relatedLinks: ['home-healthcare-services', 'home-nurse-services', 'elder-care-services', 'caregiver-services'],
  },
]

function createSeoPage(def) {
  const base = templates[def.template]
  if (!base) throw new Error(`Unknown template: ${def.template}`)
  return { ...base, ...def }
}

export const seoServices = pageDefs.map(createSeoPage)

/** All valid service slugs for routing */
export const serviceSlugs = seoServices.map((s) => s.slug)

export function getServiceBySlug(slug) {
  return seoServices.find((s) => s.slug === slug) ?? null
}

export function getRelatedServices(slugs) {
  return slugs.map((s) => getServiceBySlug(s)).filter(Boolean)
}

/** Homepage cards — one per core category */
export function getHomepageServices() {
  const homepageSlugs = [
    'home-nurse-services',
    'elder-care-services',
    'home-physiotherapy-services',
    'mother-and-baby-care',
  ]
  return homepageSlugs.map((slug) => getServiceBySlug(slug)).filter(Boolean)
}
