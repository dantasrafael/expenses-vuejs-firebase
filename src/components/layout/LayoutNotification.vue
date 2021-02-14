<template>
    <div class="alert alert-warning alert-dismissible fade show" v-if="show" :class="`alert-${type}`">
        {{ message }}
        <button type="button" class="close" @click="close()">
            <span>&times;</span>
        </button>
    </div>
</template>

<script>
export default {
    data: () => ({
        show: false,
        type: 'danger',
        message: ''
    }),
    created() {
        this.$root.$on('Notification::show', payload => {
            this.show = true
            this.type = payload.type
            this.message = payload.message

            setTimeout(() => { this.close() }, payload.timeout || 2000)
        })
    },
    methods: {
        close() {
            this.show = false
            this.message = ''
            this.type = 'danger'
        }
    }
}
</script>

<style scoped lang="scss">
.alert {
    top: 20px;
    right: 20px;
    z-index: 1000;
    max-width: 400px;
    position: absolute;
}
</style>