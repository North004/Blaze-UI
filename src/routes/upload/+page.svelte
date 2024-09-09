<script>
    import axios from 'axios';
  
    let file = null;
    let message = '';
    let messageType = '';
  
    const handleFileChange = (event) => {
      file = event.target.files[0];
    };
  
    const handleSubmit = async (event) => {
      event.preventDefault();
  
      if (!file) {
        message = 'Please select a file.';
        messageType = 'error';
        return;
      }
  
      const formData = new FormData();
      formData.append('file', file);
  
      try {
        const response = await axios.post('http://localhost:8000/profile/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true
        });
  
        const { status } = response.data;
  
        if (status === 'success') {
          message = 'File uploaded successfully!';
          messageType = 'success';
        } else if (status === 'fail') {
          message = 'File upload failed.';
          messageType = 'error';
        } else if (status === 'error') {
          message = 'An error occurred during file upload.';
          messageType = 'error';
        }
      } catch (error) {
        console.error('Error:', error);
        message = 'An error occurred while sending the request.';
        messageType = 'error';
      }
    };
  </script>
  
  <style>
    .message {
      padding: 1em;
      margin-top: 1em;
      border-radius: 5px;
      font-weight: bold;
    }
  
    .success {
      color: green;
      border: 1px solid green;
      background-color: #d4edda;
    }
  
    .error {
      color: red;
      border: 1px solid red;
      background-color: #f8d7da;
    }
  </style>
  
  <form on:submit={handleSubmit}>
    <input type="file" accept="*/*" on:change={handleFileChange} />
    <button type="submit">Upload</button>
  </form>
  
  {#if message}
    <div class="message {messageType}">
      {message}
    </div>
  {/if}
  