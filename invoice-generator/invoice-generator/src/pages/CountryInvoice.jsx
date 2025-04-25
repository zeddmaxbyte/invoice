import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import InvoiceGenerator from './InvoiceGenerator';
import countryData from '../utils/countryData';

const CountryInvoice = ({ country }) => {
  const countryInfo = countryData[country] || countryData.usa;

  // Set document title and meta description
  useEffect(() => {
    document.title = countryInfo.metaTitle;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', countryInfo.metaDescription);
    }
  }, [countryInfo]);

  return (
    <div>
      {/* SEO Metadata */}
      <Helmet>
        <title>{countryInfo.metaTitle}</title>
        <meta name="description" content={countryInfo.metaDescription} />
        <meta property="og:title" content={countryInfo.metaTitle} />
        <meta property="og:description" content={countryInfo.metaDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://invoice-generator.com/${country}-invoice-generator`} />
      </Helmet>

      {/* Country-specific content */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center mb-4">{countryInfo.h1}</h1>
        <p className="text-center text-gray-600 max-w-3xl mx-auto mb-8">
          {countryInfo.intro}
        </p>
      </div>

      {/* Invoice Generator with country pre-selected */}
      <InvoiceGenerator defaultCountry={country} />
    </div>
  );
};

export default CountryInvoice;
