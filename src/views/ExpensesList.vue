<template>
  <div>
    <div class="months-navigation">
      <div 
        class="month-link"
        v-for="(m, i) in groupedMonths"
        :key="i"
        :class="{ active: m.month === activeMonth.month }"
        @click="setActiveMonth(m)">
        <div class="month-label">{{ m.month }}</div>
        <div class="value-label" v-money-format="m.total"></div>
      </div>
    </div>

    <div class="container-lx">
        <template v-if="activeMonth.data">
          <expenses-list-item
            v-for="(item, index) in activeMonth.data"
            :key="index"
            :data="item"
          >
          {{ item }}
          </expenses-list-item>
        </template>
      </div>
    </div>
</template>

<script>
import ExpensesListItem from './ExpensesListItem'

export default {
  name: 'ExpensesList',
  components: {
    ExpensesListItem
  },
  data: () => ({
    expenses: [],
    activeMonth: {}
  }),
  created() {
    this.getData()
  },
  computed: {
    groupedMonths() {
      if (this.expenses.length) {
        const groupBy = function (list, keyGetter) {
          const map = new Map();
          list.forEach((item) => {
            const key = keyGetter(item);
            const collection = map.get(key);
            if (!collection) {
              map.set(key, [item]);
            } else {
              collection.push(item);
            }
          });
          return map;
        }
        return Array.from(groupBy(this.expenses, exp => {
          const ref = new Date(exp.createdAt)
          return `${("0" + (ref.getMonth() + 1)).slice(-2)}/${ref.getFullYear()}`
        })).map(m => ({
          month: m[0],
          total: m[1].map(e => +e.value).reduce((a, b) => a + b, 0),
          data: m[1]
        }))
      } else {
        return []
      }
    }
  },
  methods: {
    getData() {
      const ref = this.$firebase.database().ref(`/${window.uid}`)
      ref.on('value', data => {
        const values = data.val()
        this.expenses = Object.keys(values).map(i => values[i]).sort((a, b) => a.createdAt - b.createdAt)
        this.activeMonth = {}
      })
    },
    setActiveMonth(month) {
      this.activeMonth = month
    }
  }
}
</script>

<style lang="scss" scoped>
.months-navigation {
  display: flex;
  width: calc(100% + 30px);
  margin-left: -15px;
  background-color: var(--featured-dark);
  .month-link {
    padding: 15px;
    cursor: pointer;
    transition: .4s;
    text-align: center;
    &:hover {
      background-color: var(--featured);
    }
    &.active {
      background-color: var(--featured);
    }
    .value-label {
      color: var(--darker);
      font-size: 8pt;
    }
  }
}

.container {
  overflow: hidden auto;
  height: calc(100vh - 70px);
  width: 100%;    
  font-size: 15pt;
  padding-top: 15px;
  padding-bottom: 15px;
}
</style>