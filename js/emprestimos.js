async function saveKey() { 
  const url = "./post.php"
  const password = document.getElementById('loginForm');
  console.log(password);
  const data = await fetch(url, {
    method: "POST",
    headers: {
      'password': password,
    },
    body: JSON.stringify({
      'action': 'read',
    }),
  })
  console.log(data);
}
