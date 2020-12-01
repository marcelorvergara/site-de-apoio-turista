
import Home from '@/components/Home'
import AcessoRestrito from "@/components/AcessoRestrito";
import AcessoPrefeitura from "@/components/AcessoPrefeitura";
import AdministracaoPOI from "@/components/AdministracaoPOI";

export const routes = [
        {
            path: '',
            name: 'Home',
            component: Home
        },
        {
            path: '/AcessoRestrito',
            name: 'AcessoRestrito',
            component: AcessoRestrito
        },
        {
            path: '/AcessoPrefeitura',
            name: 'AcessoPrefeitura',
            component: AcessoPrefeitura
        },
        {
            path: '/AdministracaoPOI',
            name: 'AdministracaoPOI',
            component: AdministracaoPOI
        }

]