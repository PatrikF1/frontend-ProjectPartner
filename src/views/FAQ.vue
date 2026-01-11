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
      '<strong>ProjectPartner</strong> is an AI-powered application designed to help students and professors organize and track university projects. The application uses AI technology to assist students with project-related questions, help manage deadlines and tasks, and provide support in decision-making. Professors can monitor student progress in real-time and generate reports on student activities.',
  },
  {
    question: 'How do I use ProjectPartner as a student?',
    answer:
      'After logging in, you will see the <strong>Dashboard</strong> with an overview of your projects and tasks. You can submit project applications to join projects, create tasks for your approved applications, track your progress, and use the <strong>AI Helper</strong> for assistance with your project work. The AI can answer questions about your project, technology, deadlines, and help you solve problems.',
  },
  {
    question: 'What can the AI Helper do for me?',
    answer:
      'The <strong>AI Helper</strong> can answer questions about your projects, help with technology-related questions, provide information about deadlines, suggest solutions to problems you encounter, and even help create tasks or projects. You can ask the AI anything related to your project work, and it will provide helpful responses based on your current projects and tasks.',
  },
  {
    question: 'How do I submit a project application?',
    answer:
      'Go to the <strong>Tasks</strong> page. You will see a "Submit Project Application" section. Select a project from the dropdown, enter your project idea name and description (including your GitHub repository link or other storage link), then click "Submit Application". Wait for your professor to approve your application.',
  },
  {
    question: 'How do I create tasks for my project?',
    answer:
      'After your application is approved, go to the <strong>Tasks</strong> page. Find your approved application and click "Add Task". Fill in the task name, description, and deadline (optional). Click "Create Task" to add it. You can track your progress by updating task status (Not Started, In Progress, Completed).',
  },
  {
    question: 'How do I track my task progress?',
    answer:
      'Click on any task in the <strong>Tasks</strong> page to open the task details. You can update the task status: click "Start Task" to begin working, then "Complete Task" when finished. The system tracks your progress, and your professor can see how many tasks you have completed.',
  },
  {
    question: 'How do I use the Calendar?',
    answer:
      'Go to the <strong>Calendar</strong> page. Click on any day to add an event (like deadlines or important dates). The calendar helps you keep track of important dates related to your projects. You can also see task deadlines automatically added to the calendar.',
  },
  {
    question: 'What information can my professor see?',
    answer:
      'Your professor can see all your tasks, track your progress (how many tasks you completed), view your project applications, and generate reports about your work. This helps professors monitor student participation and ensure fair grading based on actual work done.',
  },
  {
    question: 'How does the AI help with project deadlines?',
    answer:
      'The AI Helper can remind you about upcoming deadlines, help you prioritize tasks, and suggest when to start working on tasks to meet deadlines. You can ask questions like "What deadlines do I have this week?" or "Which tasks should I prioritize?"',
  },
  {
    question: 'Can the AI help me with technical questions?',
    answer:
      'Yes! The AI Helper can answer questions about technologies, programming concepts, project structure, and other technical aspects of your project. Ask questions like "How do I implement authentication?" or "What is the best approach for this feature?"',
  },
  {
    question: 'What if I have a problem with my project?',
    answer:
      'Use the <strong>AI Helper</strong> to get suggestions and solutions. The AI can analyze your project situation and provide recommendations. You can also ask for help with specific problems you are facing in your project work.',
  },
  {
    question: 'How do I join a project?',
    answer:
      'Go to the <strong>Projects</strong> page. Browse available projects created by your professor. Click the "Join Project" button on any project you want to join. You will be added as a member and can then submit project applications.',
  },
  {
    question: 'What is the difference between a student and a professor (admin)?',
    answer:
      '<strong>Students</strong> can submit project applications, join projects, create tasks for their approved applications, and manage their own work. <strong>Professors (admins)</strong> create projects, approve or reject student applications, assign tasks to students, view all student progress, and generate reports on student activities.',
  },
  {
    question: 'How do I see my overall progress?',
    answer:
      'Go to the <strong>Dashboard</strong> page. You will see statistics about your projects, tasks, and applications. You can see how many tasks you have completed, upcoming deadlines, and recent activity. This gives you a clear overview of your project work.',
  },
  {
    question: 'Can I delete tasks I created?',
    answer:
      'Yes, you can delete tasks that you created. Click on a task to open its details, then click the "Delete Task" button and confirm. This action cannot be undone. Professors can also delete tasks they created.',
  },
  {
    question: 'What should I include in my project application description?',
    answer:
      'Include your GitHub repository link or other storage link where your project code is stored, and provide a clear description of your project idea. This helps your professor understand what you want to work on and approve your application.',
  },
  {
    question: 'How does the AI track my activity?',
    answer:
      'The AI Helper has access to information about your projects, tasks, and applications. When you ask questions, it uses this context to provide relevant answers and suggestions. The AI can also help analyze your progress and suggest improvements.',
  },
  {
    question: 'What if I need help but the AI cannot answer?',
    answer:
      'If the AI Helper cannot answer your question, you should contact your professor directly. The AI is designed to help with common questions and provide general guidance, but for specific issues, your professor is the best resource.',
  },
  {
    question: 'How do professors generate reports?',
    answer:
      'Professors can end a project, which automatically generates a PDF report with statistics about all students who worked on the project. The report includes task completion rates, student participation, and overall project progress.',
  },
])
</script>
