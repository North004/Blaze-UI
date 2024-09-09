<script lang="ts">
	import axios from "axios";
	import { onMount } from "svelte";
  import { isLoggedInStore,usernameStore} from "$lib/stores";
  import Friend from './Friends.svelte'; 

  $: loggedIn= $isLoggedInStore;
  $: username = $usernameStore;

  async function logout() {
		try {
			const response = await axios.post('http://localhost:8000/auth/logout', {}, { withCredentials: true});

			if (response.data.status === "success") {
        isLoggedInStore.set(false);
        usernameStore.set("");
			} else {
				alert("An error occured");
			}
		} catch (error) {
          alert("An error occured");
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
        usernameStore.set("");
      }
    }
    catch (error) {
      alert("An error occured")
    }
  }

  onMount(async ()  => {
    is_logged_in()
  });

</script>

<header>
  <nav class="navbar">
    <a href="/" class="nav-link">Home</a>
    <a href="/posts" class="nav-link">Posts</a>
    {#if !loggedIn}
       <a href="/register" class="nav-link">Register</a>
       <a href="/login" class="nav-link">Login</a>
    {:else}
       <span class="username">{username}</span>
       <a href="/" on:click|preventDefault={logout} class="link-button">Logout</a>
    {/if}
  </nav>
</header>

<main>
  <div class="grid-container">
      <div class="friend">
           <Friend></Friend>
       </div>
       <div class="main">
          <slot></slot>
       </div>
       <div class="extra">
       </div>
  </div>
</main>

<style>
  .grid-container {
    display: grid;
    grid-template-columns: 1fr 4fr 1fr; /* Three equal columns */
    gap: 10px; /* Space between grid items */
    padding: 10px; /* Space inside the grid container */
}
.friend,.main,.extra {
    background-color: #ffffff; 
    padding: 20px; 
    border: 1px solid #ddd; 
    text-align: center; 
}


/*navbar*/
.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    color: white;
    font-weight: bold;
    font-size:1.2em;
}

.nav-link, .link-button {
    color: white;
    text-decoration: none;
    margin: 0 10px;
    padding: 8px 16px;
    border-radius: 4px;
    color: black;
    transition: background-color 0.3s;
}

.nav-link:hover, .link-button:hover {
    background-color: #555;
}

.username {
    margin: 0 10px;
}

.link-button {
    background-color: #e74c3c;
    border: none;
    cursor: pointer;
}

.link-button:hover {
    background-color: #c0392b;
}

</style>


