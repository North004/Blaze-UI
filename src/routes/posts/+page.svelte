<script lang="ts">
  import axios from 'axios';
  import { onMount } from 'svelte';

  let posts: any[] = [];
  let title: string = '';
  let content: string = '';
  let errorMessage: string = '';
  let errorPostMessage: string = '';
  let errorReactMessage: string = '';
  let formErrors: FormErrors = {title : "", content : ""};

  type FormErrors = {
      title: string;
      content: string;
  };

  async function fetchPosts() {
    try {
      const response = await axios.get('http://localhost:8000/posts');
      if (response.data.status === 'success') {
        posts = response.data.data.posts;
      } else {
         errorMessage = 'Failed to load posts.';
      }
    } catch (error) {
         errorMessage = 'Error fetching posts.';
    }
  }

  async function submitPost() {
    errorPostMessage = '';
    formErrors = {title : "", content : ""};
    try {
      const response = await axios.post('http://localhost:8000/posts', {
        title,
        content
      }, { withCredentials: true });

      if (response.data.status === 'success') {
        title = '';
        content = '';
        await fetchPosts(); 
      } else if (response.data.status === 'fail') {
        formErrors = response.data.data;
      } else {
        errorPostMessage = 'Internal server error';
      }
    } catch (error) {
      errorPostMessage = 'Internal server error';
    }
  }

  async function reactToPost(postId: number, isLike: boolean) {
    try {
      const response = await axios.post(`http://localhost:8000/posts/${postId}/react`, {
        is_like: isLike
      }, { withCredentials: true });

      if (response.data.status === 'success') {
        await fetchPosts(); // Refresh the list of posts
      } else {
        errorReactMessage = 'Failed to react to post.';
      }
    } catch (error) {
      errorReactMessage = 'Error reacting to post.';
    }
  }
  onMount(fetchPosts);
</script>

<main>
  <h1>Posts</h1>
  <hr>
  <form on:submit|preventDefault={submitPost} class="post-form">
    <div class="form-group">
      <label for="title">Title:</label>
      <input type="text" id="title" bind:value={title} class="input-field" />
      {#if formErrors.title}
        <div class="error-message">{formErrors.title}</div>
      {/if}
    </div>

    <div class="form-group">
      <label for="content">Content:</label>
      <textarea id="content" bind:value={content} class="textarea-field" rows="5"></textarea>
      {#if formErrors.content}
        <div class="error-message">{formErrors.content}</div>
      {/if}
    </div>

    {#if errorPostMessage}
      <div class="error-message">{errorPostMessage}</div>
    {/if}
    <button type="submit" class="submit-button">Create Post</button>
  </form>

  <section class="posts">
    {#if posts.length > 0}
      <ul>
        {#each posts as post}
        <li class="post-item">
          <img width="80px" height="80px" src={`http://localhost:8000/assets/${post.profile_image}`} alt="poster's profile" class="author-img" />
          
          <div class="post-content">
            <a href='post/{post.id}'><h2>{post.title}</h2></a>
            <p>{post.content}</p>
            
            <small>By {post.username} on {new Date(post.created_at).toLocaleDateString()}</small>
            <div class="reaction-buttons">
              <button on:click={() => reactToPost(post.id, true)} class="like-button">{post.likes} Like</button>
              <button on:click={() => reactToPost(post.id, false)} class="dislike-button">{post.dislikes} Dislike</button>
            </div>
        </li>
        {/each}
      </ul>
    {:else}
       <p>No posts available.</p>
    {/if}
    {#if errorMessage}
        <div class="error-message">{errorMessage}</div>
    {/if}
    {#if errorReactMessage}
        <div class="error-message">{errorReactMessage}</div>
    {/if}
  </section>
</main>

<style>
  /* CSS */
a {
  text-decoration: none;
  color: black;
}
.post-form {
    margin-bottom: 20px;
}

.form-group {
    margin-bottom: 15px;
}

.input-field, .textarea-field {
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

.posts {
    margin-top: 20px;
}

.posts ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
}

.post-item {
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