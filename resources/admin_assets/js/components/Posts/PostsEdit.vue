<template>
    <v-row>
        <v-col
            cols="12"
            md="8"
            sm="10"
        >
            <v-form
                ref="form"
                v-model="valid"
                @submit="submit"
            >

                <v-card class="pa-5">
                    <v-text-field
                        label="عنوان"
                        v-model="form.title"
                        reverse
                        :rules="titleRules"
                    ></v-text-field>
                    <v-textarea
                        :rules="excerptRule"
                        counter
                        v-model="form.excerpt"
                        label="خلاصه"
                        reverse
                        auto-grow
                        rows="1"
                    ></v-textarea>
                    <v-row>
                        <v-col md="4" sm="12">
                            <v-combobox
                                v-model="form.tags"
                                :items="tagItems"
                                :rules="tagRules"
                                :loading="tagIsLoading"
                                :search-input.sync="searchTags"
                                chips
                                deletable-chips
                                multiple
                                label='tag'></v-combobox>
                        </v-col>
                        <v-col md="4" sm="12">
                            <v-autocomplete
                                v-model="form.categories"
                                :items="catItems"
                                :rules="categoryRules"
                                :loading="isLoading"
                                :search-input.sync="searchCat"
                                chips
                                deletable-chips
                                label='دسته بندی'></v-autocomplete>
                        </v-col>
                        <v-col md="4" sm="12">
                            <v-combobox
                                v-model="form.status"
                                :items="statusItems"
                                :rules="statusRules"
                                chips
                                deletable-chips
                                label='وضعیت'></v-combobox>
                        </v-col>
                    </v-row>
                    <v-divider></v-divider>
                    <v-col sm="12" class="ma-5">
                        <v-label class="ma-5"><h3>متن</h3></v-label>
                    </v-col>
                    <my-editor v-model="form.content"></my-editor>
                    <!--<label v-if="contentError">{{contentError}}</label>-->
                    <v-row>
                        <v-col md="6" sm="12">
                            <v-file-input
                                v-model="form.poster"
                                ref="poster"
                                placeholder="انتخاب پوستر"
                                label=" پوستر"
                                prepend-icon="mdi-paperclip"
                                :rules="posterRule"
                            >
                                <template v-slot:selection="{ text }">
                                    <v-chip
                                        small
                                        label
                                        color="primary"
                                    >
                                        {{ text }}
                                    </v-chip>
                                </template>
                            </v-file-input>

                        </v-col>
                        <v-col md="6" sm="12">
                            <v-img contain height="150px" v-if="posterImg" :src="posterImg"></v-img>
                        </v-col>

                    </v-row>
                    <v-row>
                        <v-col md="6" sm="12">
                            <v-file-input
                                v-model="form.backdrop"
                                placeholder="انتخاب تصویر عمودی"
                                label="تصویر عمودی"
                                prepend-icon="mdi-paperclip"
                                :rules="backdropRule"
                            >
                                <template v-slot:selection="{ text }">
                                    <v-chip
                                        small
                                        label
                                        color="primary"
                                    >
                                        {{ text }}
                                    </v-chip>
                                </template>
                            </v-file-input>

                        </v-col>
                        <v-col md="6" sm="12">
                            <v-img contain height="150px" v-if="backdropImg" :src="backdropImg"></v-img>
                        </v-col>
                    </v-row>

                    <v-btn color="primary" ripple block class="mt-5" :disabled="!valid" @click="submit"
                           :loading="formLoading">ذخیره
                    </v-btn>

                </v-card>

            </v-form>
        </v-col>
    </v-row>
</template>


<script>


    import MyEditor from "../Layouts/my-editor";

    export default {
        name: "PostsCreate",
        components: {MyEditor},
        data() {
            return {
                posterImg: null,
                backdropImg: null,
                tagIsLoading: false,
                isLoading: false,
                formLoading: false,
                searchCat: null,
                searchTags: '',
                valid: false,
                form: {
                    content: '',
                    categories: null,
                    tags: [],
                    status: [],
                    title: '',
                    poster: [],
                    backdrop: [],
                    excerpt: '',
                    id: this.$route.params.id,
                },
                tag: [],
                catItems: [],
                statusItems: [],
                title: '',
                excerpt: '',
                tagItems: [],
                titleRules: [
                    v => !!v || 'عنوان الزامی است',
                    v => v.length >= 3 || 'حداقل 6 کاراکتر الزامی است',
                ],
                posterRule: [
                    v => this.posterImg !== null || 'پوستر الزامی است',
                ],
                backdropRule: [
                    v => this.backdropImg !== null || 'تصویر عمودی الزامی است',
                ],
                excerptRule: [
                    v => !!v || 'عنوان الزامی است',
                    v => v.length >= 30 || 'حداقل 30 کاراکتر الزامی است',
                ],
                tagRules: [
                    v => {
                        return !!v.length || 'انتخاب تگ الزامی است'
                    },
                ],
                statusRules: [
                    v => {
                        return !!this.form.status || 'انتخاب وضعیت الزامی است'
                    },
                ],
                categoryRules: [
                    v => !!this.form.categories || 'انتخاب دسته بندی الزامی است',
                ]
            }
        },
        computed: {
            contentError() {
                return this.form.content.length < 150 ? 'حداقل 150 کاراکتر الزامی است' : false;
            }
        },
        methods: {
            posterSelected($event) {
                console.log($event)
            },
            submit() {
                this.formLoading = true;

                var postData = JSON.stringify(this.form);
                var form_data = new FormData();
                form_data.append("form", postData);
                form_data.append("poster", this.form.poster);
                form_data.append("backdrop", this.form.backdrop);
                axios.post('/admin/contents/posts/' + this.$route.params.id + '/update', form_data, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }).then(r => {
                    this.$router.push({name: 'posts.index'});
                })
            }
        },
        watch: {
            'form.poster': function (newVal, oldVal) {
                if (newVal === null) {
                    return this.posterImg = this.form.posterImg.url;
                }
                this.posterImg = URL.createObjectURL(newVal);
            },
            'form.backdrop': function (newVal, oldVal) {
                if (newVal === null) {
                    return this.backdropImg = this.form.backdropImg.url;
                }
                this.backdropImg = URL.createObjectURL(newVal);
            },
            searchCat: {
                handler(val) {

                    if (this.isLoading) return
                    this.isLoading = true
                    // Lazily load input items

                    axios.post('/admin/contents/categories/search', {val})
                        .then(res => {
                            this.count = res.data.length
                            this.catItems = res.data.data
                        })
                        .catch(err => {
                            console.log(err)
                        })
                        .finally(() => (this.isLoading = false))
                },
                immediate: true
            },
            searchTags: {
                handler(val) {

                    if (this.tagIsLoading) return
                    this.tagIsLoading = true
                    // Lazily load input items

                    axios.post('/admin/contents/posts/search-tags', {val})
                        .then(res => {
                            this.count = res.data.length
                            this.tagItems = res.data.data
                        })
                        .catch(err => {
                            console.log(err)
                        })
                        .finally(() => (this.tagIsLoading = false))
                },
                immediate: true
            }
        },

        mounted() {
            axios.post('/admin/contents/posts/' + this.$route.params.id + '/edit').then(r => {
                console.log(r.data.data)
                this.form = r.data.data;
                this.posterImg = r.data.data.posterImg.url;
                this.backdropImg = r.data.data.backdropImg.url;
                this.catItems = r.data.data.categoryItems;
                this.statusItems = r.data.data.statusItems;
            });
        }
    }
</script>

