<template>
  <Layout>
    <div class="min-h-screen bg-gray-900 p-4 sm:p-6 md:p-8">
      <div class="max-w-4xl mx-auto">
        <div class="text-center mb-8">
          <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h1>
          <p class="text-gray-400 text-lg">
            Learn how to use ProjectPartner effectively
          </p>
        </div>

        <div class="space-y-4">
          <div
            v-for="(faq, index) in faqs"
            :key="index"
            class="bg-gray-800 rounded-lg shadow-lg overflow-hidden"
          >
            <button
              @click="toggleFaq(index)"
              class="w-full px-4 sm:px-6 py-4 text-left flex justify-between items-center hover:bg-gray-700 transition-colors"
            >
              <h3 class="text-lg sm:text-xl font-semibold text-white pr-4">
                {{ faq.question }}
              </h3>
              <svg
                :class="[
                  'w-5 h-5 text-gray-400 flex-shrink-0 transition-transform',
                  openFaqs[index] ? 'rotate-180' : '',
                ]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </button>
            <div
              v-if="openFaqs[index]"
              class="px-4 sm:px-6 pb-4 sm:pb-6 text-gray-300 leading-relaxed"
            >
              <div v-html="faq.answer"></div>
            </div>
          </div>
        </div>

        <div class="mt-12 bg-gray-800 rounded-lg shadow-lg p-6 sm:p-8 text-center">
          <h2 class="text-2xl font-bold text-white mb-4">Still have questions?</h2>
          <p class="text-gray-400 mb-6">
            If you need more help, please contact the AI Helper in the bottom right corner of the screen.
          </p>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, reactive } from 'vue'
import Layout from '@/components/Layout.vue'

var openFaqs = ref({})

function toggleFaq(index) {
  if (openFaqs.value[index]) {
    openFaqs.value[index] = false
  } else {
    openFaqs.value[index] = true
  }
}

var faqs = reactive([
  {
    question: 'What is ProjectPartner and what is its purpose?',
    answer:
      '<strong>ProjectPartner</strong> is a project and task management application designed to help teams and individuals organize their work. It allows admins to create projects, members to submit project applications, and everyone to manage tasks, track deadlines, and collaborate effectively. The application provides a dashboard for overview, calendar for events, and task management system for organizing work.',
  },
  {
    question: 'How do I use ProjectPartner?',
    answer:
      'After logging in, you will see the <strong>Dashboard</strong> with an overview of your projects and tasks. As a member, you can submit project applications, join projects, create tasks for approved applications, and manage your work. Admins can create projects, approve/reject applications, assign tasks to members, and manage all projects and users. Use the navigation menu to access different sections: Dashboard, Projects, Calendar, and Tasks.',
  },
  {
    question: 'What can I do in ProjectPartner?',
    answer:
      'You can: <strong>Submit project applications</strong> to join projects, <strong>create and manage tasks</strong> for your approved applications, <strong>track task status</strong> (not started, in progress, completed), <strong>set deadlines and priorities</strong>, <strong>add calendar events</strong>, <strong>view tasks assigned by admins</strong>, <strong>delete your own tasks</strong>, and <strong>use the AI Helper</strong> for assistance. Admins have additional features like creating projects, managing applications, and viewing all users and tasks.',
  },
  {
    question: 'What is the difference between a member and an admin?',
    answer:
      '<strong>Members</strong> can submit project applications, join projects, create tasks for their approved applications, and manage their own work. <strong>Admins</strong> can create projects, approve or reject member applications, assign tasks to members on projects, view all projects and tasks, manage users, and have full access to all features in the application.',
  },
  {
    question: 'How do I create a new project?',
    answer:
      'To create a new project, go to the <strong>Projects</strong> page. If you are an admin, you will see a "Create New Project" section at the top. Fill in the project name, description, type, and capacity, then click "Create Project".',
  },
  {
    question: 'How do I submit a project application?',
    answer:
      'As a member, go to the <strong>Tasks</strong> page. You will see a "Submit Project Application" section. Select a project from the dropdown, enter your project idea name and description, then click "Submit Application". Wait for admin approval.',
  },
  {
    question: 'How do I create tasks?',
    answer:
      'After your application is approved, go to the <strong>Tasks</strong> page. Find your approved application and click "Add Task". Fill in the task name, description, deadline (optional), and priority. Click "Create Task" to add it.',
  },
  {
    question: 'How do I update task status?',
    answer:
      'Click on any task in the <strong>Tasks</strong> page to open the task details popup. You will see status buttons (Not Started, In Progress, Completed). Click the desired status to update it.',
  },
  {
    question: 'How do I join a project?',
    answer:
      'Go to the <strong>Projects</strong> page. Browse available projects and click the "Join Project" button on any project you want to join. You will be added as a member and redirected to the Tasks page.',
  },
  {
    question: 'How do I leave a project?',
    answer:
      'On the <strong>Projects</strong> page, find the project you want to leave. Click the "Leave Project" button. You will be removed from the project members list.',
  },
  {
    question: 'How do I add events to the calendar?',
    answer:
      'Go to the <strong>Calendar</strong> page. Click on any day in the calendar to open the "Add Event" form. Fill in the event title, description, and optionally select a project. Click "Add Event" to save it.',
  },
  {
    question: 'How do I view tasks assigned by admin?',
    answer:
      'As a member, go to the <strong>Tasks</strong> page. You will see all tasks for projects where you are a member, including tasks created by admins. Tasks are organized by your approved applications.',
  },
  {
    question: 'How do I delete a task?',
    answer:
      'You can delete tasks that you created. Click on a task in the <strong>Tasks</strong> page to open its details, then click the "Delete Task" button and confirm the deletion. This action cannot be undone. Admins can delete tasks they created from the admin tasks table.',
  },
  {
    question: 'What is the Dashboard for?',
    answer:
      'The <strong>Dashboard</strong> provides an overview of your projects, tasks, and applications. You can see statistics, recent tasks, upcoming deadlines, and past tasks. Admins can also filter and view all projects and tasks.',
  },
  {
    question: 'How do I use the AI Chatbot?',
    answer:
      'The AI Chatbot is available in the bottom right corner of the screen. Click on it to open the chat. You can ask questions about your projects, tasks, or get help with using the application.',
  },
  {
    question: 'What are the different task statuses?',
    answer:
      'Tasks can have three statuses: <strong>Not Started</strong> (task not yet begun), <strong>In Progress</strong> (task is being worked on), and <strong>Completed</strong> (task is finished).',
  },
  {
    question: 'What are task priorities?',
    answer:
      'Tasks can have three priority levels: <strong>Low</strong> (not urgent), <strong>Medium</strong> (normal priority), and <strong>High</strong> (urgent and important).',
  },
  {
    question: 'How do I view my profile?',
    answer:
      'Click on your profile picture in the sidebar (desktop) or mobile menu. This will take you to your <strong>Profile</strong> page where you can view your account information.',
  },
  {
    question: 'Can I edit my profile?',
    answer:
      'Currently, profile editing is not available. Your profile information is managed by the system administrator.',
  },
  {
    question: 'What is the difference between Projects and Applications?',
    answer:
      '<strong>Projects</strong> are created by admins and represent available project categories. <strong>Applications</strong> are your project ideas that you submit to join a project. Once approved, you can create tasks for your application.',
  },
  {
    question: 'How do admins approve or reject applications?',
    answer:
      'Admins go to the <strong>Projects</strong> page and see all pending applications. They can click "Approve" or "Reject" on any application. Approved applications allow members to create tasks.',
  },
  {
    question: 'How do I filter tasks?',
    answer:
      'On the <strong>Tasks</strong> page, you can filter tasks by project using the "Filter by Project" dropdown, by status using "Filter by Status", and search tasks using the search box. Click "Clear Filters" to reset.',
  },
])
</script>

