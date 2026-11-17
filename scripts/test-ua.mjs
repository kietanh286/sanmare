async function testMobileUA() {
  const url = 'https://shorten.asia/u4PVMfza';
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
    },
    redirect: 'follow',
  });
  console.log('Final URL:', res.url);
  console.log('Status:', res.status);
  const text = await res.text();
  console.log('Body length:', text.length);
  console.log('Body preview:', text.slice(0, 300));
}

testMobileUA();
