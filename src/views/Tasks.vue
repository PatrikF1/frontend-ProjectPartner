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

          <div>
            <label class="block text-sm text-gray-300 mb-1">Team (optional)</label>
            <select
              v-model="applicationForm.team"
              :disabled="isLoadingUsers"
              class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              <option value="">
                {{ isLoadingUsers ? 'Loading users...' : 'Select team member...' }}
              </option>
              <option v-for="user in teamMembers" :key="user._id" :value="user._id">
                {{ user.name }} {{ user.lastname }} ({{ user.email }})
              </option>
            </select>
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

      <div v-if="!isAdmin" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div v-if="approvedApplications.length > 0" class="bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 class="text-xl font-semibold text-white mb-4">My Tasks</h2>
          <p class="text-gray-300 mb-6">Manage tasks for your approved projects.</p>

          <div v-for="app in approvedApplications" :key="app._id" class="mb-4">
            <div class="bg-gray-700 rounded-lg overflow-hidden">
              <div
                @click="
                  expandedApplications.includes(String(app._id))
                    ? (expandedApplications = expandedApplications.filter(
                        (id) => id !== String(app._id),
                      ))
                    : expandedApplications.push(String(app._id))
                "
                class="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-600 transition"
              >
                <div class="flex-1">
                  <h3 class="text-lg font-medium text-white mb-1">{{ app.idea }}</h3>
                  <div
                    v-if="
                      allTasks.filter(
                        (t) =>
                          String(t.projectId?._id || t.projectId) ===
                            String(app.projectId?._id || app.projectId) &&
                          String(t.applicationId?._id || t.applicationId) === String(app._id),
                      ).length > 0
                    "
                    class="flex items-center gap-4"
                  >
                    <span class="text-gray-300 text-sm">
                      Tasks:
                      {{
                        allTasks.filter(
                          (t) =>
                            String(t.projectId?._id || t.projectId) ===
                              String(app.projectId?._id || app.projectId) &&
                            String(t.applicationId?._id || t.applicationId) === String(app._id),
                        ).length
                      }}
                    </span>
                    <span class="text-gray-300 text-sm">
                      Progress:
                      {{
                        Math.round(
                          (allTasks.filter(
                            (t) =>
                              String(t.projectId?._id || t.projectId) ===
                                String(app.projectId?._id || app.projectId) &&
                              String(t.applicationId?._id || t.applicationId) === String(app._id) &&
                              t.status === 'completed',
                          ).length /
                            (allTasks.filter(
                              (t) =>
                                String(t.projectId?._id || t.projectId) ===
                                  String(app.projectId?._id || app.projectId) &&
                                String(t.applicationId?._id || t.applicationId) === String(app._id),
                            ).length || 1)) *
                            100,
                        )
                      }}%
                    </span>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <button
                    @click.stop="toggleTaskForm(app._id)"
                    class="px-3 py-1 bg-indigo-600 text-white text-xs rounded-md hover:bg-indigo-700"
                  >
                    {{ openTaskFormForApplicationId === app._id ? 'Hide Form' : 'Add Task' }}
                  </button>
                  <span class="text-gray-400 text-xl">
                    {{ expandedApplications.includes(String(app._id)) ? '▼' : '▶' }}
                  </span>
                </div>
              </div>

              <div
                v-if="expandedApplications.includes(String(app._id))"
                class="p-4 border-t border-gray-600"
              >
                <template
                  v-for="(task, index) in allTasks.filter(
                    (t) =>
                      String(t.projectId?._id || t.projectId) ===
                        String(app.projectId?._id || app.projectId) &&
                      String(t.applicationId?._id || t.applicationId) === String(app._id),
                  )"
                  :key="task._id"
                >
                  <div v-if="index === 0" class="mb-4">
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-gray-300 text-sm">Progress:</span>
                      <span class="text-gray-300 text-sm">
                        {{
                          Math.round(
                            (allTasks.filter(
                              (t) =>
                                String(t.projectId?._id || t.projectId) ===
                                  String(app.projectId?._id || app.projectId) &&
                                String(t.applicationId?._id || t.applicationId) ===
                                  String(app._id) &&
                                t.status === 'completed',
                            ).length /
                              (allTasks.filter(
                                (t) =>
                                  String(t.projectId?._id || t.projectId) ===
                                    String(app.projectId?._id || app.projectId) &&
                                  String(t.applicationId?._id || t.applicationId) ===
                                    String(app._id),
                              ).length || 1)) *
                              100,
                          )
                        }}% ({{
                          allTasks.filter(
                            (t) =>
                              String(t.projectId?._id || t.projectId) ===
                                String(app.projectId?._id || app.projectId) &&
                              String(t.applicationId?._id || t.applicationId) === String(app._id) &&
                              t.status === 'completed',
                          ).length
                        }}/{{
                          allTasks.filter(
                            (t) =>
                              String(t.projectId?._id || t.projectId) ===
                                String(app.projectId?._id || app.projectId) &&
                              String(t.applicationId?._id || t.applicationId) === String(app._id),
                          ).length
                        }})
                      </span>
                    </div>
                    <div class="w-full bg-gray-600 rounded-full h-2">
                      <div
                        class="bg-green-500 h-2 rounded-full"
                        :style="{
                          width:
                            Math.round(
                              (allTasks.filter(
                                (t) =>
                                  String(t.projectId?._id || t.projectId) ===
                                    String(app.projectId?._id || app.projectId) &&
                                  String(t.applicationId?._id || t.applicationId) ===
                                    String(app._id) &&
                                  t.status === 'completed',
                              ).length /
                                (allTasks.filter(
                                  (t) =>
                                    String(t.projectId?._id || t.projectId) ===
                                      String(app.projectId?._id || app.projectId) &&
                                    String(t.applicationId?._id || t.applicationId) ===
                                      String(app._id),
                                ).length || 1)) *
                                100,
                            ) + '%',
                        }"
                      ></div>
                    </div>
                  </div>
                </template>

                <form
                  v-if="openTaskFormForApplicationId === app._id"
                  @submit.prevent="createTask(app)"
                  class="space-y-3 mb-4 bg-gray-600 p-4 rounded-lg"
                >
                  <input
                    v-model="newTaskForm.name"
                    type="text"
                    required
                    placeholder="Task name"
                    class="w-full px-3 py-2 bg-gray-700 border border-gray-500 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <textarea
                    v-model="newTaskForm.description"
                    rows="2"
                    placeholder="Description (optional)"
                    class="w-full px-3 py-2 bg-gray-700 border border-gray-500 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  ></textarea>
                  <button
                    type="submit"
                    :disabled="isLoadingTasks"
                    class="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {{ isLoadingTasks ? 'Creating...' : 'Create Task' }}
                  </button>
                </form>

                <div
                  v-if="
                    allTasks.filter(
                      (t) =>
                        String(t.projectId?._id || t.projectId) ===
                          String(app.projectId?._id || app.projectId) &&
                        String(t.applicationId?._id || t.applicationId) === String(app._id),
                    ).length === 0
                  "
                  class="text-gray-400 text-sm py-4 text-center"
                >
                  No tasks yet. Create your first task!
                </div>

                <div v-else class="space-y-3">
                  <div
                    v-for="(task, index) in allTasks.filter(
                      (t) =>
                        String(t.projectId?._id || t.projectId) ===
                          String(app.projectId?._id || app.projectId) &&
                        String(t.applicationId?._id || t.applicationId) === String(app._id),
                    )"
                    :key="task._id"
                    @click="toggleTaskPopup(task)"
                    class="bg-gray-600 rounded-lg p-4 cursor-pointer hover:bg-gray-500 transition"
                  >
                    <div class="flex items-start gap-3 mb-3">
                      <div
                        class="flex-shrink-0 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm"
                      >
                        {{ index + 1 }}
                      </div>
                      <div class="flex-1">
                        <p class="text-white font-semibold text-base mb-2">{{ task.name }}</p>
                        <p
                          v-if="task.description"
                          class="text-gray-300 text-sm mb-3 leading-relaxed"
                        >
                          {{ task.description }}
                        </p>
                        <div class="flex items-center gap-2">
                          <span class="text-gray-400 text-sm">Status:</span>
                          <span
                            :class="
                              task.status === 'completed'
                                ? 'text-green-400 font-medium'
                                : task.status === 'in-progress'
                                  ? 'text-yellow-400 font-medium'
                                  : 'text-gray-400 font-medium'
                            "
                            class="text-sm"
                            >{{ task.status }}</span
                          >
                        </div>
                      </div>
                    </div>
                    <div class="flex space-x-2 ml-11" @click.stop>
                      <button
                        v-if="task.status === 'not-started'"
                        @click="updateTaskStatus(task._id, 'in-progress')"
                        class="px-3 py-1.5 bg-yellow-600 text-white text-sm rounded-md hover:bg-yellow-700 font-medium"
                      >
                        Start
                      </button>
                      <button
                        v-if="task.status === 'in-progress'"
                        @click="updateTaskStatus(task._id, 'completed')"
                        class="px-3 py-1.5 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 font-medium"
                      >
                        Complete
                      </button>
                      <button
                        @click="deleteTask(task._id)"
                        class="px-3 py-1.5 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

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
      </div>

      <div v-if="isAdmin" class="bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 class="text-xl font-semibold text-white mb-4">All Tasks (Admin)</h2>
        <p class="text-gray-300 mb-6">View all tasks and user progress.</p>

        <div class="mb-6">
          <label class="block text-sm text-gray-300 mb-2">Filter by:</label>
          <select
            v-model="adminFilterType"
            @change="handleFilterTypeChange"
            class="w-full md:w-auto px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Tasks</option>
            <option value="user">By User</option>
            <option value="application">By Application</option>
            <option value="project">By Project</option>
          </select>

          <select
            v-if="adminFilterType === 'user'"
            v-model="adminSelectedUserId"
            @change="loadAdminTasks"
            class="mt-3 w-full md:w-auto px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select user...</option>
            <option v-for="user in allUsers" :key="user._id" :value="user._id">
              {{ user.name }} {{ user.lastname }} ({{ user.email }})
            </option>
          </select>

          <select
            v-if="adminFilterType === 'application'"
            v-model="adminSelectedApplicationId"
            @change="loadAdminTasks"
            class="mt-3 w-full md:w-auto px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select application...</option>
            <option v-for="app in allApplications" :key="app._id" :value="app._id">
              {{ app.idea }} - {{ app.projectId?.name || 'Unknown' }}
            </option>
          </select>

          <select
            v-if="adminFilterType === 'project'"
            v-model="adminSelectedProjectId"
            @change="loadAdminTasks"
            class="mt-3 w-full md:w-auto px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select project...</option>
            <option v-for="project in allProjects" :key="project._id" :value="project._id">
              {{ project.name }}
            </option>
          </select>
        </div>

        <div v-if="isLoadingTasks" class="text-center text-gray-400">Loading tasks...</div>

        <div
          v-else-if="
            adminFilterType !== 'all' &&
            displayedAdminTasks.length === 0 &&
            (adminSelectedUserId || adminSelectedApplicationId || adminSelectedProjectId)
          "
          class="text-center text-gray-400 py-8"
        >
          No tasks found.
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="app in allApplications.filter((a) => {
              if (adminFilterType === 'all') return true
              if (adminFilterType === 'application' && adminSelectedApplicationId) {
                return String(a._id) === String(adminSelectedApplicationId)
              }
              if (adminFilterType === 'project' && adminSelectedProjectId) {
                return String(a.projectId?._id || a.projectId) === String(adminSelectedProjectId)
              }
              if (adminFilterType === 'user' && adminSelectedUserId) {
                return displayedAdminTasks.some(
                  (t) =>
                    String(t.applicationId?._id || t.applicationId) === String(a._id) &&
                    String(t.createdBy?._id || t.createdBy) === String(adminSelectedUserId),
                )
              }
              return displayedAdminTasks.some(
                (t) => String(t.applicationId?._id || t.applicationId) === String(a._id),
              )
            })"
            :key="app._id"
            class="mb-4"
          >
            <div class="bg-gray-700 rounded-lg overflow-hidden">
              <div
                @click="
                  expandedAdminApplications.includes(String(app._id))
                    ? (expandedAdminApplications = expandedAdminApplications.filter(
                        (id) => id !== String(app._id),
                      ))
                    : expandedAdminApplications.push(String(app._id))
                "
                class="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-600 transition"
              >
                <div class="flex-1">
                  <h3 class="text-lg font-medium text-white mb-1">
                    {{ app.idea }} - {{ app.projectId?.name || 'Unknown' }}
                  </h3>
                  <div class="flex items-center gap-4">
                    <span class="text-gray-300 text-sm">
                      Tasks:
                      {{
                        displayedAdminTasks.filter(
                          (t) =>
                            String(t.applicationId?._id || t.applicationId) === String(app._id),
                        ).length
                      }}
                    </span>
                    <span class="text-gray-300 text-sm">
                      Progress:
                      {{
                        Math.round(
                          (displayedAdminTasks.filter(
                            (t) =>
                              String(t.applicationId?._id || t.applicationId) === String(app._id) &&
                              t.status === 'completed',
                          ).length /
                            (displayedAdminTasks.filter(
                              (t) =>
                                String(t.applicationId?._id || t.applicationId) === String(app._id),
                            ).length || 1)) *
                            100,
                        )
                      }}%
                    </span>
                    <span class="text-gray-400 text-sm">
                      User:
                      {{
                        displayedAdminTasks.find(
                          (t) =>
                            String(t.applicationId?._id || t.applicationId) === String(app._id),
                        )?.createdBy?.email ||
                        app.createdBy?.email ||
                        'Unknown'
                      }}
                    </span>
                  </div>
                </div>
                <span class="text-gray-400 text-xl">
                  {{ expandedAdminApplications.includes(String(app._id)) ? '▼' : '▶' }}
                </span>
              </div>

              <div
                v-if="expandedAdminApplications.includes(String(app._id))"
                class="p-4 border-t border-gray-600"
              >
                <template
                  v-for="(task, index) in displayedAdminTasks.filter(
                    (t) => String(t.applicationId?._id || t.applicationId) === String(app._id),
                  )"
                  :key="task._id"
                >
                  <div v-if="index === 0" class="mb-4">
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-gray-300 text-sm">Progress:</span>
                      <span class="text-gray-300 text-sm">
                        {{
                          Math.round(
                            (displayedAdminTasks.filter(
                              (t) =>
                                String(t.applicationId?._id || t.applicationId) ===
                                  String(app._id) && t.status === 'completed',
                            ).length /
                              (displayedAdminTasks.filter(
                                (t) =>
                                  String(t.applicationId?._id || t.applicationId) ===
                                  String(app._id),
                              ).length || 1)) *
                              100,
                          )
                        }}% ({{
                          displayedAdminTasks.filter(
                            (t) =>
                              String(t.applicationId?._id || t.applicationId) === String(app._id) &&
                              t.status === 'completed',
                          ).length
                        }}/{{
                          displayedAdminTasks.filter(
                            (t) =>
                              String(t.applicationId?._id || t.applicationId) === String(app._id),
                          ).length
                        }})
                      </span>
                    </div>
                    <div class="w-full bg-gray-600 rounded-full h-2">
                      <div
                        class="bg-green-500 h-2 rounded-full"
                        :style="{
                          width:
                            Math.round(
                              (displayedAdminTasks.filter(
                                (t) =>
                                  String(t.applicationId?._id || t.applicationId) ===
                                    String(app._id) && t.status === 'completed',
                              ).length /
                                (displayedAdminTasks.filter(
                                  (t) =>
                                    String(t.applicationId?._id || t.applicationId) ===
                                    String(app._id),
                                ).length || 1)) *
                                100,
                            ) + '%',
                        }"
                      ></div>
                    </div>
                  </div>
                </template>

                <div
                  v-if="
                    displayedAdminTasks.filter(
                      (t) => String(t.applicationId?._id || t.applicationId) === String(app._id),
                    ).length === 0
                  "
                  class="text-gray-400 text-sm py-4 text-center"
                >
                  No tasks yet.
                </div>

                <div v-else class="space-y-3">
                  <div
                    v-for="(task, index) in displayedAdminTasks.filter(
                      (t) => String(t.applicationId?._id || t.applicationId) === String(app._id),
                    )"
                    :key="task._id"
                    @click="toggleTaskPopup(task)"
                    class="bg-gray-600 rounded-lg p-4 cursor-pointer hover:bg-gray-500 transition"
                  >
                    <div class="flex items-start gap-3 mb-3">
                      <div
                        class="flex-shrink-0 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm"
                      >
                        {{ index + 1 }}
                      </div>
                      <div class="flex-1">
                        <p class="text-white font-semibold text-base mb-2">{{ task.name }}</p>
                        <p
                          v-if="task.description"
                          class="text-gray-300 text-sm mb-3 leading-relaxed"
                        >
                          {{ task.description }}
                        </p>
                        <div class="space-y-1.5">
                          <p class="text-gray-400 text-sm">
                            <span class="font-medium">User:</span>
                            {{ task.createdBy?.email || 'Unknown' }}
                          </p>
                          <p class="text-gray-400 text-sm">
                            <span class="font-medium">Project:</span>
                            {{ task.projectId?.name || 'Unknown' }}
                          </p>
                          <div class="flex items-center gap-2 mt-2">
                            <span class="text-gray-400 text-sm font-medium">Status:</span>
                            <span
                              :class="
                                task.status === 'completed'
                                  ? 'text-green-400 font-medium'
                                  : task.status === 'in-progress'
                                    ? 'text-yellow-400 font-medium'
                                    : 'text-gray-400 font-medium'
                              "
                              class="text-sm"
                              >{{ task.status }}</span
                            >
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
  </Layout>
</template>

<script setup>
import { reactive, ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useApplicationsStore } from '@/stores/applications'
import { backend } from '@/services/backend'
import Layout from '@/components/Layout.vue'

var authStore = useAuthStore()
var applicationsStore = useApplicationsStore()

var isLoading = ref(false)
var isLoadingUsers = ref(false)
var isLoadingTasks = ref(false)
var errorMessage = ref(null)
var selectedProjectId = ref('')
var openTaskFormForApplicationId = ref('')
var showTaskPopup = ref(false)
var selectedTask = ref(null)
var expandedApplications = ref([])
var expandedAdminApplications = ref([])
var allProjects = ref([])
var allApplications = ref([])
var teamMembers = ref([])
var showApplicationForm = ref(false)
var activeApplicationTab = ref('pending')
var adminFilterType = ref('all')
var adminSelectedUserId = ref('')
var adminSelectedApplicationId = ref('')
var adminSelectedProjectId = ref('')
var allUsers = ref([])

var applicationForm = reactive({
  name: '',
  description: '',
  team: '',
})

var newTaskForm = reactive({
  name: '',
  description: '',
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
}

function toggleTaskPopup(task) {
  selectedTask.value = task
  showTaskPopup.value = !!task
}

var allTasks = ref([])

async function loadTasks() {
  isLoadingTasks.value = true
  try {
    var response = await backend.get('/api/tasks')
    allTasks.value = response.data
  } catch (e) {
    errorMessage.value = 'Error loading tasks'
  }
  isLoadingTasks.value = false
}

var displayedAdminTasks = ref([])

async function loadAdminTasks() {
  isLoadingTasks.value = true
  try {
    if (adminFilterType.value === 'all') {
      var response = await backend.get('/api/tasks')
      displayedAdminTasks.value = response.data || []
    } else {
      var params = {}
      if (adminFilterType.value === 'user' && adminSelectedUserId.value) {
        params = { userId: adminSelectedUserId.value }
      }
      if (adminFilterType.value === 'application' && adminSelectedApplicationId.value) {
        params = { applicationId: adminSelectedApplicationId.value }
      }
      if (adminFilterType.value === 'project' && adminSelectedProjectId.value) {
        params = { projectId: adminSelectedProjectId.value }
      }
      var response = await backend.get('/api/tasks/by-user', { params })
      displayedAdminTasks.value = response.data || []
    }
  } catch (e) {
    errorMessage.value = 'Error loading tasks'
  }
  isLoadingTasks.value = false
}

function handleFilterTypeChange() {
  adminSelectedUserId.value = ''
  adminSelectedApplicationId.value = ''
  adminSelectedProjectId.value = ''
  if (adminFilterType.value === 'all') {
    loadAdminTasks()
  }
}

async function loadAllData() {
  isLoading.value = true
  isLoadingUsers.value = true
  try {
    if (isAdmin.value) {
      var usersResponse = await backend.get('/api/users')
      allUsers.value = usersResponse.data
      teamMembers.value = usersResponse.data.filter((u) => !u.isAdmin)

      var projectsResponse = await backend.get('/api/projects')
      allProjects.value = projectsResponse.data

      var applicationsResponse = await backend.get('/api/applications')
      allApplications.value = applicationsResponse.data
    } else {
      var dashboardResponse = await backend.get('/api/users/dashboard')
      var data = dashboardResponse.data
      allUsers.value = data.users
      teamMembers.value = data.users.filter((u) => !u.isAdmin)
      allProjects.value = data.projects
      myProjects.value = data.myProjects
      allApplications.value = data.applications
      myApplications.value = data.myApplications
    }
  } catch (e) {
    errorMessage.value = 'Error loading data'
  }
  isLoading.value = false
  isLoadingUsers.value = false
}

async function submitApplication() {
  isLoading.value = true
  try {
    await backend.post('/api/applications', {
      projectId: selectedProjectId.value,
      idea: applicationForm.name,
      description: applicationForm.description,
      team: applicationForm.team,
    })
    applicationsStore.addPending(selectedProjectId.value)
    applicationForm.name = ''
    applicationForm.description = ''
    applicationForm.team = ''
    selectedProjectId.value = ''
    await loadAllData()
  } catch (e) {
    errorMessage.value = 'Error submitting application'
  }
  isLoading.value = false
}

async function createTask(app) {
  isLoadingTasks.value = true
  try {
    await backend.post('/api/tasks', {
      projectId: app.projectId._id || app.projectId,
      applicationId: app._id,
      name: newTaskForm.name,
      description: newTaskForm.description,
      status: 'in-progress',
    })
    newTaskForm.name = ''
    newTaskForm.description = ''
    openTaskFormForApplicationId.value = ''
    await loadTasks()
  } catch (e) {
    errorMessage.value = 'Error creating task'
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
  } catch (e) {
    errorMessage.value = 'Error updating task'
  }
  isLoadingTasks.value = false
}

async function deleteTask(taskId) {
  if (!confirm('Delete this task?')) return
  isLoadingTasks.value = true
  try {
    await backend.delete('/api/tasks/' + taskId)
    if (selectedTask.value && selectedTask.value._id === taskId) {
      showTaskPopup.value = false
      selectedTask.value = null
    }
    await loadTasks()
  } catch (e) {
    errorMessage.value = 'Error deleting task'
  }
  isLoadingTasks.value = false
}

onMounted(async () => {
  await loadAllData()
  if (isAdmin.value) {
    await loadAdminTasks()
  } else {
    await loadTasks()
  }
})
</script>
