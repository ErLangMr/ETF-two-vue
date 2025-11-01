import { defineStore } from 'pinia'

export const usePortfolioSimulatorStore = defineStore('portfolioSimulator', {
  state: () => ({
    selectETFList: []
  })
})
