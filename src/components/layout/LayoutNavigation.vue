<template>
    <nav class="nav flex-column justify-content-between">
        <div>
            <router-link
                exact
                exact-active-class="active"
                :key="i"
                v-for="(router, i) in routerLinks"
                class="nav-link"
                :to="{ name: router.name }"
            >
                <i class="fa" :class="`fa-${router.meta.icon}`" />
                {{ router.meta.title}}
            </router-link>
            <hr>
            <layout-new-expense />
        </div>
        <layout-logout />
    </nav>
</template>

<script>
import LayoutLogout from './LayoutLogout'
import LayoutNewExpense from './LayoutNewExpense'

export default {
    components: {
        LayoutLogout,
        LayoutNewExpense
    },
    computed: {
        routerLinks() {
            return this.$router.options.routes.filter(r => r.name !== 'Login')
        }
    }
}
</script>

<style scoped lang="scss">
.nav {
    margin-left: -15px;
    height: calc(100vh - 49px);
    width: calc(100% + 30px);
    .nav-link {
        color: var(--white);
        transition: .4s;
        &.active {
            color: var(--featured);
            background-color: transparent;
        }
        &.disabled {
            color: var(--dark-low);
            background-color: transparent;
        }        
        &:hover {
            color: var(--dark);
            background-color: var(--featured);
        } 
    }
}
</style>