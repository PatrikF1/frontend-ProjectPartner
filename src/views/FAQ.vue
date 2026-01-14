<template>
  <Layout>
    <div class="min-h-screen bg-gray-900 p-4 sm:p-6 md:p-8">
      <div class="max-w-4xl mx-auto">
        <div class="text-center mb-8">
          <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h1>
          <p class="text-gray-400 text-lg">Learn how to use ProjectPartner effectively</p>
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
            If you need more help, please contact the AI Helper in the bottom right corner of the
            screen.
          </p>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref } from 'vue'
import Layout from '@/components/Layout.vue'

var openFaqs = ref({})

function toggleFaq(index) {
  if (openFaqs.value[index]) {
    openFaqs.value[index] = false
  } else {
    openFaqs.value[index] = true
  }
}

var faqs = [
  {
    question: 'What is ProjectPartner?',
    answer:
      '<strong>ProjectPartner</strong> is an app that helps students and professors organize university projects. Students can track tasks and deadlines, professors can monitor progress and generate reports.',
  },
  {
    question: 'How do I join a project?',
    answer: 'Go to <strong>Projects</strong> page and click "Join" on a project you want to join.',
  },
  {
    question: 'How do I submit a project application?',
    answer:
      'Go to <strong>Tasks</strong> page, select a project, enter your idea name and description with your GitHub link, then click "Submit Application".',
  },
  {
    question: 'How do I create and manage tasks?',
    answer:
      'After your application is approved, go to <strong>Tasks</strong> page, click "Add Task", fill in the details. Update status by clicking "Start Task" or "Complete Task".',
  },
  {
    question: 'How do I use the Calendar?',
    answer:
      'Go to <strong>Calendar</strong> page. Click any day to add an event. Task deadlines are shown automatically.',
  },
  {
    question: 'What can the AI Helper do?',
    answer:
      'The AI can answer questions about your projects, help with deadlines, suggest task priorities, and help solve problems you encounter.',
  },
  {
    question: 'What can my professor see?',
    answer:
      'Professors can see all your tasks, track progress, view applications, and generate PDF reports.',
  },
  {
    question: 'How do I see my progress?',
    answer:
      'Go to <strong>Dashboard</strong> to see statistics about your projects, tasks, and applications.',
  },
  {
    question: 'Can I delete tasks?',
    answer: 'Yes, click on a task and then click "Delete Task". This cannot be undone.',
  },
  {
    question: 'What is the difference between student and admin?',
    answer:
      '<strong>Students</strong> join projects, submit applications, and create tasks. <strong>Admins (professors)</strong> create projects, approve applications, and generate reports.',
  },
]
</script>
