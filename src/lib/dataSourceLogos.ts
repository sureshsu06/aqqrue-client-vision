export interface DataSourceLogo {
  id: string;
  name: string;
  logoPath: string;
  altText: string;
  description: string;
}

export const dataSourceLogos: DataSourceLogo[] = [
  {
    id: 'rippling',
    name: 'Rippling',
    logoPath: '/logos/data-sources/rippling.jpg',
    altText: 'Rippling',
    description: 'HR and payroll data'
  },
  {
    id: 'stripe',
    name: 'Stripe',
    logoPath: '/logos/data-sources/Stripe_Logo,_revised_2016.svg.png',
    altText: 'Stripe',
    description: 'Payment processing data'
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    logoPath: '/logos/data-sources/4844517.png',
    altText: 'HubSpot',
    description: 'CRM and marketing data'
  },
  {
    id: 'brex',
    name: 'Brex',
    logoPath: '/logos/data-sources/brex.png',
    altText: 'Brex',
    description: 'Corporate card and expense data'
  },
  {
    id: 'aws',
    name: 'AWS',
    logoPath: '/logos/data-sources/Amazon_Web_Services_Logo.svg.png',
    altText: 'AWS',
    description: 'Cloud infrastructure costs'
  }
];

export const getDataSourceLogo = (sourceId: string): DataSourceLogo | undefined => {
  return dataSourceLogos.find(logo => logo.id === sourceId);
};

export const getDataSourceLogoBySource = (source: string): DataSourceLogo | undefined => {
  const sourceLower = source.toLowerCase();
  
  if (sourceLower.includes('rippling')) {
    return getDataSourceLogo('rippling');
  }
  if (sourceLower.includes('stripe')) {
    return getDataSourceLogo('stripe');
  }
  if (sourceLower.includes('hubspot')) {
    return getDataSourceLogo('hubspot');
  }
  if (sourceLower.includes('brex')) {
    return getDataSourceLogo('brex');
  }
  if (sourceLower.includes('aws')) {
    return getDataSourceLogo('aws');
  }
  
  return undefined;
};
