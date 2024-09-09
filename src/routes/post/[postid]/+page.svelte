<script lang="ts">
  import { page } from '$app/stores';
  import axios from 'axios';
  import { onMount } from 'svelte';

  let comments: any[] = [];
  let post: any | null = null;
  let errorMessage = '';
  let postId: string = '';

  // Reactive assignment to automatically update if the page context changes
  $: postId = $page.params.postid;

  async function fetchComments(postId: string) {
    try {
      const response = await axios.get(`http://localhost:8000/posts/${postId}/comments`);
      if (response.data.status === 'success') {
        comments = response.data.data.comments;
      } else {
        errorMessage = 'Failed to load comments.';
      }
    } catch (error) {
      console.error('Error fetching comments:', error); // Improved logging
      errorMessage = 'Error fetching comments.';
    }
  }

  async function fetchPost(postId: string) {
    try {
      const response = await axios.get(`http://localhost:8000/posts/${postId}`);
      if (response.data.status === 'success') {
        post = response.data.data.post;
      } else {
        errorMessage = 'Failed to load post.';
      }
    } catch (error) {
      console.error('Error fetching post:', error); // Improved logging
      errorMessage = 'Error fetching post.';
    }
  }

  async function reactToPost(postId: string, isLike: boolean) {
    console.log('Reacting to post with ID:', postId, 'Is like:', isLike); // Debugging
    try {
      const response = await axios.post(`http://localhost:8000/posts/${postId}/react`, {
        is_like: isLike
      }, { withCredentials: true });

      if (response.data.status === 'success') {
        await fetchPost(postId); // Refresh the post data
      } else {
        errorMessage = 'Failed to react to post.';
      }
    } catch (error) {
      console.error('Error reacting to post:', error); // Improved logging
      errorMessage = 'Error reacting to post.';
    }
  }

  onMount(() => {
    if (postId) {
      fetchPost(postId);
      fetchComments(postId);
    }
  });

  let content = ''
  let successMessage = ''
  async function submitComment() {
    successMessage = '';
    errorMessage = '';
    try {
      const response = await axios.post(`http://localhost:8000/posts/${postId}/comments`, {
        content
      }, { withCredentials: true });

      if (response.data.status === 'success') {
        successMessage = 'Post created successfully!';
        content = '';
        await fetchComments(postId); // Refresh the list of posts
      } else if (response.data.status === 'fail') {
        errorMessage = response.data.data;
        console.error("error");
      } else {
        errorMessage = 'Internal server error';
      }
    } catch (error) {
      errorMessage = 'Internal server error';
      console.error(error);

    }
  }
</script>

<h1>Post</h1>

{#if post}
    <!-- svelte-ignore a11y_img_redundant_alt -->
    <img width="80px" height="80px" src={`http://localhost:8000/assets/${post.profile_image}`} alt="Author's profile picture" class="author-img" />
    <div class="post-content">
      <h2>{post.title}</h2>
      <p>{post.content}</p>
      <small>By {post.author} on {new Date(post.created_at).toLocaleDateString()}</small>
      <div class="reaction-buttons">
        <button on:click={() => reactToPost(post.id, true)} class="like-button">{post.likes} Like</button>
        <button on:click={() => reactToPost(post.id, false)} class="dislike-button">{post.dislikes} Dislike</button>
      </div>
    </div>
{:else}
  <p>Post not found or failed to load.</p>
{/if}

<form on:submit|preventDefault={submitComment} class="post-form">
  <div class="form-group">
    <label for="title">Title:</label>
    <input type="text" id="title" bind:value={content} class="input-field" />
  </div>

  {#if successMessage}
    <div class="success-message">{successMessage}</div>
  {/if}

  {#if errorMessage}
    <div class="error-message">{errorMessage}</div>
  {/if}

  <button type="submit" class="submit-button">Comment</button>
</form>

<section class="comments">
  {#if comments.length > 0}
    <ul>
      {#each comments as comment}
        <img width="80px" height="80px" src={`http://localhost:8000/assets/${comment.profile_image}`} alt="Author's profile picture" class="author-img" />
        <h1>{comment.username}</h1>
        <li>Says: {comment.content}</li>
      {/each}
    </ul>
  {:else}
    <p>No comments available.</p>
  {/if}
</section>

{#if errorMessage}
  <p class="error">{errorMessage}</p>
{/if}

<style>
  .reaction-buttons {
    margin-top: 10px;
  }

  .like-button, .dislike-button {
    margin-right: 10px;
    padding: 5px 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  .like-button {
    background-color: #4CAF50; /* Green */
    color: white;
  }

  .dislike-button {
    background-color: #f44336; /* Red */
    color: white;
  }
</style>
