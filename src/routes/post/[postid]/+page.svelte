<script lang="ts">
  import { page } from '$app/stores';
  import axios from 'axios';
  import { onMount } from 'svelte';

  let comments: any[] = [];
  let post: any | null = null;
  let errorMessage = '';
  let errorFMessage = '';
  let errorRMessage = '';
  let errorCMessage = '';
  let content = '';

  let postId: string = '';

  $: postId = $page.params.postid;

  async function fetchComments(postId: string) {
    let errorCMessage = '';
    try {
      const response = await axios.get(`http://localhost:8000/posts/${postId}/comments`);
      if (response.data.status === 'success') {
        comments = response.data.data.comments;
      } else {
        errorCMessage = 'Failed to load comments.';
      }
    } catch (error) {
      errorCMessage = 'Error fetching comments.';
    }
  }

  async function fetchPost(postId: string) {
    let errorFMessage = '';
    try {
      const response = await axios.get(`http://localhost:8000/posts/${postId}`);
      if (response.data.status === 'success') {
        post = response.data.data.post;
      } else {
        errorFMessage = 'Failed to load post.';
      }
    } catch (error) {
      errorFMessage = 'Error fetching post.';
    }
  }

  async function reactToPost(postId: string, isLike: boolean) {
    let errorRMessage = '';
    try {
      const response = await axios.post(`http://localhost:8000/posts/${postId}/react`, {
        is_like: isLike
      }, { withCredentials: true });

      if (response.data.status === 'success') {
        await fetchPost(postId); // Refresh the post data
      } else {
        errorRMessage = 'Failed to react to post.';
      }
    } catch (error) {
      errorRMessage = 'Error reacting to post.';
    }
  }

  onMount(() => {
    if (postId) {
      fetchPost(postId);
      fetchComments(postId);
    }
  });

  async function submitComment() {
    errorMessage = '';
    try {
      const response = await axios.post(`http://localhost:8000/posts/${postId}/comments`, {
        content
      }, { withCredentials: true });

      if (response.data.status === 'success') {
        content = '';
        await fetchComments(postId); // Refresh the list of posts
      } else if (response.data.status === 'fail') {
        errorMessage = response.data.data;
      } else {
        errorMessage = 'Internal server error';
      }
    } catch (error) {
      errorMessage = 'Internal server error';
    }
  }
</script>

<main>
  <h1 class="page-title">Comments</h1>
  <hr class="separator">

  {#if post}
    <div class="post-content">
      <!-- svelte-ignore a11y_img_redundant_alt -->
      <img width="80px" height="80px" src={`http://localhost:8000/assets/${post.profile_image}`} alt="Author's profile picture" class="author-img" />
      <div class="post-details">
        <h2 class="post-title">{post.title}</h2>
        <p class="post-text">{post.content}</p>
        <small class="post-meta">By {post.author} on {new Date(post.created_at).toLocaleDateString()}</small>
        <div class="reaction-buttons">
          <button on:click={() => reactToPost(post.id, true)} class="like-button">{post.likes} Like</button>
          <button on:click={() => reactToPost(post.id, false)} class="dislike-button">{post.dislikes} Dislike</button>
        </div>
        {#if errorRMessage}
          <div class="error-message">{errorRMessage}</div>
        {/if}
      </div>
    </div>
  {:else}
    <p class="error-message">Post not found or failed to load.</p>
  {/if}

  <form on:submit|preventDefault={submitComment} class="post-form">
    <div class="form-group">
      <label for="content" class="form-label">Comment:</label>
      <input type="text" id="content" bind:value={content} class="input-field" />
    </div>

    {#if errorRMessage}
      <div class="error-message">{errorRMessage}</div>
    {/if}

    <button type="submit" class="submit-button">Comment</button>
  </form>

  <section class="comments">
    {#if comments.length > 0}
      <ul class="comment-list">
        {#each comments as comment}
          <li class="comment-item">
            <img width="80px" height="80px" src={`http://localhost:8000/assets/${comment.profile_image}`} alt="profile" class="author-img" />
            <div class="comment-details">
              <h1 class="comment-username">{comment.username}</h1>
              <p class="comment-content">Says: {comment.content}</p>
            </div>
          </li>
        {/each}
      </ul>
    {:else}
      <p class="error-message">No comments available.</p>
    {/if}
  </section>

  {#if errorFMessage}
    <p class="error-message">{errorFMessage}</p>
  {/if}
  {#if errorCMessage}
    <p class="error-message">{errorCMessage}</p>
  {/if}
</main>

<style>
.post-form {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.input-field {
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.submit-button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #45a049;
}

.error-message {
  color: red;
  font-size: 0.875rem;
  margin-top: 5px;
}

.comments {
  margin-top: 20px;
}

.comments ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.comment-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f9f9f9;
}

.author-img {
  border-radius: 50%;
  margin-right: 15px;
}

.post-content {
  flex: 1; /* Allow content to take remaining space */
}

.post-content h2 {
  margin-top: 0;
  font-size: 1.25rem;
}

.post-content p {
  margin: 10px 0;
}

.post-content small {
  display: block;
  color: #666;
}

.reaction-buttons {
  margin-top: 10px;
}

.like-button, .dislike-button {
  background-color: #ddd;
  border: none;
  padding: 5px 10px;
  margin-right: 5px;
  border-radius: 4px;
  cursor: pointer;
}

.like-button:hover {
  background-color: #ccc;
}

.dislike-button:hover {
  background-color: #ccc;
}

</style>