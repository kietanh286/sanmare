import test from 'node:test';
import assert from 'node:assert';
import { isShopeeUrl, extractShopeeProductInfo } from './resolver.ts';

test('isShopeeUrl nhận diện chính xác các tên miền Shopee', () => {
  assert.strictEqual(isShopeeUrl('https://shopee.vn/product/123/456'), true);
  assert.strictEqual(isShopeeUrl('https://s.shopee.vn/xyz890'), true);
  assert.strictEqual(isShopeeUrl('https://shope.ee/test123'), true);
  assert.strictEqual(isShopeeUrl('https://vn.shp.ee/abc'), true);
  assert.strictEqual(isShopeeUrl('https://google.com'), false);
  assert.strictEqual(isShopeeUrl('not a url'), false);
});

test('extractShopeeProductInfo trích xuất chuẩn định dạng -i.shopId.itemId', () => {
  const url = 'https://shopee.vn/Ao-Thun-Cotton-Nam-Nu-i.24810293.1892019283';
  const info = extractShopeeProductInfo(url);
  assert.strictEqual(info.shopId, '24810293');
  assert.strictEqual(info.itemId, '1892019283');
  assert.strictEqual(info.productName, 'Ao Thun Cotton Nam Nu');
});

test('extractShopeeProductInfo trích xuất chuẩn định dạng /product/shopId/itemId', () => {
  const url = 'https://shopee.vn/product/998877/11223344';
  const info = extractShopeeProductInfo(url);
  assert.strictEqual(info.shopId, '998877');
  assert.strictEqual(info.itemId, '11223344');
});
