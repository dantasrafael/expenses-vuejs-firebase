<template>
    <div class="w-100 d-flex align-items-center justify-content-center">
        <button class="btn btn-lg btn-outline-primary w-75" @click="showModal = true">
            <i class="fa fa-plus"></i>
            Nova despesa
        </button>

        <form @submit.prevent="submit()">
            <div class="modal fade" style="display: block;" :class="{show: showModal}" :style="{display: showModal ? 'block' : 'none'}">
                <div class="modal-dialog modal-lg" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Adicionar uma nova despesa</h5>
                            <button type="button" class="close" @click="closeModal">
                                <span>x</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <div class="form-group col-8">
                                    <label for="">Descrição:</label>
                                    <input type="text" class="form-control" required v-model="form.description">
                                </div>
                                <div class="form-group col-4">
                                    <label for="">Valor (R$):</label>
                                    <input type="text" class="form-control" required v-model="form.value">
                                </div>
                                <div class="form-group col-12 d-flex align-items-center flex-column">
                                    <input ref="input" type="file" class="d-none" accept="image/*" @change="handleFile($event)">
                                    <button type="button" class="btn btn-outline-secondary w-50" @click="openFileDialog()">
                                        Adicionar comprovante
                                    </button>
                                    <div class="mt-2" v-if="form.receipt">
                                        {{ form.receipt.name }}
                                        <button type="button" class="btn badge badge-light" @click="form.receipt = null">
                                            <i class="fa fa-trash text-danger"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
                            <button class="btn btn-primary">Incluir nova despesa</button>
                        </div>
                    </div>
                </div>
            </div>
        </form>

        <div class="modal-backdrop fade" :class="{show: showModal}" :style="{display: showModal ? 'block' : 'none'}"></div>
    </div>
</template>

<script>
export default {
    data: () => ({ 
        showModal: false,
        form: {
            value: '',
            description: '',
            receipt: ''
        }
    }),
    computed: {
        fileName() {
            const { receipt } = this.form

            if (receipt) {
                const split = receipt.name.split('.')
                return `${split[0]}-${new Date().getTime()}.${split[1]}`
            } else {
                return ''
            }
        }
    },
    methods: {
        async submit() {
            try {
                this.$root.$emit('Spinner::show')
                
                let url = ''
                const ref = this.$firebase.database().ref(window.uid)
                const id = ref.push().key
                
                if (this.form.receipt) {
                    const snapshot = await this.$firebase.storage()
                        .ref(window.uid)
                        .child(this.fileName)
                        .put(this.form.receipt)
                    
                    url = await snapshot.ref.getDownloadURL()
                }

                const payload = {
                    id,
                    createdAt: new Date().getTime(),
                    ...this.form,
                    receipt: url
                }
                ref.child(id).set(payload, err => {                
                    if (err) {
                        this.$root.$emit('Notification::show', {
                            type: 'danger',
                            message: 'Não foi possível inserir a despesa.'
                        })
                    } else {
                        this.$root.$emit('Notification::show', {
                            type: 'success',
                            message: 'Despesa inserida com sucesso.'
                        })
                        this.closeModal()
                    }
                })                
            } catch (error) {
                this.$root.$emit('Notification::show', {
                    type: 'danger',
                    message: 'Não foi possível inserir a despesa.'
                })
            } finally {
                this.$root.$emit('Spinner::hide')
            }
        },
        closeModal() {
           this.showModal = false 
        },
        openFileDialog() {
            this.$refs.input.value = null
            this.$refs.input.click()
        },
        handleFile({ target }) {
            this.form.receipt = target.files[0]
        }
    }
}
</script>

<style scoped lang="scss">
.modal {
    color: var(--darker);
}
</style>