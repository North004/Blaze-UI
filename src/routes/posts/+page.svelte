<script lang="ts">
  import axios from 'axios';
  import { onMount } from 'svelte';

  type Post = {
	  likes: any;
	  dislikes: any;
    id: number;
    title: string;
    content: string;
    username: string;
    profile_image: string;
    created_at: string;
  };

  type ApiResponse<T> = {
    status: string;
    data: T;
  };

  type FormErrors = {
    title?: string;
    content?: string;
  };

  let posts: Post[] = [];
  let title: string = '';
  let content: string = '';
  let successMessage: string = '';
  let errorMessage: string = '';
  let formErrors: FormErrors = {};

  async function fetchPosts() {
    try {
      const response = await axios.get<ApiResponse<Post[]>>('http://localhost:8000/posts');
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
    successMessage = '';
    errorMessage = '';
    formErrors = {} ;

    try {
      const response = await axios.post<ApiResponse<null>>('http://localhost:8000/posts', {
        title,
        content
      }, { withCredentials: true });

      if (response.data.status === 'success') {
        successMessage = 'Post created successfully!';
        title = '';
        content = '';
        await fetchPosts(); // Refresh the list of posts
      } else if (response.data.status === 'fail') {
        formErrors = response.data.data;
      } else {
        errorMessage = 'Internal server error';
      }
    } catch (error) {
      errorMessage = 'Internal server error';
    }
  }

  async function reactToPost(postId: number, isLike: boolean) {
    console.log('Reacting to post with ID:', postId, 'Is like:', isLike); // Debugging
    try {
      const response = await axios.post<ApiResponse<null>>(`http://localhost:8000/posts/${postId}/react`, {
        like: isLike
      }, { withCredentials: true });

      if (response.data.status === 'success') {
        await fetchPosts(); // Refresh the list of posts
      } else {
        errorMessage = 'Failed to react to post.';
      }
    } catch (error) {
      errorMessage = 'Error reacting to post.';
    }
  }

  onMount(fetchPosts);
</script>

<main>
  <h1>Posts</h1>
  
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

    {#if successMessage}
      <div class="success-message">{successMessage}</div>
    {/if}

    {#if errorMessage}
      <div class="error-message">{errorMessage}</div>
    {/if}

    <button type="submit" class="submit-button">Create Post</button>
  </form>

  <section class="posts">
    {#if posts.length > 0}
      <ul>
        {#each posts as post}
        <hr>
          <li class="post-item">
            <img width="80px" height="80px" src={`http://localhost:8000/assets/${post.profile_image}`} alt="Author's profile picture" class="author-img" />
            <a href="post/{post.id}">
              <div class="post-content">
                <h2>{post.title}</h2>
                <p>{post.content}</p>
                <small>By {post.username} on {new Date(post.created_at).toLocaleDateString()}</small>
              </div>
            </a>
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
  </section>
</main>

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

  .error-message {
    color: red;
  }

  .success-message {
    color: green;
  }

  a {
    text-decoration: none;
    color: white;
  }
</style>
