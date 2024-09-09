<script>
	import { goto } from '$app/navigation';
  import axios from 'axios';
  import { fly, fade } from 'svelte/transition';
  
  let username = '';
  let email = '';
  let password = '';

  let usernameError = '';
  let emailError = '';
  let passwordError = '';
  let generalError = '';

  let isSuccess = false;

  async function registerUser() {
    usernameError = '';
    emailError = '';
    passwordError = '';
    generalError = '';
    isSuccess = false;

    try {
      const response = await axios.post('http://localhost:8000/auth/register', {
        username,
        email,
        password
      });

      if (response.data.status === 'success') {
        isSuccess = true;
        username = '';
        email = '';
        password = '';
      } 
      else if (response.data.status === 'fail') {
        const errors = response.data.data;

        if (errors.username) {
          usernameError = errors.username;
        }
        if (errors.email) {
          emailError = errors.email;
        }
        if (errors.password) {
          passwordError = errors.password;
        }
      }
    } 
    catch (error) {
      generalError = 'Internal server error';
    }
  }
</script>

{#if isSuccess}
  <div class="success-message" transition:fade={{ duration: 500 }}>
    <h2>Registration Successful!</h2>
  </div>
{:else}
  <form on:submit|preventDefault={registerUser} class="register-form">
    <div class="form-group">
      <label for="username">Username:</label>
      <input type="text" id="username" bind:value={username} class="input-field" />
      {#if usernameError}
        <p class="error" transition:fly={{ y: 10 }}>{usernameError}</p>
      {/if}
    </div>

    <div class="form-group">
      <label for="email">Email:</label>
      <input type="email" id="email" bind:value={email} class="input-field" />
      {#if emailError}
        <p class="error" transition:fly={{ y: 10 }}>{emailError}</p>
      {/if}
    </div>

    <div class="form-group">
      <label for="password">Password:</label>
      <input type="password" id="password" bind:value={password} class="input-field" />
      {#if passwordError}
        <p class="error" transition:fly={{ y: 10 }}>{passwordError}</p>
      {/if}
    </div>

    {#if generalError}
      <p class="error general" transition:fly={{ y: 10 }}>{generalError}</p>
    {/if}

    <button type="submit" class="submit-button">Register</button>
  </form>
{/if}
