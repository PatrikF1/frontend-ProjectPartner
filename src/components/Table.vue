<template>
  <div
    class="bg-white dark:bg-gray-900 flex flex-col rounded-lg w-full shadow-lg border border-gray-200 dark:border-gray-700"
  >
    <!-- Top Controls -->
    <div class="flex items-center px-6 py-4 gap-4">
      <div class="relative max-w-60">
        <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </span>
        <input
          type="search"
          class="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Search for items"
          v-model="searchQuery"
        />
      </div>
      <div class="flex flex-1 items-center justify-end gap-4">
        <select
          v-model="itemsPerPage"
          class="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="30">30</option>
        </select>
      </div>
    </div>

    <!-- Pagination Info -->
    <div
      class="flex items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-700 px-6 py-4"
    >
      <div class="text-sm text-gray-600 dark:text-gray-400">
        Showing {{ startIndex + 1 }} to {{ endIndex }} of {{ filteredProducts.length }} products
      </div>
      <div class="flex items-center space-x-2">
        <button
          @click="currentPage = 1"
          :disabled="currentPage === 1"
          class="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
            ></path>
          </svg>
        </button>
        <button
          @click="currentPage--"
          :disabled="currentPage === 1"
          class="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            ></path>
          </svg>
        </button>

        <div class="flex items-center space-x-1">
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="currentPage = page"
            :class="[
              'px-3 py-1 text-sm rounded-lg transition-colors',
              page === currentPage
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800',
            ]"
          >
            {{ page }}
          </button>
          <span v-if="showEllipsis" class="px-2 text-gray-500">...</span>
        </div>

        <button
          @click="currentPage++"
          :disabled="currentPage === totalPages"
          class="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            ></path>
          </svg>
        </button>
        <button
          @click="currentPage = totalPages"
          :disabled="currentPage === totalPages"
          class="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 5l7 7-7 7M6 5l7 7-7 7"
            ></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <div class="inline-block min-w-full align-middle">
        <div class="overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th class="w-12 px-6 py-3">
                  <div class="flex h-5 items-center">
                    <input
                      type="checkbox"
                      class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      v-model="selectAll"
                      @change="toggleSelectAll"
                    />
                  </div>
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  PRODUCT NAME
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  PRICE
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  AVAILABILITY
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              <tr
                v-for="product in paginatedProducts"
                :key="product.id"
                class="hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td class="w-12 px-6 py-4 whitespace-nowrap">
                  <div class="flex h-5 items-center">
                    <input
                      type="checkbox"
                      class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      v-model="product.selected"
                    />
                  </div>
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white"
                >
                  {{ product.name }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ product.price }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="[
                      'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                      product.availability === 'In Stock'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : product.availability === 'Limited'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
                    ]"
                  >
                    {{ product.availability }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  <div class="flex space-x-2">
                    <button
                      class="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                      aria-label="Edit"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        ></path>
                      </svg>
                    </button>
                    <button
                      class="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                      aria-label="Delete"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        ></path>
                      </svg>
                    </button>
                    <button
                      class="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                      aria-label="More options"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                        ></path>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Bottom Controls -->
    <div class="flex items-center border-t border-gray-200 dark:border-gray-700 px-6 py-4 gap-4">
      <div class="relative max-w-60">
        <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </span>
        <input
          type="search"
          class="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Search for items"
          v-model="searchQuery"
        />
      </div>
      <div class="flex flex-1 items-center justify-end gap-4">
        <select
          v-model="itemsPerPage"
          class="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="30">30</option>
        </select>
      </div>
    </div>

    <!-- Bottom Pagination -->
    <div class="flex items-center justify-between gap-4 px-6 py-4">
      <div class="text-sm text-gray-600 dark:text-gray-400">
        Showing {{ startIndex + 1 }} to {{ endIndex }} of {{ filteredProducts.length }} products
      </div>
      <div class="flex items-center space-x-2">
        <button
          @click="currentPage = 1"
          :disabled="currentPage === 1"
          class="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
            ></path>
          </svg>
        </button>
        <button
          @click="currentPage--"
          :disabled="currentPage === 1"
          class="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            ></path>
          </svg>
        </button>

        <div class="flex items-center space-x-1">
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="currentPage = page"
            :class="[
              'px-3 py-1 text-sm rounded-lg transition-colors',
              page === currentPage
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800',
            ]"
          >
            {{ page }}
          </button>
          <span v-if="showEllipsis" class="px-2 text-gray-500">...</span>
        </div>

        <button
          @click="currentPage++"
          :disabled="currentPage === totalPages"
          class="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            ></path>
          </svg>
        </button>
        <button
          @click="currentPage = totalPages"
          :disabled="currentPage === totalPages"
          class="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 5l7 7-7 7M6 5l7 7-7 7"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Product {
  id: number
  name: string
  price: string
  availability: 'In Stock' | 'Limited' | 'Out of Stock'
  selected: boolean
}

const products = ref<Product[]>([
  { id: 1, name: 'Apple iPhone 15', price: '$999', availability: 'In Stock', selected: false },
  { id: 2, name: 'Samsung Galaxy S23', price: '$899', availability: 'Limited', selected: false },
  { id: 3, name: 'Sony WH-1000XM5', price: '$399', availability: 'Out of Stock', selected: false },
  { id: 4, name: 'Dell XPS 15', price: '$1,299', availability: 'In Stock', selected: false },
  { id: 5, name: 'Logitech MX Master 3', price: '$99', availability: 'Limited', selected: false },
  {
    id: 6,
    name: 'Microsoft Surface Laptop 5',
    price: '$1,499',
    availability: 'In Stock',
    selected: false,
  },
  {
    id: 7,
    name: 'HP Spectre x360',
    price: '$1,199',
    availability: 'Out of Stock',
    selected: false,
  },
  { id: 8, name: 'Apple Watch Series 9', price: '$499', availability: 'Limited', selected: false },
  { id: 9, name: 'Google Pixel 7', price: '$599', availability: 'In Stock', selected: false },
  {
    id: 10,
    name: 'Bose QuietComfort Earbuds II',
    price: '$279',
    availability: 'Out of Stock',
    selected: false,
  },
  {
    id: 11,
    name: 'Asus ROG Zephyrus G14',
    price: '$1,899',
    availability: 'In Stock',
    selected: false,
  },
  { id: 12, name: 'Sony PlayStation 5', price: '$499', availability: 'Limited', selected: false },
  {
    id: 13,
    name: 'Amazon Echo Dot (5th Gen)',
    price: '$49',
    availability: 'In Stock',
    selected: false,
  },
  {
    id: 14,
    name: 'NVIDIA GeForce RTX 4090',
    price: '$1,599',
    availability: 'Limited',
    selected: false,
  },
  {
    id: 15,
    name: 'Lenovo ThinkPad X1 Carbon',
    price: '$1,799',
    availability: 'In Stock',
    selected: false,
  },
  {
    id: 16,
    name: 'Google Nest Hub (2nd Gen)',
    price: '$99',
    availability: 'In Stock',
    selected: false,
  },
  { id: 17, name: 'Fitbit Charge 6', price: '$149', availability: 'Limited', selected: false },
  {
    id: 18,
    name: 'Razer Blade 16',
    price: '$2,499',
    availability: 'Out of Stock',
    selected: false,
  },
  { id: 19, name: 'Oculus Quest 3', price: '$499', availability: 'In Stock', selected: false },
  { id: 20, name: 'Canon EOS R8', price: '$1,699', availability: 'Limited', selected: false },
  { id: 21, name: 'DJI Mavic 3 Pro', price: '$2,199', availability: 'In Stock', selected: false },
  {
    id: 22,
    name: 'Alienware Aurora R15',
    price: '$2,899',
    availability: 'Out of Stock',
    selected: false,
  },
  {
    id: 23,
    name: 'SteelSeries Arctis Nova Pro',
    price: '$349',
    availability: 'Limited',
    selected: false,
  },
])

const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(5)
const selectAll = ref(false)

// Filter products based on search
const filteredProducts = computed(() => {
  if (!searchQuery.value) return products.value
  return products.value.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})

// Pagination
const totalPages = computed(() => Math.ceil(filteredProducts.value.length / itemsPerPage.value))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() =>
  Math.min(startIndex.value + itemsPerPage.value, filteredProducts.value.length),
)

const paginatedProducts = computed(() => {
  return filteredProducts.value.slice(startIndex.value, endIndex.value)
})

// Visible pages for pagination
const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value

  if (total <= 5) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (currentPage.value <= 3) {
      pages.push(1, 2, 3, 4, 5)
    } else if (currentPage.value >= total - 2) {
      pages.push(total - 4, total - 3, total - 2, total - 1, total)
    } else {
      pages.push(
        currentPage.value - 2,
        currentPage.value - 1,
        currentPage.value,
        currentPage.value + 1,
        currentPage.value + 2,
      )
    }
  }

  return pages
})

const showEllipsis = computed(() => {
  return totalPages.value > 5 && currentPage.value > 3 && currentPage.value < totalPages.value - 2
})

const toggleSelectAll = () => {
  products.value.forEach((product) => {
    product.selected = selectAll.value
  })
}

watch(filteredProducts, () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = 1
  }
})

watch(itemsPerPage, () => {
  currentPage.value = 1
})
</script>
