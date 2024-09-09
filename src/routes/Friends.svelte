<!-- MyComponent.svelte -->

<script lang="ts">
import axios from "axios";
	import { onMount } from "svelte";
let errorMessage = ''
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
    console.log(friends);
});

</script>
<div>friends</div>
{#each friends as friend}
<div>{friend.username}</div>
<img width="80px" height="80px" src={`http://localhost:8000/assets/${friend.profile_image}`} alt="Author's profile picture" class="author-img" />
{/each}



