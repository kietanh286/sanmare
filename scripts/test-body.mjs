async function testShortLink() {
  const url = 'https://shorten.asia/u4PVMfza';
  const res = await fetch(url);
  console.log('Status:', res.status);
  const text = await res.text();
  console.log('Body:', text);
}

testShortLink();
