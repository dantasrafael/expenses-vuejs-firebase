<template>
    <form class="form-login" @submit.prevent="doLogin()">
        <div class="card">
            <div class="card-header text-center">
                <h1 class="mb-0">Expenses</h1>
            </div>
            <div class="card-body">
                <div class="form-group">
                    <input required type="email" class="form-control" placeholder="E-mail" v-model="email">
                </div>
                <div class="form-group">
                    <input required type="password" class="form-control" placeholder="Senha" v-model="password">
                </div>
                <button class="btn btn-primary w-100" :disabled="loading">
                    <template v-if="loading">
                        Entrando
                        <i class="fa fa-spinner fa-spin"></i>
                    </template>
                    <template v-else>
                        Entrar
                        <i class="fa fa-sign-in-alt"></i>
                    </template>
                </button>
            </div>
        </div>
    </form>
</template>

<script>
export default {
    name: 'Login',
    data: () => {
        return {
            loading: false,
            email: process.env.NODE_ENV === 'development' ? 'dantasrafael@yahoo.com.br' : '',
            password: process.env.NODE_ENV === 'development' ? '123456' : ''
        }
    },
    methods: {
        async doLogin() {
            this.loading = true;
            
            const { email, password } = this
            try {
                const res = await this.$firebase.auth().signInWithEmailAndPassword(email, password)
                
                window.uid = res.user.uid
                this.$router.push({ name: 'Home' })
            } catch (error) {
                let message = ''
                switch (error.code) {
                    case 'auth/user-not-found':
                        message = 'Usuário não encontrado.'
                        break;
                    case 'auth/wrong-password':
                        message = 'Senha inválida.'
                        break;                                
                    default:
                        message = 'Não foi possível fazer o login, tente novamente.'
                        break;
                }

                this.$root.$emit('Notification::show', {
                    type: 'danger',
                    message
                })
            }
            
            this.loading = false;
        }
    }
}
</script>

<style lang="scss" scoped>
.form-login {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

h1 {
    font-size: 18pt;
}

.card {
    width: 30%;
    color: var(--darker)
}
</style>