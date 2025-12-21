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
              placeholder="Describe your project..."
              class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          </div>

          <div v-if="errorMessage" class="text-red-400 text-sm">{{ errorMessage }}</div>

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
              Pending ({{ pendingApplications.length }})
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
              Approved ({{ approvedApplications.length }})
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
              Rejected ({{ rejectedApplications.length }})
            </button>
          </div>

          <div v-if="activeApplicationTab === 'pending'">
            <div
              v-if="pendingApplications.length === 0"
              class="text-center text-gray-400 text-sm py-8"
            >
              No pending applications.
            </div>
            <div v-else class="space-y-3">
              <div
                v-for="app in pendingApplications"
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
              v-if="approvedApplications.length === 0"
              class="text-center text-gray-400 text-sm py-8"
            >
              No approved applications.
            </div>
            <div v-else class="space-y-3">
              <div
                v-for="app in approvedApplications"
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
              v-if="rejectedApplications.length === 0"
              class="text-center text-gray-400 text-sm py-8"
            >
              No rejected applications.
            </div>
            <div v-else class="space-y-3">
              <div
                v-for="app in rejectedApplications"
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

        <div v-if="approvedApplications.length > 0" class="bg-gray-800 rounded-lg shadow-lg p-6">
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
                      <select
                        v-model="newTaskForm.priority"
                        class="px-3 py-1 bg-gray-700 border border-gray-500 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
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
                      <th class="px-6 py-4 text-center text-base font-medium text-gray-300">
                        Priority
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
                      <td class="px-6 py-4 text-center align-middle">
                        <span
                          :class="
                            task.priority === 'high'
                              ? 'bg-red-600 text-white'
                              : task.priority === 'medium'
                                ? 'bg-yellow-600 text-white'
                                : 'bg-green-600 text-white'
                          "
                          class="px-3 py-1 text-xs rounded font-medium"
                        >
                          {{ task.priority || 'medium' }}
                        </span>
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
                            @click="archiveTask(task._id)"
                            class="px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 font-medium"
                          >
                            Archive
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
        <h2 class="text-xl font-semibold text-white mb-4">All Tasks (Admin)</h2>
        <p class="text-gray-300 mb-6">View all tasks and user progress.</p>

        <div class="mb-6 bg-gray-700 rounded-lg p-4">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
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
                <option
                  v-for="user in allUsers.filter((u) => !u.isAdmin)"
                  :key="user._id"
                  :value="user._id"
                >
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
            <div>
              <label class="block text-sm text-gray-400 mb-2">Filter by Priority</label>
              <select
                v-model="adminSelectedPriorityFilter"
                class="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
          <button
            v-if="
              adminSelectedProjectId ||
              adminSelectedUserId ||
              adminSelectedStatusFilter ||
              adminSelectedPriorityFilter
            "
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
                <th class="px-6 py-4 text-center text-base font-medium text-gray-300">Priority</th>
                <th class="px-6 py-4 text-left text-base font-medium text-gray-300">Deadline</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(task, index) in getFilteredAdminTasks()"
                :key="task._id"
                @click="toggleTaskPopup(task)"
                class="bg-gray-600 border-b border-gray-700 hover:bg-gray-500 cursor-pointer transition"
              >
                <td class="px-6 py-4 text-gray-300 text-base align-middle">{{ index + 1 }}</td>
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
                  {{ task.projectId?.name || 'Unknown' }}
                </td>
                <td class="px-6 py-4 text-gray-300 text-base align-middle">
                  {{ task.createdBy?.name || task.createdBy?.email || 'Unknown' }}
                </td>
                <td class="px-6 py-4 text-gray-300 text-base align-middle">
                  {{ task.description || '-' }}
                </td>
                <td class="px-6 py-4 text-center align-middle">
                  <span
                    :class="
                      task.priority === 'high'
                        ? 'bg-red-600 text-white'
                        : task.priority === 'medium'
                          ? 'bg-yellow-600 text-white'
                          : 'bg-green-600 text-white'
                    "
                    class="px-3 py-1 text-xs rounded font-medium"
                  >
                    {{ task.priority || 'medium' }}
                  </span>
                </td>
                <td class="px-6 py-4 text-gray-300 text-base align-middle">
                  {{ formatDeadline(task.deadline) }}
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

            <div>
              <label class="text-gray-400 text-sm">Priority</label>
              <p class="mt-1">
                <span
                  :class="
                    selectedTask.priority === 'high'
                      ? 'bg-red-600 text-white'
                      : selectedTask.priority === 'medium'
                        ? 'bg-yellow-600 text-white'
                        : 'bg-green-600 text-white'
                  "
                  class="px-3 py-1 text-sm rounded font-medium"
                >
                  {{ selectedTask.priority || 'medium' }}
                </span>
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
                @click="archiveTask(selectedTask._id)"
                class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Archive Task
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ConfirmDialog ref="confirmDialogRef" />
    <Alert ref="alertRef" />
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
var activeApplicationTab = ref('pending')
var adminSelectedUserId = ref('')
var adminSelectedProjectId = ref('')
var adminSelectedStatusFilter = ref('')
var adminSelectedPriorityFilter = ref('')
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
  priority: 'medium',
})

var isAdmin = computed(() => {
  return authStore.user?.isAdmin === true
})

var myProjects = ref([])
var myApplications = ref([])

var pendingApplications = computed(() => {
  return myApplications.value.filter((app) => app.status === 'pending')
})

var approvedApplications = computed(() => {
  return myApplications.value.filter((app) => app.status === 'approved')
})

var rejectedApplications = computed(() => {
  return myApplications.value.filter((app) => app.status === 'rejected')
})

function toggleTaskForm(applicationId) {
  openTaskFormForApplicationId.value =
    openTaskFormForApplicationId.value === applicationId ? '' : applicationId
  newTaskForm.name = ''
  newTaskForm.description = ''
  newTaskForm.deadline = ''
  newTaskForm.priority = 'medium'
}

function toggleTaskPopup(task) {
  selectedTask.value = task
  showTaskPopup.value = !!task
}

function getFilteredApplications() {
  if (!selectedProjectFilter.value) {
    return approvedApplications.value
  }
  return approvedApplications.value.filter(function (app) {
    var appProjectId = app.projectId?._id || app.projectId
    return String(appProjectId) === String(selectedProjectFilter.value)
  })
}

function getFilteredTasksForApp(app) {
  var appProjectId = app.projectId?._id || app.projectId
  var appId = app._id
  var tasks = allTasks.value.filter(function (task) {
    if (task.isArchived) return false
    var taskProjectId = task.projectId?._id || task.projectId
    var taskApplicationId = task.applicationId?._id || task.applicationId
    return (
      String(taskProjectId) === String(appProjectId) && String(taskApplicationId) === String(appId)
    )
  })
  if (selectedStatusFilter.value) {
    tasks = tasks.filter(function (task) {
      return task.status === selectedStatusFilter.value
    })
  }
  if (taskSearchQuery.value) {
    var search = taskSearchQuery.value.toLowerCase()
    tasks = tasks.filter(function (task) {
      var name = (task.name || '').toLowerCase()
      var description = (task.description || '').toLowerCase()
      return name.includes(search) || description.includes(search)
    })
  }
  return tasks
}

var allTasks = ref([])
var calendarEvents = ref([])

async function loadCalendarEvents() {
  try {
    var response = await backend.get('/api/calendar/events')
    calendarEvents.value = response.data || []
  } catch (e) {
    errorMessage.value = 'Error loading calendar events'
  }
}

async function loadTasks() {
  isLoadingTasks.value = true
  try {
    var response = await backend.get('/api/tasks')
    allTasks.value = response.data || []
    console.log('Loaded tasks:', allTasks.value.length, allTasks.value)
  } catch (e) {
    errorMessage.value = 'Error loading tasks'
    console.error('Error loading tasks:', e)
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

var displayedAdminTasks = ref([])

async function loadAdminTasks() {
  isLoadingTasks.value = true
  try {
    var response = await backend.get('/api/tasks')
    displayedAdminTasks.value = (response.data || []).filter(function (task) {
      return !task.isArchived
    })
    console.log('Loaded admin tasks:', displayedAdminTasks.value.length)
  } catch (e) {
    errorMessage.value = 'Error loading tasks'
  }
  isLoadingTasks.value = false
}

function getFilteredAdminTasks() {
  var tasks = displayedAdminTasks.value
  if (adminSelectedUserId.value) {
    tasks = tasks.filter(function (task) {
      var taskUserId = task.createdBy?._id || task.createdBy
      return String(taskUserId) === String(adminSelectedUserId.value)
    })
  }
  if (adminSelectedProjectId.value) {
    tasks = tasks.filter(function (task) {
      var taskProjectId = task.projectId?._id || task.projectId
      return String(taskProjectId) === String(adminSelectedProjectId.value)
    })
  }
  if (adminSelectedStatusFilter.value) {
    tasks = tasks.filter(function (task) {
      return task.status === adminSelectedStatusFilter.value
    })
  }
  if (adminSelectedPriorityFilter.value) {
    tasks = tasks.filter(function (task) {
      return task.priority === adminSelectedPriorityFilter.value
    })
  }
  if (taskSearchQuery.value) {
    var search = taskSearchQuery.value.toLowerCase()
    tasks = tasks.filter(function (task) {
      var name = (task.name || '').toLowerCase()
      var description = (task.description || '').toLowerCase()
      return name.includes(search) || description.includes(search)
    })
  }
  return tasks
}

function clearAdminFilters() {
  adminSelectedProjectId.value = ''
  adminSelectedUserId.value = ''
  adminSelectedStatusFilter.value = ''
  adminSelectedPriorityFilter.value = ''
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
  } catch (e) {
    errorMessage.value = 'Error loading data'
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
  } catch (e) {
    var errorMsg = e?.response?.data?.msg || 'Error submitting application'
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
      priority: newTaskForm.priority || 'medium',
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
      await loadCalendarEvents()
    }

    newTaskForm.name = ''
    newTaskForm.description = ''
    newTaskForm.deadline = ''
    newTaskForm.priority = 'medium'
    openTaskFormForApplicationId.value = ''
    await loadTasks()
    if (alertRef.value) {
      alertRef.value.show('success', 'Task created successfully!', {
        autoClose: true,
        duration: 3000,
      })
    }
  } catch (e) {
    var errorMsg = e?.response?.data?.msg || 'Error creating task'
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
  } catch (e) {
    var errorMsg = e?.response?.data?.msg || 'Error updating task'
    if (alertRef.value) {
      alertRef.value.show('error', errorMsg)
    } else {
      errorMessage.value = errorMsg
    }
  }
  isLoadingTasks.value = false
}

async function archiveTask(taskId) {
  confirmDialogRef.value.show({
    type: 'danger',
    title: 'Archive Task',
    message: 'Are you sure you want to archive this task?',
    confirmText: 'Archive',
    cancelText: 'Cancel',
    onConfirm: async function () {
      isLoadingTasks.value = true
      try {
        await backend.put('/api/tasks/' + taskId + '/archive')
        if (selectedTask.value && selectedTask.value._id === taskId) {
          showTaskPopup.value = false
          selectedTask.value = null
        }
        await loadTasks()
        if (alertRef.value) {
          alertRef.value.show('success', 'Task archived successfully!', {
            autoClose: true,
            duration: 3000,
          })
        }
      } catch (e) {
        var errorMsg = e?.response?.data?.msg || 'Error archiving task'
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
  await loadCalendarEvents()
  if (isAdmin.value) {
    await loadAdminTasks()
  } else {
    await loadTasks()
    if (myProjects.value.length > 0 && !selectedProjectFilter.value) {
      selectedProjectFilter.value = myProjects.value[0]._id
    }
  }
})
</script>
