<template>
  <Layout>
    <div class="space-y-6">
      <div v-if="!isAdmin" class="bg-gray-800 rounded-lg shadow-lg p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-white">Submit Project Application</h2>
          <button
            @click="showApplicationForm = !showApplicationForm"
            class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            {{ showApplicationForm ? 'Hide Form' : 'Show Form' }}
          </button>
        </div>
        <p class="text-gray-300 mb-6">Submit your project idea before starting with tasks.</p>

        <form v-if="showApplicationForm" @submit.prevent="submitApplication" class="space-y-4">
          <div>
            <label class="block text-sm text-gray-300 mb-1">Select Project *</label>
            <select
              v-model="selectedProjectId"
              required
              class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select a project...</option>
              <option v-for="project in myProjects" :key="project._id" :value="project._id">
                {{ project.name }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm text-gray-300 mb-1">Project Name *</label>
            <input
              v-model="applicationForm.name"
              type="text"
              required
              placeholder="Enter project name"
              class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label class="block text-sm text-gray-300 mb-1">Description *</label>
            <textarea
              v-model="applicationForm.description"
              rows="4"
              required
              placeholder="Here you must include your github repository link/other storage link and the project description"
              class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          </div>

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {{ isLoading ? 'Submitting...' : 'Submit Application' }}
          </button>
        </form>
      </div>

      <div v-if="!isAdmin" class="space-y-6">
        <div
          v-if="myApplications.length > 0"
          class="bg-gray-800 rounded-lg shadow-lg p-6 h-fit max-h-[600px] overflow-y-auto"
        >
          <h2 class="text-xl font-semibold text-white mb-4">My Applications</h2>

          <div class="flex space-x-2 mb-6 border-b border-gray-700">
            <button
              @click="activeApplicationTab = 'pending'"
              :class="[
                'px-4 py-2 text-sm font-medium rounded-t-lg',
                activeApplicationTab === 'pending'
                  ? 'bg-gray-700 text-white border-b-2 border-yellow-500'
                  : 'text-gray-400 hover:text-white',
              ]"
            >
              Pending ({{ getApplicationsByStatus('pending').length }})
            </button>
            <button
              @click="activeApplicationTab = 'approved'"
              :class="[
                'px-4 py-2 text-sm font-medium rounded-t-lg',
                activeApplicationTab === 'approved'
                  ? 'bg-gray-700 text-white border-b-2 border-green-500'
                  : 'text-gray-400 hover:text-white',
              ]"
            >
              Approved ({{ getApplicationsByStatus('approved').length }})
            </button>
            <button
              @click="activeApplicationTab = 'rejected'"
              :class="[
                'px-4 py-2 text-sm font-medium rounded-t-lg',
                activeApplicationTab === 'rejected'
                  ? 'bg-gray-700 text-white border-b-2 border-red-500'
                  : 'text-gray-400 hover:text-white',
              ]"
            >
              Rejected ({{ getApplicationsByStatus('rejected').length }})
            </button>
          </div>

          <div v-if="activeApplicationTab === 'pending'">
            <div
              v-if="getApplicationsByStatus('pending').length === 0"
              class="text-center text-gray-400 text-sm py-8"
            >
              No pending applications.
            </div>
            <div v-else class="space-y-3">
              <div
                v-for="app in getApplicationsByStatus('pending')"
                :key="app._id"
                class="bg-gray-700 rounded-lg p-4 border-l-4 border-yellow-500"
              >
                <p class="text-white font-medium mb-1">
                  Project: {{ app.projectId?.name || 'Unknown' }}
                </p>
                <p class="text-yellow-400 text-sm mb-2">Status: Pending</p>
                <p class="text-gray-300 text-sm mb-1">Idea: {{ app.idea }}</p>
                <p class="text-gray-400 text-xs">{{ app.description }}</p>
              </div>
            </div>
          </div>

          <div v-if="activeApplicationTab === 'approved'">
            <div
              v-if="getApplicationsByStatus('approved').length === 0"
              class="text-center text-gray-400 text-sm py-8"
            >
              No approved applications.
            </div>
            <div v-else class="space-y-3">
              <div
                v-for="app in getApplicationsByStatus('approved')"
                :key="app._id"
                class="bg-gray-700 rounded-lg p-4 border-l-4 border-green-500"
              >
                <p class="text-white font-medium mb-1">
                  Project: {{ app.projectId?.name || 'Unknown' }}
                </p>
                <p class="text-green-400 text-sm mb-2">Status: Approved</p>
                <p class="text-gray-300 text-sm mb-1">Idea: {{ app.idea }}</p>
                <p class="text-gray-400 text-xs">{{ app.description }}</p>
              </div>
            </div>
          </div>

          <div v-if="activeApplicationTab === 'rejected'">
            <div
              v-if="getApplicationsByStatus('rejected').length === 0"
              class="text-center text-gray-400 text-sm py-8"
            >
              No rejected applications.
            </div>
            <div v-else class="space-y-3">
              <div
                v-for="app in getApplicationsByStatus('rejected')"
                :key="app._id"
                class="bg-gray-700 rounded-lg p-4 border-l-4 border-red-500"
              >
                <p class="text-white font-medium mb-1">
                  Project: {{ app.projectId?.name || 'Unknown' }}
                </p>
                <p class="text-red-400 text-sm mb-2">Status: Rejected</p>
                <p class="text-gray-300 text-sm mb-1">Idea: {{ app.idea }}</p>
                <p class="text-gray-400 text-xs">{{ app.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="getApplicationsByStatus('approved').length > 0"
          class="bg-gray-800 rounded-lg shadow-lg p-6"
        >
          <h2 class="text-xl font-semibold text-white mb-4">My Tasks</h2>
          <p class="text-gray-300 mb-6">Manage tasks for your approved projects.</p>

          <div class="mb-6 bg-gray-700 rounded-lg p-4">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <div>
                <label class="block text-sm text-gray-400 mb-2">Filter by Project</label>
                <select
                  v-model="selectedProjectFilter"
                  class="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">All Projects</option>
                  <option v-for="project in myProjects" :key="project._id" :value="project._id">
                    {{ project.name }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-sm text-gray-400 mb-2">Filter by Status</label>
                <select
                  v-model="selectedStatusFilter"
                  class="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">All Status</option>
                  <option value="not-started">Not Started</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div>
                <label class="block text-sm text-gray-400 mb-2">Search</label>
                <input
                  v-model="taskSearchQuery"
                  type="text"
                  placeholder="Search tasks..."
                  class="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <button
              v-if="selectedProjectFilter || selectedStatusFilter || taskSearchQuery"
              @click="clearMemberFilters"
              class="px-4 py-2 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-500"
            >
              Clear Filters
            </button>
          </div>

          <div class="space-y-4">
            <div v-for="app in getFilteredApplications()" :key="app._id">
              <div class="mb-3 flex justify-between items-center">
                <h3 class="text-white font-medium">{{ app.idea }}</h3>
                <div class="flex gap-2">
                  <form
                    v-if="openTaskFormForApplicationId === app._id"
                    @submit.prevent="createTask(app)"
                    class="flex flex-col gap-2"
                  >
                    <div class="flex gap-2">
                      <input
                        v-model="newTaskForm.name"
                        type="text"
                        required
                        placeholder="Task name"
                        class="px-3 py-1 bg-gray-700 border border-gray-500 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                      />
                      <input
                        v-model="newTaskForm.deadline"
                        type="date"
                        placeholder="Deadline (optional)"
                        class="px-3 py-1 bg-gray-700 border border-gray-500 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                      />
                    </div>
                    <textarea
                      v-model="newTaskForm.description"
                      rows="1"
                      placeholder="Description"
                      class="px-3 py-1 bg-gray-700 border border-gray-500 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    ></textarea>
                    <div class="flex gap-2">
                      <button
                        type="submit"
                        :disabled="isLoadingTasks"
                        class="px-3 py-1 bg-indigo-600 text-white text-xs rounded-md hover:bg-indigo-700 disabled:opacity-50"
                      >
                        {{ isLoadingTasks ? 'Creating...' : 'Create' }}
                      </button>
                      <button
                        type="button"
                        @click="toggleTaskForm(app._id)"
                        class="px-3 py-1 bg-gray-600 text-white text-xs rounded-md hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                  <button
                    v-else
                    @click="toggleTaskForm(app._id)"
                    class="px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 font-medium"
                  >
                    Add Task
                  </button>
                </div>
              </div>

              <div
                v-if="getFilteredTasksForApp(app).length === 0"
                class="text-gray-400 text-sm py-4 text-center"
              >
                No tasks yet for {{ app.idea }}. Create your first task!
              </div>

              <div v-else class="overflow-x-auto">
                <table class="w-full border-collapse">
                  <thead>
                    <tr class="bg-gray-700 border-b border-gray-600">
                      <th class="px-6 py-4 text-left text-base font-medium text-gray-300">#</th>
                      <th class="px-6 py-4 text-left text-base font-medium text-gray-300">Task</th>
                      <th class="px-6 py-4 text-center text-base font-medium text-gray-300">
                        Status
                      </th>
                      <th class="px-6 py-4 text-left text-base font-medium text-gray-300">
                        Description
                      </th>
                      <th class="px-6 py-4 text-left text-base font-medium text-gray-300">
                        Deadline
                      </th>
                      <th class="px-6 py-4 text-center text-base font-medium text-gray-300">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(task, index) in getFilteredTasksForApp(app)"
                      :key="task._id"
                      @click="toggleTaskPopup(task)"
                      class="bg-gray-600 border-b border-gray-700 hover:bg-gray-500 cursor-pointer transition"
                    >
                      <td class="px-6 py-4 text-gray-300 text-base align-middle">
                        {{ index + 1 }}
                      </td>
                      <td class="px-6 py-4 text-white font-medium text-base align-middle">
                        {{ task.name }}
                      </td>
                      <td class="px-6 py-4 text-center align-middle">
                        <span
                          :class="
                            task.status === 'completed'
                              ? 'bg-green-600 text-white'
                              : task.status === 'in-progress'
                                ? 'bg-yellow-600 text-white'
                                : 'bg-gray-500 text-white'
                          "
                          class="px-4 py-2 text-sm rounded font-medium"
                        >
                          {{ task.status }}
                        </span>
                      </td>
                      <td class="px-6 py-4 text-gray-300 text-base align-middle">
                        {{ task.description || '-' }}
                      </td>
                      <td class="px-6 py-4 text-gray-300 text-base align-middle">
                        {{ formatDeadline(task.deadline) }}
                      </td>
                      <td class="px-6 py-4 align-middle" @click.stop>
                        <div class="flex items-center justify-center gap-2">
                          <button
                            v-if="task.status === 'not-started'"
                            @click="updateTaskStatus(task._id, 'in-progress')"
                            class="px-4 py-2 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700 font-medium"
                          >
                            Start
                          </button>
                          <button
                            v-if="task.status === 'in-progress'"
                            @click="updateTaskStatus(task._id, 'completed')"
                            class="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 font-medium"
                          >
                            Complete
                          </button>
                          <button
                            v-if="isTaskCreatedByUser(task)"
                            @click="deleteTask(task._id)"
                            class="px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="isAdmin" class="bg-gray-800 rounded-lg shadow-lg p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-white">All Tasks (Admin)</h2>
          <button
            @click="showAdminTaskForm = !showAdminTaskForm"
            class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            {{ showAdminTaskForm ? 'Cancel' : 'Create Task' }}
          </button>
        </div>
        <p class="text-gray-300 mb-6">View all tasks and user progress.</p>

        <form
          v-if="showAdminTaskForm"
          @submit.prevent="createAdminTask"
          class="mb-6 bg-gray-700 rounded-lg p-4 space-y-3"
        >
          <select
            v-model="adminTaskForm.projectId"
            required
            class="w-full px-3 py-2 bg-gray-600 text-white rounded"
          >
            <option value="">Select Project</option>
            <option v-for="p in allProjects" :key="p._id" :value="p._id">
              {{ p.name }}
            </option>
          </select>
          <input
            v-model="adminTaskForm.name"
            required
            placeholder="Task name"
            class="w-full px-3 py-2 bg-gray-600 text-white rounded"
          />
          <textarea
            v-model="adminTaskForm.description"
            placeholder="Description"
            class="w-full px-3 py-2 bg-gray-600 text-white rounded"
          ></textarea>
          <button
            type="submit"
            :disabled="isLoadingTasks"
            class="w-full px-4 py-2 bg-indigo-600 text-white rounded"
          >
            Create
          </button>
        </form>

        <div class="mb-6 bg-gray-700 rounded-lg p-4">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label class="block text-sm text-gray-400 mb-2">Filter by Project</label>
              <select
                v-model="adminSelectedProjectId"
                class="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Projects</option>
                <option v-for="project in allProjects" :key="project._id" :value="project._id">
                  {{ project.name }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm text-gray-400 mb-2">Filter by Member</label>
              <select
                v-model="adminSelectedUserId"
                class="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Members</option>
                <option v-for="user in getNonAdminUsers()" :key="user._id" :value="user._id">
                  {{ user.name }} {{ user.lastname }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm text-gray-400 mb-2">Filter by Status</label>
              <select
                v-model="adminSelectedStatusFilter"
                class="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Status</option>
                <option value="not-started">Not Started</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
          <button
            v-if="adminSelectedProjectId || adminSelectedUserId || adminSelectedStatusFilter"
            @click="clearAdminFilters"
            class="px-4 py-2 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-500"
          >
            Clear Filters
          </button>
        </div>

        <div v-if="isLoadingTasks" class="text-center text-gray-400">Loading tasks...</div>

        <div
          v-else-if="getFilteredAdminTasks().length === 0"
          class="text-center text-gray-400 py-8"
        >
          No tasks found.
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full border-collapse">
            <thead>
              <tr class="bg-gray-700 border-b border-gray-600">
                <th class="px-6 py-4 text-left text-base font-medium text-gray-300">#</th>
                <th class="px-6 py-4 text-left text-base font-medium text-gray-300">Task</th>
                <th class="px-6 py-4 text-center text-base font-medium text-gray-300">Status</th>
                <th class="px-6 py-4 text-left text-base font-medium text-gray-300">Project</th>
                <th class="px-6 py-4 text-left text-base font-medium text-gray-300">User</th>
                <th class="px-6 py-4 text-left text-base font-medium text-gray-300">Description</th>
                <th class="px-6 py-4 text-left text-base font-medium text-gray-300">Deadline</th>
                <th class="px-6 py-4 text-center text-base font-medium text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(task, index) in getFilteredAdminTasks()"
                :key="task._id"
                class="bg-gray-600 border-b border-gray-700 hover:bg-gray-500 transition"
              >
                <td
                  class="px-6 py-4 text-gray-300 text-base align-middle"
                  @click="toggleTaskPopup(task)"
                  style="cursor: pointer"
                >
                  {{ index + 1 }}
                </td>
                <td
                  class="px-6 py-4 text-white font-medium text-base align-middle"
                  @click="toggleTaskPopup(task)"
                  style="cursor: pointer"
                >
                  {{ task.name }}
                </td>
                <td
                  class="px-6 py-4 text-center align-middle"
                  @click="toggleTaskPopup(task)"
                  style="cursor: pointer"
                >
                  <span
                    :class="
                      task.status === 'completed'
                        ? 'bg-green-600 text-white'
                        : task.status === 'in-progress'
                          ? 'bg-yellow-600 text-white'
                          : 'bg-gray-500 text-white'
                    "
                    class="px-4 py-2 text-sm rounded font-medium"
                  >
                    {{ task.status }}
                  </span>
                </td>
                <td
                  class="px-6 py-4 text-gray-300 text-base align-middle"
                  @click="toggleTaskPopup(task)"
                  style="cursor: pointer"
                >
                  {{ task.projectId?.name || 'Unknown' }}
                </td>
                <td
                  class="px-6 py-4 text-gray-300 text-base align-middle"
                  @click="toggleTaskPopup(task)"
                  style="cursor: pointer"
                >
                  {{ task.createdBy?.name || task.createdBy?.email || 'Unknown' }}
                </td>
                <td
                  class="px-6 py-4 text-gray-300 text-base align-middle"
                  @click="toggleTaskPopup(task)"
                  style="cursor: pointer"
                >
                  {{ task.description || '-' }}
                </td>
                <td
                  class="px-6 py-4 text-gray-300 text-base align-middle"
                  @click="toggleTaskPopup(task)"
                  style="cursor: pointer"
                >
                  {{ formatDeadline(task.deadline) }}
                </td>
                <td class="px-6 py-4 text-center align-middle" @click.stop>
                  <button
                    v-if="isTaskCreatedByAdmin(task)"
                    @click="deleteTask(task._id)"
                    class="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 font-medium"
                  >
                    Delete
                  </button>
                  <span v-else class="text-gray-500 text-xs">-</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div
        v-if="showTaskPopup && selectedTask"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        @click="toggleTaskPopup(null)"
      >
        <div
          @click.stop
          class="bg-gray-800 rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        >
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-2xl font-semibold text-white">{{ selectedTask.name }}</h2>
            <button @click="toggleTaskPopup(null)" class="text-gray-400 hover:text-white text-2xl">
              ×
            </button>
          </div>

          <div class="space-y-4">
            <div>
              <label class="text-gray-400 text-sm">Description</label>
              <p class="text-white mt-1">
                {{ selectedTask.description || 'No description' }}
              </p>
            </div>

            <div>
              <label class="text-gray-400 text-sm">Status</label>
              <p class="mt-1">
                <span
                  :class="
                    selectedTask.status === 'completed'
                      ? 'text-green-400'
                      : selectedTask.status === 'in-progress'
                        ? 'text-yellow-400'
                        : 'text-gray-400'
                  "
                  class="text-lg font-medium"
                >
                  {{ selectedTask.status }}
                </span>
              </p>
            </div>

            <div>
              <label class="text-gray-400 text-sm">Project</label>
              <p class="text-white mt-1">
                {{ selectedTask.projectId?.name || 'Unknown' }}
              </p>
            </div>

            <div v-if="selectedTask.deadline">
              <label class="text-gray-400 text-sm">Deadline</label>
              <p class="text-white mt-1">
                {{ formatDeadline(selectedTask.deadline) }}
              </p>
            </div>

            <div v-if="!isAdmin" class="flex space-x-3 pt-4 border-t border-gray-700">
              <button
                v-if="selectedTask.status === 'not-started'"
                @click="updateTaskStatus(selectedTask._id, 'in-progress')"
                class="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
              >
                Start Task
              </button>
              <button
                v-if="selectedTask.status === 'in-progress'"
                @click="updateTaskStatus(selectedTask._id, 'completed')"
                class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Complete Task
              </button>
              <button
                v-if="isTaskCreatedByUser(selectedTask)"
                @click="deleteTask(selectedTask._id)"
                class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete Task
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Alert ref="alertRef" />
    <ConfirmDialog ref="confirmDialogRef" />
  </Layout>
</template>

<script setup>
import { reactive, ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useApplicationsStore } from '@/stores/applications'
import { backend } from '@/services/backend'
import Layout from '@/components/Layout.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import Alert from '@/components/Alert.vue'

var authStore = useAuthStore()
var applicationsStore = useApplicationsStore()

var isLoading = ref(false)
var isLoadingTasks = ref(false)
var errorMessage = ref(null)
var selectedProjectId = ref('')
var openTaskFormForApplicationId = ref('')
var showTaskPopup = ref(false)
var selectedTask = ref(null)
var allProjects = ref([])
var allApplications = ref([])
var showApplicationForm = ref(false)
var showAdminTaskForm = ref(false)
var activeApplicationTab = ref('pending')
var adminSelectedProjectId = ref('')
var adminSelectedUserId = ref('')
var adminSelectedStatusFilter = ref('')
var allUsers = ref([])
var selectedProjectFilter = ref('')
var selectedStatusFilter = ref('')
var taskSearchQuery = ref('')
var confirmDialogRef = ref(null)
var alertRef = ref(null)

var applicationForm = reactive({
  name: '',
  description: '',
})

var newTaskForm = reactive({
  name: '',
  description: '',
  deadline: '',
})

var adminTaskForm = reactive({
  projectId: '',
  name: '',
  description: '',
})

var isAdmin = computed(() => {
  if (!authStore.user) return false
  return authStore.user.isAdmin === true
})

function isTaskCreatedByAdmin(task) {
  if (!isAdmin.value) return false
  var adminId = authStore.user ? authStore.user._id : null
  var taskCreatorId = task.createdBy?._id || task.createdBy
  return String(adminId) === String(taskCreatorId)
}

function isTaskCreatedByUser(task) {
  var userId = authStore.user ? authStore.user._id : null
  var taskCreatorId = task.createdBy?._id || task.createdBy
  return String(userId) === String(taskCreatorId)
}

function getNonAdminUsers() {
  var result = []
  for (var i = 0; i < allUsers.value.length; i++) {
    if (!allUsers.value[i].isAdmin) {
      result.push(allUsers.value[i])
    }
  }
  return result
}

var myProjects = ref([])
var myApplications = ref([])

function getApplicationsByStatus(status) {
  var result = []
  for (var i = 0; i < myApplications.value.length; i++) {
    if (myApplications.value[i].status === status) {
      result.push(myApplications.value[i])
    }
  }
  return result
}

function toggleTaskForm(applicationId) {
  openTaskFormForApplicationId.value =
    openTaskFormForApplicationId.value === applicationId ? '' : applicationId
  newTaskForm.name = ''
  newTaskForm.description = ''
  newTaskForm.deadline = ''
}

function toggleTaskPopup(task) {
  selectedTask.value = task
  showTaskPopup.value = !!task
}

function getFilteredApplications() {
  var approved = getApplicationsByStatus('approved')

  if (!selectedProjectFilter.value) {
    return approved
  }

  var result = []
  for (var i = 0; i < approved.length; i++) {
    var app = approved[i]
    var projectId = app.projectId
    if (projectId && projectId._id) {
      projectId = projectId._id
    }
    if (String(projectId) === String(selectedProjectFilter.value)) {
      result.push(app)
    }
  }
  return result
}

function getFilteredTasksForApp(app) {
  var appProjectId = app.projectId
  if (appProjectId && appProjectId._id) {
    appProjectId = appProjectId._id
  }
  var appId = app._id
  var result = []

  for (var i = 0; i < allTasks.value.length; i++) {
    var task = allTasks.value[i]

    var taskProjectId = task.projectId
    if (taskProjectId && taskProjectId._id) {
      taskProjectId = taskProjectId._id
    }
    var taskApplicationId = task.applicationId
    if (taskApplicationId && taskApplicationId._id) {
      taskApplicationId = taskApplicationId._id
    }

    if (String(taskProjectId) === String(appProjectId)) {
      if (String(taskApplicationId) === String(appId)) {
        result.push(task)
      } else if (!taskApplicationId) {
        result.push(task)
      }
    }
  }

  if (selectedStatusFilter.value) {
    var filteredByStatus = []
    for (var j = 0; j < result.length; j++) {
      if (result[j].status === selectedStatusFilter.value) {
        filteredByStatus.push(result[j])
      }
    }
    result = filteredByStatus
  }

  if (taskSearchQuery.value) {
    var search = taskSearchQuery.value.toLowerCase()
    var filteredBySearch = []
    for (var k = 0; k < result.length; k++) {
      var taskName = ''
      if (result[k].name) {
        taskName = result[k].name.toLowerCase()
      }
      var taskDesc = ''
      if (result[k].description) {
        taskDesc = result[k].description.toLowerCase()
      }
      if (taskName.includes(search) || taskDesc.includes(search)) {
        filteredBySearch.push(result[k])
      }
    }
    result = filteredBySearch
  }

  return result
}

var allTasks = ref([])

async function loadTasks() {
  isLoadingTasks.value = true
  try {
    if (isAdmin.value) {
      var allTasksResponse = await backend.get('/api/tasks')
      allTasks.value = allTasksResponse.data || []
    } else {
      var myTasksResponse = await backend.get('/api/tasks/my')
      allTasks.value = myTasksResponse.data || []
    }
  } catch (error) {
    errorMessage.value = 'Error loading tasks'
    console.error(error)
  }
  isLoadingTasks.value = false
}

function formatDeadline(deadline) {
  if (!deadline) return '-'
  if (typeof deadline === 'string') {
    return deadline.split('T')[0]
  }
  var date = new Date(deadline)
  return date.toISOString().split('T')[0]
}

function getFilteredAdminTasks() {
  var result = []

  for (var i = 0; i < allTasks.value.length; i++) {
    result.push(allTasks.value[i])
  }

  if (adminSelectedProjectId.value) {
    var filteredByProject = []
    for (var k = 0; k < result.length; k++) {
      var task = result[k]
      var taskProjectId = task.projectId
      if (taskProjectId && taskProjectId._id) {
        taskProjectId = taskProjectId._id
      }
      if (String(taskProjectId) === String(adminSelectedProjectId.value)) {
        filteredByProject.push(task)
      }
    }
    result = filteredByProject
  }

  if (adminSelectedUserId.value) {
    var filteredByUser = []
    for (var j = 0; j < result.length; j++) {
      var task = result[j]
      var taskUserId = task.createdBy
      if (taskUserId && taskUserId._id) {
        taskUserId = taskUserId._id
      }
      if (String(taskUserId) === String(adminSelectedUserId.value)) {
        filteredByUser.push(task)
      }
    }
    result = filteredByUser
  }

  if (adminSelectedStatusFilter.value) {
    var filteredByStatus = []
    for (var l = 0; l < result.length; l++) {
      if (result[l].status === adminSelectedStatusFilter.value) {
        filteredByStatus.push(result[l])
      }
    }
    result = filteredByStatus
  }

  if (taskSearchQuery.value) {
    var search = taskSearchQuery.value.toLowerCase()
    var filteredBySearch = []
    for (var n = 0; n < result.length; n++) {
      var taskName = ''
      if (result[n].name) {
        taskName = result[n].name.toLowerCase()
      }
      var taskDesc = ''
      if (result[n].description) {
        taskDesc = result[n].description.toLowerCase()
      }
      if (taskName.includes(search) || taskDesc.includes(search)) {
        filteredBySearch.push(result[n])
      }
    }
    result = filteredBySearch
  }

  return result
}

function clearAdminFilters() {
  adminSelectedProjectId.value = ''
  adminSelectedUserId.value = ''
  adminSelectedStatusFilter.value = ''
}

function clearMemberFilters() {
  selectedProjectFilter.value = ''
  selectedStatusFilter.value = ''
  taskSearchQuery.value = ''
}

async function loadAllData() {
  isLoading.value = true
  try {
    if (isAdmin.value) {
      var usersResponse = await backend.get('/api/users')
      allUsers.value = usersResponse.data

      var projectsResponse = await backend.get('/api/projects')
      allProjects.value = projectsResponse.data

      var applicationsResponse = await backend.get('/api/applications')
      allApplications.value = applicationsResponse.data
    } else {
      var dashboardResponse = await backend.get('/api/users/dashboard')
      var data = dashboardResponse.data
      allUsers.value = data.users
      allProjects.value = data.projects
      myProjects.value = data.myProjects
      allApplications.value = data.applications
      myApplications.value = data.myApplications
    }
  } catch (error) {
    errorMessage.value = 'Error loading data'
    console.error(error)
  }
  isLoading.value = false
}

async function submitApplication() {
  isLoading.value = true
  try {
    await backend.post('/api/applications', {
      projectId: selectedProjectId.value,
      idea: applicationForm.name,
      description: applicationForm.description,
    })
    applicationsStore.addPending(selectedProjectId.value)
    applicationForm.name = ''
    applicationForm.description = ''
    selectedProjectId.value = ''
    await loadAllData()
    if (alertRef.value) {
      alertRef.value.show('success', 'Application submitted successfully!', {
        autoClose: true,
        duration: 3000,
      })
    }
  } catch (error) {
    var errorMsg = 'Error submitting application'
    if (error && error.response && error.response.data && error.response.data.msg) {
      errorMsg = error.response.data.msg
    }
    if (alertRef.value) {
      alertRef.value.show('error', errorMsg)
    } else {
      errorMessage.value = errorMsg
    }
  }
  isLoading.value = false
}

async function createTask(app) {
  isLoadingTasks.value = true
  try {
    var response = await backend.post('/api/tasks', {
      projectId: app.projectId._id || app.projectId,
      applicationId: app._id,
      name: newTaskForm.name,
      description: newTaskForm.description,
      status: 'in-progress',
      deadline: newTaskForm.deadline || null,
    })
    var createdTask = response.data

    if (newTaskForm.deadline) {
      await backend.post('/api/calendar/events', {
        title: newTaskForm.name,
        date: newTaskForm.deadline,
        description: newTaskForm.description || 'Task deadline',
        projectId: app.projectId._id || app.projectId,
        taskId: createdTask._id,
      })
    }

    newTaskForm.name = ''
    newTaskForm.description = ''
    newTaskForm.deadline = ''
    openTaskFormForApplicationId.value = ''
    if (alertRef.value) {
      alertRef.value.show('success', 'Task created successfully!', {
        autoClose: true,
        duration: 3000,
      })
    }
    await loadTasks()
  } catch (error) {
    var errorMsg = 'Error creating task'
    if (error && error.response && error.response.data && error.response.data.msg) {
      errorMsg = error.response.data.msg
    }
    if (alertRef.value) {
      alertRef.value.show('error', errorMsg)
    } else {
      errorMessage.value = errorMsg
    }
  }
  isLoadingTasks.value = false
}

async function createAdminTask() {
  isLoadingTasks.value = true
  try {
    await backend.post('/api/tasks', {
      projectId: adminTaskForm.projectId,
      name: adminTaskForm.name,
      description: adminTaskForm.description,
      status: 'not-started',
    })
    Object.assign(adminTaskForm, {
      projectId: '',
      name: '',
      description: '',
    })
    showAdminTaskForm.value = false
    await loadTasks()
    if (alertRef.value) {
      alertRef.value.show('success', 'Task created successfully!', {
        autoClose: true,
        duration: 3000,
      })
    }
  } catch (error) {
    var errorMsg = 'Error creating task'
    if (error && error.response && error.response.data && error.response.data.msg) {
      errorMsg = error.response.data.msg
    }
    if (alertRef.value) {
      alertRef.value.show('error', errorMsg)
    } else {
      errorMessage.value = errorMsg
    }
  }
  isLoadingTasks.value = false
}

async function updateTaskStatus(taskId, newStatus) {
  isLoadingTasks.value = true
  try {
    await backend.put('/api/tasks/' + taskId, { status: newStatus })
    if (selectedTask.value && selectedTask.value._id === taskId) {
      selectedTask.value.status = newStatus
    }
    await loadTasks()
    if (alertRef.value) {
      alertRef.value.show('success', 'Task status updated successfully!', {
        autoClose: true,
        duration: 3000,
      })
    }
  } catch (error) {
    var errorMsg = 'Error updating task'
    if (error && error.response && error.response.data && error.response.data.msg) {
      errorMsg = error.response.data.msg
    }
    if (alertRef.value) {
      alertRef.value.show('error', errorMsg)
    } else {
      errorMessage.value = errorMsg
    }
  }
  isLoadingTasks.value = false
}

async function deleteTask(taskId) {
  confirmDialogRef.value.show({
    type: 'danger',
    title: 'Delete Task',
    message: 'Are you sure you want to permanently delete this task? This action cannot be undone.',
    confirmText: 'Delete',
    cancelText: 'Cancel',
    onConfirm: async function () {
      isLoadingTasks.value = true
      try {
        await backend.delete('/api/tasks/' + taskId)
        if (selectedTask.value && selectedTask.value._id === taskId) {
          showTaskPopup.value = false
          selectedTask.value = null
        }
        if (isAdmin.value) {
          await loadTasks()
        } else {
          await loadTasks()
        }
        if (alertRef.value) {
          alertRef.value.show('success', 'Task deleted successfully!', {
            autoClose: true,
            duration: 3000,
          })
        }
      } catch (error) {
        var errorMsg = 'Error deleting task'
        if (error && error.response && error.response.data && error.response.data.msg) {
          errorMsg = error.response.data.msg
        }
        if (alertRef.value) {
          alertRef.value.show('error', errorMsg)
        } else {
          errorMessage.value = errorMsg
        }
      }
      isLoadingTasks.value = false
    },
  })
}

onMounted(async () => {
  await loadAllData()
  if (isAdmin.value) {
    await loadTasks()
  } else {
    await loadTasks()
    if (myProjects.value.length > 0 && !selectedProjectFilter.value) {
      selectedProjectFilter.value = myProjects.value[0]._id
    }
  }
})
</script>
