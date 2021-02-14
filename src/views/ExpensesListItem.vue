<template>
  <div class="expense-list-item row">
      <div class="col-10">
        <div class="description">
          <span>{{ data.description }}</span>
          <i
            class="fa fa-external-link-alt receipt"
            v-if="data.receipt"
            style="margin-left: 5px; color: var(--featured); cursor: pointer"
            title="Ver comprovante"
            @click="openReceipt()"
          />
        </div>
        <small v-date-format="data.createdAt"></small>
      </div>
      <div class="col-2 value" v-money-format="data.value"></div>
  </div>
</template>

<script>
export default {
  props: {
    data: { type: Object, required: true }
  },
  methods: {
    openReceipt() {
      window.open(this.data.receipt, '_blank')
    }
  }
}
</script>

<style lang="scss" scoped>
.expense-list-item {
    padding-top: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--dark-medium);
    .description {
      display: flex;
      align-items: center;
    }
    .value {
      display: flex;
      justify-content: flex-end;
    }
}
</style>