
document.addEventListener("DOMContentLoaded", (_event) => {
  const loginButton = document.getElementById("loginButton");
  const registerButton = document.getElementById("registerButton");

  loginButton.addEventListener("click", attemptLogin);
  registerButton.addEventListener("click", attemptRegister);

  async function attemptLogin(e) {
    e.preventDefault();
    const username = document.getElementById("uname").value;
    const password = document.getElementById("password").value; 

    if (!username || !password) {
      window.alert("Please enter a valid username and password");
    } else {
      const res = await fetch('/authenticate',{
       method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }), 
      })
      if (res.status === 200){
        const { token } = await res.json();
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('user', username);
        location.href = `/chatroom?uname=${username}`;
      } else if( res.status === 403){
        window.alert("Incorrect username or password");
      }
    }
  }

  async function attemptRegister(e) {
    e.preventDefault();
    const username = document.getElementById("uname").value;
    const password = document.getElementById("password").value; 

    if (!username || !password) {
      window.alert("Please enter a valid username and password!");
    } else {
      const res = await fetch('/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      })
      if (res.status === 201) {
        const { token } = await res.json();
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('user', username); 
        location.href = `/chatroom?uname=${username}`;
      } else {
        window.alert("Could not create user, user may already exist");
      }
    }
  }
});
