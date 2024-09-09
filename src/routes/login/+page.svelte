<script>
  import axios from 'axios';
  import { fly, fade } from 'svelte/transition';
  import { isLoggedInStore ,usernameStore} from '$lib/stores';
	import { goto } from '$app/navigation';
  let username = '';
  let password = '';

  let usernameError = '';
  let passwordError = '';
  let generalError = '';

  let isSuccess = false;

  async function loginUser() {
    usernameError = '';
    passwordError = '';
    generalError = '';
    isSuccess = false;

    try {
      const response = await axios.post('http://localhost:8000/auth/login',{
        username,
        password
      },{withCredentials: true});

      if (response.data.status === 'success') {
        isSuccess = true;
        username = '';
        password = '';
        isLoggedInStore.set(true);
        usernameStore.set(response.data.data.username);
        goto("/upload");
      } 
      else if (response.data.status === 'fail') {
        const errors = response.data.data;

        if (errors.username) {
          usernameError = errors.username;
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
    <h2>Login successfull!</h2>
  </div>
{:else}
  <form on:submit|preventDefault={loginUser} class="register-form">
    <div class="form-group">
      <label for="username">Username:</label>
      <input type="text" id="username" bind:value={username} class="input-field" />
      {#if usernameError}
        <p class="error" transition:fly={{ y: 10 }}>{usernameError}</p>
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
