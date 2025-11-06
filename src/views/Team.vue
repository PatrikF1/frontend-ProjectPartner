<template>
  <Layout>
    <div class="min-h-screen p-6 space-y-6">
      <div class="bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 class="text-xl font-semibold text-white mb-4">Team Discussion</h2>
        <p class="text-gray-300 mb-6">Share ideas and help each other with projects.</p>

        <div class="bg-gray-700 rounded-lg p-4 mb-6">
          <h3 class="text-white font-medium mb-3">Create New Post</h3>
          <input
            v-model="newPostTitle"
            type="text"
            placeholder="Post title..."
            class="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white mb-2"
          />
          <textarea
            v-model="newPostContent"
            rows="3"
            placeholder="What's on your mind?"
            class="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white mb-2"
          ></textarea>
          <button
            @click="createPost"
            :disabled="posting"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {{ posting ? 'Posting...' : 'Post' }}
          </button>
        </div>

        <div v-if="loading" class="text-gray-400 text-center">Loading posts...</div>

        <div v-else class="space-y-4">
          <div v-for="post in posts" :key="post._id" class="bg-gray-700 rounded-lg p-4">
            <div class="flex justify-between items-start mb-2">
              <div>
                <h3 class="text-white font-medium text-lg">{{ post.title }}</h3>
                <p class="text-gray-400 text-xs">
                  By {{ post.createdBy?.name || post.createdBy?.email || 'User' }} •
                  {{ formatDate(post.createdAt) }}
                </p>
              </div>
              <button
                v-if="canDeletePost(post)"
                @click="deletePost(post._id)"
                class="text-red-400 text-xs hover:text-red-300"
              >
                Delete
              </button>
            </div>

            <p class="text-gray-300 mb-3">{{ post.content }}</p>

            <div class="border-t border-gray-600 pt-3 mt-3">
              <div class="mb-2">
                <input
                  v-model="newComments[post._id]"
                  type="text"
                  placeholder="Write a comment..."
                  class="w-full px-3 py-1 bg-gray-600 border border-gray-500 rounded text-white text-sm"
                  @keyup.enter="addComment(post._id)"
                />
              </div>

              <div v-if="post.comments && post.comments.length > 0" class="space-y-2 mt-3">
                <div
                  v-for="comment in post.comments"
                  :key="comment._id"
                  class="bg-gray-600 rounded p-2 text-sm"
                >
                  <div class="flex justify-between">
                    <div>
                      <span class="text-gray-300 font-medium">
                        {{ comment.createdBy?.name || comment.createdBy?.email || 'User' }}
                      </span>
                      <span class="text-gray-500 text-xs ml-2">{{
                        formatDate(comment.createdAt)
                      }}</span>
                    </div>
                    <button
                      v-if="canDeleteComment(comment)"
                      @click="deleteComment(post._id, comment._id)"
                      class="text-red-400 text-xs hover:text-red-300"
                    >
                      Delete
                    </button>
                  </div>
                  <p class="text-gray-200 mt-1">{{ comment.content }}</p>
                </div>
              </div>
            </div>
          </div>

          <div v-if="posts.length === 0" class="text-gray-400 text-center py-8">
            No posts yet. Be the first to post!
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { backend } from '@/services/backend'
import { useAuthStore } from '@/stores/auth'
import Layout from '@/components/Layout.vue'

const authStore = useAuthStore()

const posts = ref([])
const loading = ref(false)
const posting = ref(false)
const newPostTitle = ref('')
const newPostContent = ref('')
const newComments = ref({})

async function getPosts() {
  loading.value = true

  try {
    var response = await backend.get('/api/posts')
    posts.value = response.data
    loading.value = false
  } catch (error) {
    console.log('Error:', error)
    loading.value = false
  }
}

async function createPost() {
  if (newPostTitle.value === '' || newPostContent.value === '') {
    return
  }

  posting.value = true

  try {
    await backend.post('/api/posts', {
      title: newPostTitle.value,
      content: newPostContent.value,
    })

    newPostTitle.value = ''
    newPostContent.value = ''
    await getPosts()
    posting.value = false
  } catch (error) {
    console.log('Error:', error)
    posting.value = false
  }
}

async function addComment(postId) {
  var text = newComments.value[postId]
  if (!text || text.trim() === '') {
    return
  }

  try {
    await backend.post('/api/posts/' + postId + '/comments', {
      content: text,
    })

    newComments.value[postId] = ''
    await getPosts()
  } catch (error) {
    console.log('Error:', error)
  }
}

async function deletePost(postId) {
  if (!confirm('Delete this post?')) return

  try {
    await backend.delete('/api/posts/' + postId)
    await getPosts()
  } catch (error) {
    console.log('Error:', error)
  }
}

async function deleteComment(postId, commentId) {
  try {
    await backend.delete('/api/posts/' + postId + '/comments/' + commentId)
    await getPosts()
  } catch (error) {
    console.log('Error:', error)
  }
}

function canDeletePost(post) {
  if (!authStore.user) return false
  var userId = authStore.user._id
  var postCreatorId = post.createdBy?._id || post.createdBy
  return postCreatorId === userId
}

function canDeleteComment(comment) {
  if (!authStore.user) return false
  var userId = authStore.user._id
  var commentCreatorId = comment.createdBy?._id || comment.createdBy
  return commentCreatorId === userId
}

function formatDate(dateString) {
  var date = new Date(dateString)
  return date.toLocaleDateString()
}

onMounted(() => {
  getPosts()
})
</script>
