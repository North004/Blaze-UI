<script lang="ts">
import axios from "axios";
import { onMount } from "svelte";
let errorMessage = '';
let friends: any[] = [];
async function fetchPosts() {
    try {
      const response = await axios.get('http://localhost:8000/users');
      if (response.data.status === 'success') {
        friends = response.data.data.users;
      } else {
        errorMessage = 'Failed to load posts.';
      }
    } catch (error) {
      errorMessage = 'Error fetching posts.';
    }
}

onMount(async() => {
    fetchPosts();
});
</script>


<h1>Friends</h1>
<hr>
{#each friends as friend}
<div class="friend-container">
    <img width="80px" height="80px" src={`http://localhost:8000/assets/${friend.profile_image}`} alt="a profile logo" class="author-img" />
    <div class="username">{friend.username}</div>
</div>
<br>
{/each}



<style>
  .friend-container {
    display: flex; /* Use Flexbox */
    align-items: center; /* Center items vertically */
    gap: 10px; /* Space between image and username */
    margin-bottom: 10px; /* Space between items */
    background-color: #f9f9f9;
}

.author-img {
    border-radius: 50%; /* Circular image */
    border: 2px solid #ddd; /* Optional border around image */
}

.username {
    font-size: 1.5rem; /* Font size for username */
    font-weight: bold;
    color: #333; /* Text color */
}
</style>