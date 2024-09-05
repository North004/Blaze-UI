<script lang="ts">
	import { goto } from "$app/navigation";
	import axios from "axios";
	import { onMount } from "svelte";
  import { isLoggedInStore,usernameStore} from "$lib/stores";

  type Response = {
	username(username: any): unknown;
    status: string,
  };

  $: loggedIn= $isLoggedInStore;
  $: username = $usernameStore;
  async function logout() {
		try {
			// Corrected to use withCredentials in the config object
			const response = await axios.post('http://localhost:8000/auth/logout', {}, { withCredentials: true});

			// Optional: You might want to handle the response, e.g., redirecting after a successful logout
			if (response.status === 200) {
				// Redirect to the home page or login page after successful logout
        isLoggedInStore.set(false);
        usernameStore.set("");
			} else {
				console.error("Logout failed");
			}
		} catch (error) {
			console.error("Logout error", error);
		}
	}
  async function is_logged_in() {
    try {
      const response = await axios.post("http://localhost:8000/auth/status",{},{withCredentials: true});
      if (response.data.status == "success") {
        isLoggedInStore.set(true);
        usernameStore.set(response.data.data.username);
      }
      else {
        isLoggedInStore.set(false);

      }
    }
    catch (error) {
      console.error("error fetching isloggedout")
      isLoggedInStore.set(false);

    }
  
  }

  onMount(async ()  => {
    is_logged_in()
  })
</script>

<header>
  <nav>
    <a href="/" class="nav-link">Home</a>
    <a href="/posts" class="nav-link">Posts</a>
    {#if !loggedIn}
    <a href="/register" class="nav-link">Register</a>
    <a href="/login" class="nav-link">Login</a>
    {:else}
    <!-- svelte-ignore a11y_invalid_attribute -->
    <span>{username}</span>
    <a href="#" on:click|preventDefault={logout} class="link-button">Logout</a>
    {/if}
  </nav>
  <hr>
</header>

<main>
  <slot></slot>
</main>
