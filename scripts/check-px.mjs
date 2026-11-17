async function checkPXMfUGur() {
  const url = 'https://shorten.asia/PXMfUGur';
  const res = await fetch(url, { redirect: 'manual' });
  console.log('Status:', res.status);
  console.log('Location:', res.headers.get('location'));
}

checkPXMfUGur();
