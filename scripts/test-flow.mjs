import { resolveShopeeProduct } from '../src/lib/shopee/resolver.js';
import { createAffiliateLinks } from '../src/lib/shopee/affiliate.js';

async function testFlow() {
  console.log('--- TEST BẮT ĐẦU ---');
  const sampleUrl = 'https://shopee.vn/Ao-Thun-Cotton-Nam-Nu-i.24810293.1892019283';
  console.log('1. Input URL:', sampleUrl);

  const resolved = await resolveShopeeProduct(sampleUrl);
  console.log('2. Resolved Product:', resolved);

  if (!resolved.isValid || !resolved.itemId || !resolved.shopId) {
    throw new Error('Resolver thất bại');
  }

  const affiliate = await createAffiliateLinks(
    resolved.canonicalUrl,
    resolved.shopId,
    resolved.itemId,
    'test_user'
  );
  console.log('3. Affiliate Links:', affiliate);

  if (!affiliate.deeplinkUrl.includes('shopeevn://product')) {
    throw new Error('Deeplink không đúng định dạng');
  }

  console.log('--- TEST THÀNH CÔNG 100% ---');
}

testFlow().catch(console.error);
