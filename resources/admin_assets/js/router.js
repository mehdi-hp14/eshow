import Vue from 'vue';
import VueRouter from 'vue-router';
import Posts from './routes/posts';

Vue.use(VueRouter);

let routes = []
    .concat(Posts)
const router = new VueRouter({
    base: '/',
    mode: 'history',
    routes: routes,
    // scrollBehavior() {
    //     setTimeout(() => window.scrollTo({top: 0, behavior: 'smooth'}), 50);
    // },
});

export default router;
