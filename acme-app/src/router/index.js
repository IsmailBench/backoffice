import Vue from 'vue'
import Router from 'vue-router'
import tableDevicesComponent from "../tableDevicesComponent.vue";
import tableGatewaysComponent from "../tableGatewaysComponent.vue";
import tableLogsComponent from "../tableLogsComponent.vue";

Vue.use(Router)

export default new Router({
    routes: [
        { path: '/', component: tableLogsComponent, name: "tableLogsComponent" },
        { path: '/devices', component: tableDevicesComponent, name: "tableDevicesComponent" },
        { path: '/gateways', component: tableGatewaysComponent, name: "tableGatewaysComponent"},
    ]
})