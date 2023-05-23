import { Component, Input, OnInit } from "@angular/core";
import PerfectScrollbar from "perfect-scrollbar";
import { UsuarioService } from "../servicios/usuario.service";


//Metadata
export interface RouteInfo {
  path: string;
  title: string;
  type: string;
  icontype: string;
  collapse?: string;
  children?: ChildrenItems[];
}

export interface ChildrenItems {
  path: string;
  title: string;
  ab: string;
  type?: string;
  collapse?: string;
  children?: ChildrenItems[]; // Agregar esta propiedad opcional
}

//Menu Items
export const ROUTES: RouteInfo[] = [{
  path: '/dashboard',
  title: 'Dashboard',
  type: 'link',
  icontype: 'dashboard'
},
{
  path: '/compras',
  title: 'COMPRAS',
  type: 'sub',
  icontype: 'point_of_sale',
  collapse: 'compras',
  children: [
    { path: 'orden-de-compra',title: 'Orden de Compra',ab: '',type: 'link' },
    { path: 'orden-de-servicio', title: 'Orden de Servicio', ab: '', type: 'link' },
    { path: 'proveedores', title: 'Proveedores', ab: '', type: 'link' },
    { path: 'seguimientos', title: 'Seguimientos', ab: '', type: 'link' },
    { path: 'conformidad-de-pago', title: 'Conformidad de Pagos', ab: '', type: 'link' }
  ]
},
{
  path: '/inventarios',
  title: 'INVENTARIOS',
  type: 'sub',
  icontype: 'inventory',
  collapse: 'inventarios',
  children: [
    { path: '', title: 'Categoria Productos', ab: '', type: 'link' },
    { path: '', title: 'Registro de Productos', ab: '', type: 'link' },
    { path: '', title: 'Movimiento Almacenes', ab: '', type: 'link' },
    { path: '', title: 'Despachos / Remisiones', ab: '', type: 'link' },
    { path: '', title: 'Kardex', ab: '', type: 'link' },
    { path: '', title: 'Valorizaciones', ab: '', type: 'link' }
  ]
},
{
  path: '/produccion',
  title: 'PRODUCCIÓN',
  type: 'sub',
  icontype: 'support',
  collapse: 'produccion',
  children: [
    { path: '', title: 'Recetas', ab: '', type: 'link' },
    { path: '', title: 'Sub Recetas', ab: '', type: 'link' },
    { path: '', title: 'Porcionamiento', ab: '', type: 'link' },
    { path: '', title: 'Merma / Desmedros', ab: '', type: 'link' },
    { path: '', title: 'Transformación', ab: '', type: 'link' }
  ]
},
{
  path: '/operaciones',
  title: 'OPERACIONES',
  type: 'sub',
  icontype: 'web',
  collapse: 'operaciones',
  children: [
    { path: '', title: 'Pedidos / Requerimientos', ab: '', type: 'link' },
    {
      path: 'habitaciones',
      title: 'Habitaciones',
      ab: '', type: 'sub',
      collapse: 'habitaciones',
      children: [
        { path: 'categoria', title: 'Categoria', ab: '', type: 'link' },
        { path: 'tarifas', title: 'Tarifas', ab: '', type: 'link' },
        { path: 'huespedes', title: 'Huéspedes', ab: '', type: 'link' },
      ]
    },
    { path: '', title: 'Restaurantes', ab: '', type: 'link' },
    { path: '', title: 'SPA', ab: '', type: 'link' },
    { path: '', title: 'Boutique', ab: '', type: 'link' },
    { path: '', title: 'Consumos y Facturación', ab: '', type: 'link' }
  ]
},
{
  path: '/recursos-humanos',
  title: 'RECURSOS HUMANOS',
  type: 'sub',
  icontype: 'description',
  collapse: 'recursos-humanos',
  children: [
    { path: '', title: 'Puestos Trabajo', ab: '', type: 'link' },
    { path: '', title: 'Datos de Personal', ab: '', type: 'link' },
    { path: '', title: 'Modalidad de Trabajo', ab: '', type: 'link' },
    {
      path: 'salud-ocupacional',
      title: 'Salud Ocupacional',
      ab: '',
      type: 'sub',
      collapse: 'salud-ocupacional',
      children: [
        { path: 'atenciones-medicas', title: 'Atenciones Medicas', ab: '', type: 'link' },
        { path: 'historia-clinica', title: 'Historia Clinica', ab: '', type: 'link' }
      ]
    },
    { path: '', title: 'Distribución de personal / Roles', ab: '', type: 'link' }
  ]
},
{
  path: '/sistema',
  title: 'SISTEMA',
  type: 'sub',
  icontype: 'settings',
  collapse: 'sistema',
  children: [
    { path: '', title: 'Usuarios', ab: '', type: 'link' },
    { path: '', title: 'Autorizaciones y Firma Digital', ab: '', type: 'link' },
    { path: '', title: 'Solicitantes', ab: '', type: 'link' },
    { path: '', title: 'Panel Auditoría(Bitácora)', ab: '', type: 'link' }
  ]
}
];

@Component({
  selector: 'app-sidebar-cmp',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {
  public menuItems: any[];
  declare $: any;
  nombreUsuario: string | null = "";

  constructor(private usuarioService: UsuarioService) {
    this.menuItems = [];
  }

  isMobileMenu() {
    //$(window).width()
    if (document.documentElement.clientWidth > 991) {
      return false;
    }
    return true;
  };

  ngOnInit() {
    this.nombreUsuario = this.usuarioService.getUsuarioNombre();
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  updatePS(): void {
    if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
      const elemSidebar = <HTMLElement>document.querySelector('.sidebar .sidebar-wrapper');
      let ps = new PerfectScrollbar(elemSidebar, { wheelSpeed: 2, suppressScrollX: true });
    }
  }
  isMac(): boolean {
    let bool = false;
    if (navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.platform.toUpperCase().indexOf('IPAD') >= 0) {
      bool = true;
    }
    return bool;
  }
}
