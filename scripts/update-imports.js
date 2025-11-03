const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'app/components/WhatsappEnquiry.tsx',
  'app/components/Navbar.tsx',
  'app/components/GetQuote.tsx',
  'app/components/MailEnquiry.tsx',
  'app/components/Home/Testimonial.tsx',
  'app/(site)/[locale]/terms-of-service/page.tsx',
  'app/components/Home/ContactForms.tsx',
  'app/components/Home/OfferingsPage.tsx',
  'app/components/Home/Services.tsx',
  'app/components/Home/HeroSection.tsx',
  'app/(site)/[locale]/not-found.tsx',
  'app/components/GetQuoteButton.tsx',
  'app/(site)/[locale]/about-us/page.tsx',
  'app/(site)/[locale]/privacy-policy/page.tsx',
];

filesToUpdate.forEach(filePath => {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Replace next-intl imports with custom provider
    content = content.replace(/from ['"]next-intl['"]/g, 'from "@/i18n/provider"');
    
    // Replace useMessages with a note (we'll need to handle this separately)
    if (content.includes('useMessages')) {
      console.log(`Warning: ${filePath} uses useMessages - may need manual update`);
    }
    
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✓ Updated ${filePath}`);
  } catch (error) {
    console.error(`✗ Error updating ${filePath}:`, error.message);
  }
});

console.log('\nDone!');
