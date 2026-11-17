import { resolveMultiPlatformLink } from '../src/lib/platforms/resolver.ts';

async function testPlatforms() {
  console.log('--- TEST ĐA SÀN ---');

  const shopee = await resolveMultiPlatformLink('https://shopee.vn/product/12345/67890');
  console.log('Shopee platform:', shopee.platform, '| Deeplink:', shopee.deeplinkUrl);

  const lazada = await resolveMultiPlatformLink('https://www.lazada.vn/products/ao-thun-i123456-s789101.html');
  console.log('Lazada platform:', lazada.platform, '| Deeplink:', lazada.deeplinkUrl);

  const tiktok = await resolveMultiPlatformLink('https://vt.tiktok.com/ZS23xyz/');
  console.log('TikTok platform:', tiktok.platform, '| Deeplink:', tiktok.deeplinkUrl);

  console.log('--- TEST HOÀN TẤT ---');
}

testPlatforms().catch(console.error);
