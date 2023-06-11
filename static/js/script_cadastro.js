document.addEventListener("DOMContentLoaded", function() {
  const createAccountLink = document.getElementById("create-account-link");
  const loginForm = document.querySelector(".login-container");
  const registerForm = document.querySelector(".register-container");
  const loginLink = document.getElementById("login_form");
  const registerButton = document.getElementById("register");
  const passwordInput = document.getElementById("password_register");
  const confirmPasswordInput = document.getElementById("confirm_register");

  createAccountLink.addEventListener("click", function(e) {
    e.preventDefault();
    loginForm.classList.add("hidden");
    registerForm.classList.remove("hidden");
  });

  loginLink.addEventListener("click", function(e) {
    e.preventDefault();
    registerForm.classList.add("hidden");
    loginForm.classList.remove("hidden");
  });

  registerButton.addEventListener("click", function(e) {
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (password !== confirmPassword) {
      e.preventDefault();
      alert("As senhas não correspondem. Por favor, tente novamente.");
    } else {
      // Realiza uma requisição POST para a rota '/cadastro' com os dados do formulário
      const username = document.getElementById("username_register").value;
      const address = document.getElementById("address").value;

      const data = {
        username: username,
        password: password,
        address: address
      };

      fetch("/cadastro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })
        .then(response => response.text())
        .then(message => {
          alert(message);
          window.location.href = "/"; // Redireciona para a página de login após o cadastro
        })
        .catch(error => {
          console.error("Erro ao cadastrar usuário:", error);
        });
    }
  });
});
