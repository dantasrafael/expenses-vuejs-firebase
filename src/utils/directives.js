import Vue from 'vue'

Vue.directive('money-format', (el, { value }) => {
    el.innerHTML = new Intl.NumberFormat('pt-BR', {
        currency: 'BRL',
        style: 'currency',
        minimumFractionDigits: 2
    }).format(value || 0)
})

Vue.directive('date-format', (el, { value }) => {
    const refDate = new Date(value) 
    el.innerHTML = `${refDate.toLocaleDateString()} às ${refDate.toLocaleTimeString()}`
})
