export const siteContentDefaults = {
  heroLineOne: "WE DON'T JUST CREATE CONTENT.",
  heroLineTwo: 'WE BUILD BRANDS.',
  servicesLineOne: "WE DON'T JUST CREATE CONTENT.",
  servicesLineTwo: 'WE BUILD BRANDS.',
  showreelLabel: 'SHOWREEL',
  selectedWorkLabel: 'SELECTED WORK',
  selectedWorkHeading: "SOME OF THE THINGS WE'VE CREATED.",
  clientsLabel: 'CLIENTS / LOGOS',
  whyLabel: 'WHY RISING MEDIA WORKS',
  founderLabel: 'FOUNDER',
  testimonialsLabel: 'TESTIMONIALS',
  processLabel: 'PROCESS',
  footerTagline: 'We Don’t Just Create Content. We Build Brands.',
  categories: {
    automotive: 'AUTOMOTIVE',
    product: 'PRODUCT',
    branding: 'BRANDING',
    corporate: 'CORPORATE'
  }
};

const storageKey = 'rmw_site_content';

export const getSiteContent = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
    return {
      ...siteContentDefaults,
      ...saved,
      categories: { ...siteContentDefaults.categories, ...(saved.categories || {}) }
    };
  } catch {
    return siteContentDefaults;
  }
};

export const saveSiteContent = (content) => {
  localStorage.setItem(storageKey, JSON.stringify(content));
  window.dispatchEvent(new Event('rmw-site-content-updated'));
};

export const resetSiteContent = () => {
  localStorage.removeItem(storageKey);
  window.dispatchEvent(new Event('rmw-site-content-updated'));
};
